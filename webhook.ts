import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Inicializa o cliente do Supabase com a Service Role Key (Poder de Admin)
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const kiwifySecretToken = process.env.KIWIFY_TOKEN!; 

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Garantir que é um pedido POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. AUTENTICAÇÃO: Validar se o token enviado na URL bate com o seu token secreto
    const { token } = req.query;
    if (token !== kiwifySecretToken) {
      console.error('🚫 Tentativa de acesso não autorizada ao Webhook.');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = req.body;
    const { order_status, Customer, order_id } = payload;

    if (!Customer || !Customer.email) {
      return res.status(400).json({ error: 'Payload incompleto: dados do cliente ausentes' });
    }

    // 2. MÁQUINA DE ESTADOS DO PEDIDO
    switch (order_status) {
      case 'paid': // Compra Aprovada
        console.log(`🛒 Processando compra aprovada para: ${Customer.email}`);
        
        // Estratégia de senha: usa os 6 primeiros dígitos do telefone ou uma padrão
        const cleanMobile = Customer.mobile ? Customer.mobile.replace(/\D/g, '') : '';
        const tempPassword = cleanMobile.substring(0, 6) || 'nota1000';

        // Cria o utilizador no Supabase Auth em silêncio
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: Customer.email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: { name: Customer.full_name || Customer.first_name }
        });

        // Se o erro for que o utilizador já existe, ignoramos e avançamos para atualizar o plano dele
        if (authError && authError.message !== 'Email link resend limit exceeded' && !authError.message.includes('already registered')) {
          throw authError;
        }

        // Puxar o ID do utilizador (novo ou existente)
        let userId = authData?.user?.id;
        
        if (!userId) {
          // Se ele já existia, buscamos o ID dele de forma segura
          const { data: existingUser } = await supabaseAdmin.from('profiles').select('id').eq('email', Customer.email).single();
          userId = existingUser?.id;
        }

        // Atualiza ou insere na tabela 'profiles' marcando o plano ativo
        if (userId) {
          const { error: upsertError } = await supabaseAdmin.from('profiles').upsert({
            id: userId,
            email: Customer.email,
            plan: 'premium',
            status: 'active',
            kiwify_order_id: order_id,
            updated_at: new Date().toISOString()
          });
          if (upsertError) throw upsertError;
        }
        
        console.log(`✅ Acesso Premium liberado com sucesso para: ${Customer.email}`);
        break;

      case 'refunded': // Reembolsado
      case 'chargedback': // Contestação no cartão
        console.log(`❌ Processando estorno/reembolso para: ${Customer.email}`);
        
        // Remove as permissões alterando o plano para free e revogando o status
        const { error: revokeError } = await supabaseAdmin
          .from('profiles')
          .update({ plan: 'free', status: 'revoked', updated_at: new Date().toISOString() })
          .eq('email', Customer.email);

        if (revokeError) throw revokeError;
        console.log(`🔒 Acesso revogado com sucesso para: ${Customer.email}`);
        break;

      default:
        console.log(`ℹ️ Evento da Kiwify recebido, mas ignorado: ${order_status}`);
    }

    return res.status(200).json({ message: 'Webhook processado com sucesso!' });

  } catch (error: any) {
    console.error('💥 Erro crítico no processamento do Webhook:', error.message);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
