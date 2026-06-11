import React from 'react';
import { 
  ArrowRight, 
  Star, 
  Trophy, 
  Scale, 
  Zap, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { WhatsAppScreenshot } from './WhatsAppScreenshot';

// Moved HowItWorks inside LandingRest so it is loaded lazily and doesn't pollute the core chunk
const HowItWorks = ({ onAction, isMobile = false }: { onAction: () => void; isMobile?: boolean }) => {
  const steps = [
    {
      step: "01",
      title: "Recursos Prontos",
      desc: "Esqueletos indestrutíveis para qualquer tema.",
      icon: <Scale className="text-primary" size={isMobile ? 18 : 24} />
    },
    {
      step: "02",
      title: "Treino Prático",
      desc: "Micro-redações rápidas de 8 minutos.",
      icon: <Zap className="text-secondary" size={isMobile ? 18 : 24} />
    },
    {
      step: "03",
      title: "IA Malu",
      desc: "Correção instantânea que ensina a pensar.",
      icon: <Sparkles className="text-accent" size={isMobile ? 18 : 24} />
    }
  ];

  if (isMobile) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <span className="text-primary text-[9px] font-black uppercase tracking-[0.3em]">A Engenharia do 1000</span>
          <h2 className="text-3xl font-display font-black italic uppercase">Como <span className="text-gradient">funciona?</span></h2>
        </div>
        
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div 
              key={i}
              className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                {step.icon}
              </div>
              <div>
                <h3 className="text-sm font-black italic uppercase">{step.title}</h3>
                <p className="text-[11px] text-gray-500 font-medium leading-tight">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 blur-[120px] rounded-full" />
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="text-center space-y-4">
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 inline-block">MÉTODO RED 1000 PRO</span>
          <h2 className="text-4xl md:text-7xl font-display font-black italic uppercase tracking-tighter">
            COMO FUNCIONA <span className="text-gradient">POR DENTRO?</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            O atalho que os corretores do ENEM não querem que você descubra. Uma mistura de engenharia reversa e inteligência artificial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div 
              key={i}
              className="glass p-10 rounded-[48px] border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent relative group hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-6xl font-display font-black opacity-10 mb-8 group-hover:text-primary transition-colors">{step.step}</div>
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-2xl font-display font-black mb-4 italic tracking-tight">{step.title === "Recursos Prontos" ? "A Engenharia Reversa" : step.title === "Treino Prático" ? "Treinamento Celular" : "Simbiose com Malu IA"}</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed italic">{step.title === "Recursos Prontos" ? "Dissecamos mais de 5.000 redações nota 1000 reais para isolar os padrões que SEMPRE recebem nota máxima." : step.title === "Treino Prático" ? "Exercícios de 'micro-redação' que treinam seu cérebro para gerar conectivos automaticamente." : "Nossa IA exclusiva foi treinada exclusivamente com a grade de correção oficial do MEC."}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface LandingRestProps {
  handleCTA: () => void;
  compPrice1: number;
  compPrice2: number;
  compPrice3: number;
  setShowAuth: (mode: 'login' | 'signup' | null) => void;
}

export default function LandingRest({ 
  handleCTA, 
  compPrice1, 
  compPrice2, 
  compPrice3, 
  setShowAuth 
}: LandingRestProps) {
  return (
    <>
      {/* MOBILE VER_COMO_FUNCIONA AUTO-PROMOTIONAL SCROLLER (REQUEST 1, 2) */}
      <section id="como-funciona-mobile" className="md:hidden pt-4 pb-8 px-5 bg-black/10 border-t border-white/5 scroll-mt-20">
        <HowItWorks onAction={handleCTA} isMobile />
        
        {/* USER SPECIFIC REQUEST 5: "Deixe o preço em baixo de como funciona" */}
        <div className="mt-8 space-y-4 pt-4 bg-[#141414] border border-white/5 p-5 rounded-3xl text-left shadow-lg">
          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col bg-transparent">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#00FF88] bg-[#00FF88]/15 px-2.5 py-1 rounded w-fit border border-[#00FF88]/20">Oferta Especial</span>
              <span className="text-[8.5px] font-black text-[#FF6B35] uppercase tracking-wider mt-1.5 leading-none">Últimas vagas com desconto</span>
            </div>
            <div className="text-right flex flex-col justify-end bg-transparent">
              <span className="text-xs line-through opacity-30 font-black block leading-none mb-1">R$ 197</span>
              <span className="text-3xl text-white font-black tracking-tight italic leading-none">R$ 29,90</span>
              <span className="text-[9px] text-[#00FF88] font-bold mt-1 text-right block max-w-[155px] leading-tight italic">
                Menos que o preço de uma pizza por mês pra garantir sua aprovação na Federal!
              </span>
            </div>
          </div>

          {/* COMPARAÇÃO COM CONCORRÊNCIA */}
          <div className="pt-3 border-t border-white/5 space-y-1.5">
            <span className="text-[8px] font-black text-white/40 tracking-wider block">⚠️ OUTROS CURSOS COBRAM ATÉ:</span>
            <div className="flex flex-wrap gap-1.5">
              <span className="line-through text-white/50 text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5">R$ {compPrice1.toFixed(2).replace('.', ',')}</span>
              <span className="line-through text-white/50 text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5">R$ {compPrice2.toFixed(2).replace('.', ',')}</span>
              <span className="line-through text-white/50 text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5">R$ {compPrice3.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={handleCTA}
              className="group w-full bg-[#FF6B35] text-white py-5 rounded-2xl text-base font-display font-black shadow-[0_15px_35px_rgba(255,107,53,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2 border-b-4 border-[#FF6B35]/20 cursor-pointer"
            >
              <span>QUERO MINHA REDAÇÃO NOTA 1000</span>
              <ArrowRight size={16} />
            </button>
            <div className="flex items-center justify-center gap-2 bg-[#00FF88]/5 border border-[#00FF88]/10 py-2.5 px-3 rounded-xl">
              <ShieldCheck size={14} className="text-[#00FF88] shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#00FF88] text-center">Garantia de 7 Dias Incondicional</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: VOCÊ RECEBE (O QUE COMPRA) */}
      <section className="py-16 md:py-24 px-5 bg-[#151515] border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[#FF6B35] text-xs font-black uppercase tracking-[0.2em]">CONTEÚDO DO MÉTODO</span>
            <h2 className="text-3xl md:text-5xl font-display font-black uppercase italic text-white">
              Exatamente o Que Você Ganha
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1 */}
            <div className="glass p-6 rounded-3xl border-white/10 hover:border-[#FF6B35]/30 hover:bg-white/[0.02] transition-colors flex gap-4 items-start bg-[#1a1a1a]">
              <div className="p-3 bg-white/5 rounded-2xl text-xl text-[#FF6B35] shrink-0">📖</div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase text-white">SISTEMA DE BLOCOS LÓGICOS</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-semibold">
                  O passo a passo do método. Estruturas "Coringas" indestrutíveis para você apenas preencher e redações nota 1000 reais dissecadas.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass p-6 rounded-3xl border-white/10 hover:border-[#FF6B35]/30 hover:bg-white/[0.02] transition-colors flex gap-4 items-start bg-[#1a1a1a]">
              <div className="p-3 bg-white/5 rounded-2xl text-xl text-[#FF6B35] shrink-0">🤖</div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase text-white">CORRETORA MALU IA 24/7</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-semibold">
                  Envie quantas redações quiser e ganhe correções detalhadas em 30 segundos, indicando exatamente onde ajustar nas 5 competências do ENEM.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="glass p-6 rounded-3xl border-white/10 hover:border-[#FF6B35]/30 hover:bg-white/[0.02] transition-colors flex gap-4 items-start bg-[#1a1a1a]">
              <div className="p-3 bg-white/5 rounded-2xl text-xl text-[#FF6B35] shrink-0">📚</div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase text-white">ARSENAL DE REPERTÓRIOS</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-semibold">
                  Filósofos, dados estatísticos e alusões históricas organizados para você memorizar rápido e encaixar em qualquer tema concebível.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: OBJEÇÕES + FAQ */}
      <section className="py-16 md:py-24 px-5 bg-[#151515] border-y border-white/5">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[#FF6B35] text-xs font-black uppercase tracking-[0.2em]">PRINCIPAIS OBJEÇÕES</span>
            <h2 className="text-3xl md:text-5xl font-display font-black uppercase italic text-white">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="grid gap-4">
            {[
              { q: "Eu não tenho base nenhuma de redação, vou conseguir?", a: "Com certeza. O método foi feito sob medida para quem hoje tira 400 ou trava diante da folha em branco, guiando você passo a passo ao 900+ em tempo recorde." },
              { q: "Ainda dá tempo de estudar até o ENEM?", a: "Sim! Nosso cronograma prático tem foco total em render o máximo no menor tempo possível (cronograma de 30 dias / 4 semanas). Se você começar agora, chegará pronto e confiante." },
              { q: "Como o Sistema de Blocos Lógicos evita que eu zere ou trave?", a: "Diferente de cursos tradicionais que te cobram horas de gramática chata, nós damos esqueletos prontos 'Coringas'. Você só preenche as ideias em uma estrutura que os corretores oficiais amam." },
              { q: "Funciona se eu estiver estudando junto com cursinho presencial?", a: "Sim, serve como um impulsionador de nota ultra-eficiente para polir seus erros semanais sem estresse." },
              { q: "O acesso à Inteligência Artificial Corretora dura quanto tempo?", a: "Acesso permanente e vitalício. Você pode enviar redações ilimitadas e treinar exaustivamente até o dia da prova." },
              { q: "E se eu não gostar ou achar difícil?", a: "Garantia Incondicional de 7 dias! Se achar que o método não é para você, basta pedir o reembolso e devolvemos 100% de cada centavo sem burocracia." }
            ].map((obj, i) => (
              <div key={i} className="glass p-5 rounded-2xl border-white/5 bg-[#1a1a1a] flex flex-col gap-2 shadow-sm">
                <div className="flex items-start gap-2.5 text-white font-bold text-sm sm:text-base">
                  <span className="text-[#FF6B35] shrink-0">❓</span>
                  <span>{obj.q}</span>
                </div>
                <div className="flex items-start gap-2.5 text-gray-400 text-xs sm:text-sm font-semibold pl-6">
                  <span className="text-[#00FF88] shrink-0">✅</span>
                  <span>{obj.a}</span>
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp Support CTA inside FAQ */}
          <div className="mt-12 p-6 rounded-[32px] border border-[#25D366]/20 bg-[#25D366]/5 text-center space-y-4 max-w-2xl mx-auto shadow-[0_10px_40px_rgba(37,211,102,0.05)] border-dashed">
            <p className="text-sm sm:text-base text-gray-300 font-semibold leading-relaxed">
              Ainda tem alguma dúvida específica sobre o RED 1000 PRO? Fale direto conosco pelo WhatsApp!
            </p>
            <a
              href="https://wa.me/5528999106887?text=Olá!%20Fiquei%20com%20dúvidas%20sobre%20o%20RED%201000%20PRO%20e%20gostaria%20de%20conversar."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-8 py-4 rounded-2xl font-display font-black tracking-wider uppercase text-xs sm:text-sm shadow-[0_10px_20px_rgba(37,211,102,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.016 14.1 1.01 11.99 1.01c-5.447 0-9.866 4.372-9.87 9.802 0 1.96.512 3.878 1.483 5.584l-.976 3.562 3.69-.958zM17.52 14.3c-.302-.15-1.786-.88-2.037-.972-.251-.09-.435-.136-.62.136-.184.272-.713.88-.872 1.058-.159.18-.32.203-.62.054-.303-.151-1.277-.47-2.433-1.499-.9-.8-1.507-1.79-1.284-1.21.32-.544.116-.859-.033-1.01-.137-.137-.302-.35-.454-.524-.151-.174-.202-.299-.303-.497-.101-.198-.051-.371-.025-.521.025-.15.184-.435.251-.592.067-.158.136-.32.2-.454.067-.136.101-.227.151-.379.05-.152.025-.286-.013-.362-.038-.075-.32-.782-.442-1.079-.117-.282-.236-.24-.32-.245-.084-.004-.18-.005-.276-.005-.097 0-.253.036-.385.18-.132.143-.503.491-.503 1.198 0 .707.514 1.39.585 1.487.073.099 1.01 1.542 2.45 2.162.342.148.608.236.814.301.344.11.657.094.904.057.276-.041.88-.36 1.004-.707.126-.347.126-.645.088-.707-.038-.063-.15-.1-.453-.25z"/>
              </svg>
              Falar com Suporte no WhatsApp
            </a>
          </div>
        </div>
      </section>





      {/* Footer */}
      <footer className="mt-20 py-16 px-12 border-t border-white/5 opacity-50 bg-[#121212]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-[#FF6B35]" />
            <span className="font-display font-black text-lg tracking-tighter uppercase">RED 1000 PRO</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-[#FF6B35]">
            <span>© 2026 • MatheuS 1000 PRO</span>
            <button onClick={() => setShowAuth('login')} className="hover:text-white transition-colors">Área do Aluno</button>
            <a href="mailto:contato@redacao1000pro.com" className="hover:underline text-gray-400">contato@redacao1000pro.com</a>
          </div>
        </div>
      </footer>
    </>
  );
}
