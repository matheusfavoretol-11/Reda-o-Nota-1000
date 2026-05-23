import * as React from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  Menu, 
  X, 
  Zap, 
  AlertTriangle, 
  Lightbulb, 
  MessageSquare, 
  ArrowRight, 
  Star, 
  Quote, 
  Lock, 
  ShieldCheck, 
  FileText, 
  BookOpen, 
  Check, 
  Clock, 
  Smartphone,
  Sparkles,
  Target,
  Trophy,
  History,
  Scale,
  Globe,
  User,
  Plus,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, Suspense, lazy } from 'react';
import { Toaster, toast } from 'sonner';
import { supabase, updateSupabaseConfig, getSupabase } from './lib/supabase';
import { TESTIMONIALS, VALUE_PROPS, EBOOK_PAGES, REPERTORIOS_DATA, TOP_THEMES_REPERTOIRE, CHALLENGES_DATA, REDACOES_MODELO } from './data/constants';
import { SectionHeader, AnimatedCounter, Countdown } from './components/ui/Shared';
import Nav from './components/ui/Nav';
import AuthScreen from './components/auth/AuthScreen';
import BenefitsOffer from './components/offer/BenefitsOffer';
import SuccessRedirect from './components/offer/SuccessRedirect';

// Lazy load heavy views
const EbookView = lazy(() => import('./components/views/EbookView'));
const IaView = lazy(() => import('./components/views/IaView'));
const RepertoireView = lazy(() => import('./components/views/RepertoireView'));
const ChallengesView = lazy(() => import('./components/views/ChallengesView'));
const RedacoesView = lazy(() => import('./components/views/RedacoesView'));
const DashboardOverview = lazy(() => import('./components/views/DashboardOverview'));

// Loading Component
const LoadingView = () => (
  <div className="w-full min-h-[400px] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <RefreshCw className="animate-spin text-primary" size={32} />
      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Carregando Módulo...</span>
    </div>
  </div>
);


// --- COMPONENTS ---

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
      <section className="py-12 px-6 bg-white/[0.01]">
        <div className="space-y-8">
          <div className="space-y-2">
            <span className="text-primary text-[9px] font-black uppercase tracking-[0.3em]">A Engenharia do 1000</span>
            <h2 className="text-3xl font-display font-black italic uppercase">Como <span className="text-gradient">funciona?</span></h2>
          </div>
          
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-sm font-black italic uppercase">{step.title}</h3>
                  <p className="text-[11px] text-gray-500 font-medium leading-tight">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <button 
            onClick={onAction}
            className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20 rounded-xl"
          >
            VER MÉTODO COMPLETO ↓
          </button>
        </div>
      </section>
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
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 rounded-[48px] border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent relative group"
            >
              <div className="text-6xl font-display font-black opacity-10 mb-8 group-hover:text-primary transition-colors">{step.step}</div>
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-2xl font-display font-black mb-4 italic tracking-tight">{step.title === "Recursos Prontos" ? "A Engenharia Reversa" : step.title === "Treino Prático" ? "Treinamento Celular" : "Simbose com Malu IA"}</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed italic">{step.title === "Recursos Prontos" ? "Dissecamos mais de 5.000 redações nota 1000 reais para isolar os padrões que SEMPRE recebem nota máxima." : step.title === "Treino Prático" ? "Exercícios de 'micro-redação' que treinam seu cérebro para gerar conectivos automaticamente." : "Nossa IA exclusiva foi treinada exclusivamente com a grade de correção oficial do MEC."}</p>
            </motion.div>
          ))}
        </div>
        
        {/* MOBILE CTA WITHIN SECTION */}
        <div className="pt-8 md:hidden">
          <button 
            onClick={onAction}
            className="w-full bg-primary py-6 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3"
          >
            QUERO ESTE MÉTODO <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};
// --- CONFIG ---
const KIWIFY_CHECKOUT_URL = "https://pay.kiwify.com.br/AhSL8x0";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{ status: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'ebook' | 'ia' | 'repertorios' | 'redacoes' | 'exercicios'>('overview');
  const [showAuth, setShowAuth] = useState<'login' | 'signup' | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Fetch Supabase Config from Server (Fix for AI Studio build-time environment variables)
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config/supabase');
        const data = await response.json();
        if (data.url && data.key) {
          console.log("Configuração do Supabase carregada do servidor.");
          updateSupabaseConfig(data.url, data.key);
        }
      } catch (e) {
        console.error("Erro ao buscar configuração dinâmica:", e);
      }
    };
    fetchConfig();
  }, []);

  const isPaid = profile?.status === 'paid' || user?.email === 'matheusfavoretol@gmail.com';

  // Auth Listener
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        setCheckingPayment(true);
        await checkPaymentStatus(currentUser.email);
        setCheckingPayment(false);
      }
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        setCheckingPayment(true);
        await checkPaymentStatus(currentUser.email);
        setCheckingPayment(false);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-verify every 3 seconds if on pending screen (faster for immediate access)
  useEffect(() => {
    let interval: number;
    if (user && !isPaid) {
      // First check immediately
      checkPaymentStatus(user.email);
      
      interval = window.setInterval(() => {
        checkPaymentStatus(user.email);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [user, isPaid]);

  const checkPaymentStatus = async (userEmail: string | undefined) => {
    if (!userEmail) return;
    try {
      const res = await fetch(`/api/check-payment?email=${encodeURIComponent(userEmail)}`);
      if (!res.ok) throw new Error("Falha ao verificar pagamento no servidor");
      const data = await res.json();
      setProfile({ status: data.isPaid ? 'paid' : 'pending' });
      if (data.isPaid) {
        toast.success("Pagamento identificado! Seu acesso foi liberado.");
      }
    } catch (e) {
      console.error("Error checking payment:", e);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Sessão encerrada!");
  };

  if (loading || checkingPayment) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="text-[10px] font-black uppercase tracking-widest opacity-40 animate-pulse">Sincronizando Acesso...</div>
        </div>
      </div>
    );
  }


  if (user && isPaid) {
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col selection:bg-primary/30">
        {/* DASHBOARD NAVBAR */}
        <nav className="p-6 border-b border-white/5 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
             <button onClick={() => setActiveTab('overview')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Trophy className="text-primary w-6 h-6 shadow-[0_0_20px_rgba(255,0,102,0.5)]" />
                <span className="font-display font-black text-xl tracking-tighter uppercase">Área do <span className="text-primary italic">Aluno</span></span>
             </button>
             <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                   <div className="text-[10px] font-black uppercase opacity-40">Estudante Logado</div>
                   <div className="text-xs font-bold text-gradient">{user.email}</div>
                </div>
                <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                   <X size={18} className="opacity-40" />
                </button>
             </div>
          </div>
        </nav>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<LoadingView />}>
              {activeTab === 'overview' && (
                <DashboardOverview user={user} onNavigate={(view) => setActiveTab(view)} />
              )}
              {activeTab === 'ebook' && (
                <EbookView />
              )}
              {activeTab === 'ia' && (
                <IaView />
              )}
              {activeTab === 'repertorios' && (
                <RepertoireView />
              )}
              {activeTab === 'redacoes' && (
                <RedacoesView />
              )}
              {activeTab === 'exercicios' && (
                <ChallengesView />
              )}
            </Suspense>
          </div>
        </main>
      </div>
    );
  }

  const handleCTA = () => {
    const url = new URL(KIWIFY_CHECKOUT_URL);
    if (user?.email) {
      url.searchParams.append('email', user.email);
    }
    window.location.href = url.toString();
  };

  const manualVerify = async () => {
    setIsVerifying(true);
    await checkPaymentStatus(user?.email);
    setIsVerifying(false);
    if (!profile?.status || profile.status === 'pending') {
      toast.info("Ainda não identificamos seu pagamento. Pode levar alguns minutos.");
    } else {
      toast.success("Pagamento identificado! Divirta-se.");
    }
  };

  return (
    <div className="relative overflow-hidden">
      <Toaster position="bottom-right" theme="dark" />
      <Nav onAction={handleCTA} onLogin={() => setShowAuth('login')} />
      
      <AnimatePresence>
        {showAuth && (
          <AuthScreen 
            mode={showAuth} 
            onClose={() => setShowAuth(null)} 
            setMode={(m) => setShowAuth(m)}
            checkoutUrl={KIWIFY_CHECKOUT_URL}
          />
        )}
        {user && !isPaid && (
          <BenefitsOffer 
            user={user} 
            onLogout={handleLogout} 
            manualVerify={manualVerify} 
            isVerifying={isVerifying} 
            checkoutUrl={KIWIFY_CHECKOUT_URL}
          />
        )}
      </AnimatePresence>
      
      {/* GLOWS */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 blur-[180px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* MOBILE OPTIMIZED HERO */}
      <section className="md:hidden pt-24 pb-8 px-5 flex flex-col gap-6 min-h-[95vh] justify-center bg-[#050508] relative overflow-hidden">
        <div className="absolute top-0 right-10 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 text-center"
        >
          {/* PAIN POINT IDENTIFICATION (PROBLEMA) */}
          <div className="space-y-1">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">SUA NOTA TRAVOU NOS 600?</span>
            <p className="text-white/60 text-[11px] font-bold italic">"Eu estudo e a nota não sobe. Vou ser reprovado de novo?" — <span className="text-white">Pare de sofrer.</span></p>
          </div>
          
          {/* 7-WORD HEADLINE: [RESULTADO] + [TEMPO] + [GARANTIA] */}
          <h1 className="text-[32px] xs:text-[38px] font-display font-black leading-[0.95] tracking-tighter italic uppercase text-white">
            Finalmente: <br/> o fim do <span className="text-primary">pânico</span> na hora <br/> de escrever <br/> redação ENEM
          </h1>
          
          {/* PARA QUEM É (TARGET) */}
          <p className="text-gray-400 text-sm font-bold leading-tight px-4 border-l-2 border-primary/30 mx-4 italic py-1">
            👉 Você que <span className="text-white">quer Federal</span> mas a redação ainda é seu maior pesadelo.
          </p>

          {/* HIGH-IMPACT INLINE SOCIAL PROOF BADGE */}
          <div className="flex flex-col items-center gap-1.5 py-3 px-4 bg-white/[0.02] border border-white/5 rounded-2xl mx-auto w-fit">
             <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                   <img className="w-5.5 h-5.5 rounded-full border border-[#050508]" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ana" referrerPolicy="no-referrer" />
                   <img className="w-5.5 h-5.5 rounded-full border border-[#050508]" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Joao" referrerPolicy="no-referrer" />
                   <img className="w-5.5 h-5.5 rounded-full border border-[#050508]" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" referrerPolicy="no-referrer" />
                </div>
                <div className="flex items-center gap-0.5">
                   {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-accent text-accent" />)}
                </div>
                <span className="text-[11px] font-black text-white">4.9/5</span>
             </div>
             <p className="text-[9px] text-[#050508] bg-accent px-2 py-0.5 rounded font-black uppercase tracking-wider">
                Média de +2.847 notas 900+ no ENEM
             </p>
          </div>

          {/* URGENCY & PROMO BADGE (PRICE IS LOWERED INTO THE ACTION BLOCK) */}
          <div className="inline-flex flex-col items-center gap-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-success/10 border border-success/20 rounded-full">
              <Zap size={10} className="text-success fill-success animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-success">70% OFF + EBOOK R$197 GRÁTIS</span>
            </div>
          </div>

          {/* LOWERED PRICING & CALL TO ACTION BLOCK */}
          <div className="space-y-4 pt-1 bg-white/[0.01] border border-white/5 p-4 rounded-3xl text-left">
             <div className="flex items-center justify-between px-2">
                <div className="flex flex-col">
                   <span className="text-[9px] font-black uppercase tracking-widest text-[#050508] bg-success px-2 py-0.5 rounded w-fit">Preço Promocional</span>
                   <span className="text-[8.5px] font-black text-orange-500 uppercase tracking-wider mt-1.5 leading-none">Últimas 12 vagas disponíveis</span>
                </div>
                <div className="text-right flex flex-col justify-end">
                   <span className="text-xs line-through opacity-30 font-black block leading-none mb-1">R$ 97,00</span>
                   <span className="text-3xl text-white font-black tracking-tight italic leading-none">R$ 29,90</span>
                </div>
             </div>

             <div className="py-2.5 bg-[#050508]/80 rounded-xl border border-white/5 text-center">
                <Countdown compact />
             </div>

             <button 
               onClick={handleCTA}
               className="group w-full bg-orange-600 text-white py-5 rounded-2xl text-lg font-display font-black shadow-[0_15px_35px_rgba(234,88,12,0.4)] active:scale-95 transition-all flex flex-col items-center justify-center gap-0 border-b-4 border-black/30"
             >
               <span className="flex items-center gap-2">GARANTIR ACESSO AGORA <ArrowRight size={18} /></span>
               <span className="text-[9px] opacity-70 font-bold uppercase tracking-widest">Acesso vitalício à Malu IA</span>
             </button>
          </div>

          <button 
            onClick={() => setShowAuth('login')}
            className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity bg-white/5 rounded-xl border border-white/5"
          >
            Já tem acesso? <span className="text-secondary underline decoration-secondary/30 ml-1">Fazer Login</span>
          </button>
          
          <div className="flex items-center justify-center gap-6 opacity-30">
            <div className="flex items-center gap-1"><ShieldCheck size={10} /> <span className="text-[8px] font-black uppercase">Garantia 7 Dias</span></div>
            <div className="flex items-center gap-1"><Lock size={10} /> <span className="text-[8px] font-black uppercase">Checkout Seguro</span></div>
          </div>
        </motion.div>
      </section>

      {/* MOBILE-ONLY CONCISE HOW IT WORKS */}
      <div className="md:hidden">
        <HowItWorks onAction={handleCTA} isMobile />
      </div>

      {/* QUICK PROOF STRIP (SOCIAL PROOF) */}
      <section className="md:hidden py-12 px-6 bg-white/[0.02] border-y border-white/5 space-y-6">
         <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-1">
               {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-accent text-accent" />)}
               <span className="text-white text-sm font-black ml-1">4.9/5</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 italic">Aprovado por <span className="text-primary italic">2.847 futuros graduandos</span></p>
         </div>

         <div className="flex gap-4 animate-scroll overflow-hidden pb-2">
            {[
               { n: "Maria C.", t: "Saí de 650 para 920 em 3 semanas!" },
               { n: "João V.", t: "As estruturas prontas me salvaram." },
               { n: "Ana L.", t: "A Malu é bizarramente precisa." },
               { n: "Guilherme M.", t: "Tirei 960! Faltava só o esqueleto certo." },
               { n: "Beatriz S.", t: "Corrigir redação por R$29 salva vidas. Sensacional" },
               { n: "Lucas H.", t: "Passei na Federal usando as citações e a Malu." },
               { n: "Bruna K.", t: "Economizei muito tempo. Redação virou moleza." }
            ].map((p, i) => (
               <div key={i} className="glass px-6 py-4 rounded-2xl border-white/5 min-w-[260px] shrink-0 bg-white/[0.01]">
                  <p className="text-[12px] font-medium italic text-gray-300 leading-tight">"{p.t}"</p>
                  <p className="text-[9px] font-black uppercase mt-2 opacity-30 text-primary">— {p.n}</p>
               </div>
            ))}
         </div>

         <button 
           onClick={handleCTA}
           className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all"
         >
           Ver mais depoimentos
         </button>
      </section>

      {/* MOBILE BENEFITS CHECKLIST */}
      <section className="md:hidden py-16 px-6 space-y-10">
         {/* NUMBERS STRIP */}
         <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="glass p-5 rounded-2xl border-white/5 text-center bg-white/[0.01]">
               <div className="text-3xl font-display font-black text-primary">2.8k+</div>
               <div className="text-[8px] font-black uppercase opacity-40">Alunos Ativos</div>
            </div>
            <div className="glass p-5 rounded-2xl border-white/5 text-center bg-white/[0.01]">
               <div className="text-3xl font-display font-black text-secondary">92%</div>
               <div className="text-[8px] font-black uppercase opacity-40">Melhora em 15 dias</div>
            </div>
         </div>
         
         <div className="text-center bg-white/[0.01] border border-white/5 p-4 rounded-2xl mb-12">
            <p className="text-[9px] uppercase font-black tracking-widest text-[#050508] bg-accent px-3 py-1 rounded inline-block mb-2">⭐ PROVA REAL DE EFICÁCIA</p>
            <p className="text-xs text-gray-400 font-bold leading-normal italic">
               9 em cada 10 alunos matriculados tiraram mais de 920 pontos na redação de 2024.
            </p>
         </div>

         <div className="space-y-2 text-center">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">O que você recebe</span>
            <h2 className="text-3xl font-display font-black leading-none italic uppercase">Tudo o que você precisa <br/> <span className="text-primary tracking-tighter">em um só lugar</span></h2>
         </div>

         <div className="space-y-6">
            {[
               { t: "Malu IA: Correção Instantânea", d: "Pare de esperar dias. Saiba seus erros agora." },
               { t: "Guia 1000: O Mapa da Federal", d: "A estrutura 'esqueleto' que o ENEM adora." },
               { t: "Citações Curingas", d: "Repertório pronto que serve para todo tema." },
               { t: "Checklist de Aprovação", d: "Saiba exatamente o que fazer todo dia." }
            ].map((b, i) => (
               <div key={i} className="flex gap-5 items-start p-5 glass border-white/5 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                     <CheckCircle2 size={20} className="text-primary" />
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-white italic uppercase mb-1">{b.t}</h4>
                     <p className="text-xs text-gray-500 font-medium leading-normal">{b.d}</p>
                  </div>
               </div>
            ))}
         </div>

         <button 
           onClick={handleCTA}
           className="w-full bg-orange-600 text-white py-6 rounded-2xl text-xl font-display font-black shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 uppercase italic"
         >
           QUERO COMEÇAR HOJE <ArrowRight size={20} />
         </button>
      </section>


      {/* DESKTOP HERO SECTION */}
      <section className="hidden md:block pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 glass px-5 py-2 rounded-full mb-12 border-white/5 shadow-2xl">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-[0.2em] italic">🔥 Já somos +500 alunos rumo ao 1000</span>
            </div>
            
            <h1 className="text-6xl md:text-[86px] font-display font-black leading-[0.85] mb-12 tracking-tighter italic uppercase">
              O segredo que <br/>
              <span className="text-gradient">universidades federais</span> <br/> escondem
            </h1>
            
            <h2 className="text-2xl text-gray-400 mb-16 leading-relaxed font-medium max-w-xl">
              Como alunos PASSARAM de 600 para 900+ em redação ENEM. Mesmo quem sempre foi "péssimo" em português.
              <br/><br/>
              <span className="text-white">Descubra o método que já ajudou 12.847 alunos a escrever redações nota 950+ em apenas 7 dias.</span>
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <button 
                onClick={handleCTA}
                className="w-full sm:w-auto bg-primary text-white p-8 px-14 rounded-[40px] text-2xl font-display font-black flex items-center justify-center gap-4 hover:scale-110 hover:shadow-[0_30px_60px_rgba(255,0,102,0.4)] transition-all active:scale-95 group"
              >
                QUERO MINHA REDAÇÃO NOTA 10 <ArrowRight className="group-hover:translate-x-2 transition-transform" size={28} />
              </button>

              <button 
                onClick={() => setShowAuth('login')}
                className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors bg-white/5 px-6 py-2 rounded-full border border-white/5"
              >
                Já tem acesso? <span className="text-secondary underline decoration-secondary/30 ml-2">Fazer Login</span>
              </button>
              
              <div className="flex flex-col gap-2 items-center sm:items-start group hidden lg:flex">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-accent text-accent" />)}
                </div>
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">OFERTA VÁLIDA POR TEMPO LIMITADO</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-secondary/10 blur-[120px] rounded-full z-0" />
            <div className="glass rounded-[64px] border-white/5 p-2 animate-float relative z-10 shadow-2xl">
               <div className="bg-[#0A0A0F] rounded-[62px] aspect-[4/5] overflow-hidden flex flex-col border border-white/10">
                  <div className="p-8 border-b border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-3xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                          <Sparkles size={24} className="text-white" />
                        </div>
                        <div>
                           <div className="text-xs font-black uppercase">Malu AI</div>
                           <div className="text-[10px] font-mono opacity-30">CORRETORA v3.0</div>
                        </div>
                     </div>
                     <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                  </div>
                  
                  <div className="flex-1 p-8 space-y-8 overflow-y-auto">
                     <div className="flex justify-end">
                        <div className="bg-white/5 p-4 rounded-3xl rounded-tr-none border border-white/5 max-w-[80%]">
                           <p className="text-xs italic text-gray-400">"Malu, meu desenvolvimento tá meio fraco. O que eu faço?"</p>
                        </div>
                     </div>
                     <motion.div 
                       initial={{ x: -20, opacity: 0 }}
                       whileInView={{ x: 0, opacity: 1 }}
                       className="bg-primary/10 p-6 rounded-3xl rounded-tl-none border border-primary/20 max-w-[90%] relative"
                     >
                        <p className="text-sm font-medium leading-relaxed mb-6">
                          "Amigão, seu argumento tá mais raso que prato de sobremesa! 😂 Cadê o repertório? Tente usar o Bauman para conectar com a fluidez do tema. BORA!"
                        </p>
                        <div className="flex gap-2">
                           <div className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase rounded-full">Nota: 640 🔥</div>
                           <div className="px-3 py-1 bg-white/10 text-white text-[9px] font-black uppercase rounded-full">Melhorar C3 🚀</div>
                        </div>
                     </motion.div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS - Hidden on Mobile to focus on urgency */}
      <section className="hidden md:block py-32 border-y border-white/5 bg-white/[0.01] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
           <div className="absolute top-0 right-0 w-[500px] h-full bg-primary/20 blur-[120px]" />
           <div className="absolute bottom-0 left-0 w-[500px] h-full bg-secondary/20 blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-24 relative z-10">
          {[
            { v: "500+", l: "Alunos Aprovados", sub: "Estudando com o método" },
            { v: "12.847", l: "Análises de IA", sub: "Correções precisas MALU" },
            { v: "4.9/5", l: "Satisfação Geral", sub: "Nota média dos usuários" }
          ].map((s, i) => (
            <div key={i} className="group">
              <div className="text-7xl font-display font-black text-gradient block mb-4 group-hover:scale-110 transition-transform">
                <AnimatedCounter value={s.v} />
              </div>
              <div className="text-[12px] font-black uppercase tracking-[0.3em] text-white mb-2">{s.l}</div>
              <div className="text-[10px] font-medium uppercase tracking-widest opacity-30">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="hidden md:block">
        <HowItWorks onAction={handleCTA} />
      </div>

      {/* PLATFORM PREVIEW - "PROOF" SECTION - Hidden on Mobile */}
      <section className="hidden md:block py-40 px-6 relative overflow-hidden bg-bg-dark">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
         
         <SectionHeader 
           badge="PROVA DE COMO É" 
           title="O Coração do Red 1000 Pro" 
           subtitle="Esqueça plataformas confusas. Aqui você tem um ecossistema completo focado em uma única coisa: Sua Aprovação."
         />
         
         <div className="max-w-7xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-[52px] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="glass rounded-[50px] border-white/5 p-4 animate-float relative z-10">
               <div className="bg-[#050508] rounded-[42px] overflow-hidden border border-white/10 shadow-3xl">
                  {/* Mock UI Header */}
                  <div className="h-14 border-b border-white/5 flex items-center justify-between px-8 bg-white/[0.03]">
                     <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/40" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                        <div className="w-3 h-3 rounded-full bg-green-500/40" />
                     </div>
                     <div className="flex items-center gap-6">
                        <div className="hidden sm:flex gap-4">
                           <div className="w-20 h-2 bg-white/10 rounded-full" />
                           <div className="w-20 h-2 bg-white/10 rounded-full" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/20" />
                     </div>
                  </div>
                  
                  {/* Mock App Content */}
                  <div className="flex flex-col md:flex-row h-[600px]">
                     {/* Sidebar */}
                     <div className="w-72 border-r border-white/5 p-8 space-y-8 hidden md:block bg-white/[0.01]">
                        <div className="space-y-3">
                           <div className="h-2 w-1/3 bg-primary/30 rounded-full" />
                           <div className="h-8 w-full bg-white/5 rounded-xl" />
                        </div>
                        <div className="space-y-6 pt-8">
                           {[1,2,3,4,5].map(i => (
                              <div key={i} className="flex gap-4 items-center opacity-40">
                                 <div className="w-8 h-8 rounded-lg bg-white/5" />
                                 <div className="h-2 flex-1 bg-white/5 rounded-full" />
                              </div>
                           ))}
                        </div>
                     </div>
                     
                     {/* Main Area */}
                     <div className="flex-1 p-8 md:p-12 overflow-hidden flex flex-col">
                        <div className="flex justify-between items-start mb-12">
                           <div className="space-y-3">
                              <div className="h-10 w-64 bg-white/10 rounded-2xl" />
                              <div className="h-4 w-48 bg-white/5 rounded-lg" />
                           </div>
                           <div className="px-6 py-3 bg-success/20 text-success rounded-full text-[10px] font-black uppercase tracking-widest border border-success/20">
                              Módulo Concluído
                           </div>
                        </div>
                        
                        <div className="grid md:grid-cols-12 gap-10 flex-1">
                           <div className="md:col-span-12 lg:col-span-7 space-y-6">
                              <div className="p-8 bg-white/5 rounded-[32px] border border-white/5 space-y-4 h-full">
                                 <div className="h-2 w-1/4 bg-primary/40 rounded-full" />
                                 <div className="space-y-3 pt-4">
                                    <div className="h-3 w-full bg-white/5 rounded-full" />
                                    <div className="h-3 w-full bg-white/5 rounded-full" />
                                    <div className="h-3 w-3/4 bg-white/5 rounded-full" />
                                    <div className="h-3 w-full bg-white/5 rounded-full opacity-50" />
                                    <div className="h-3 w-5/6 bg-white/5 rounded-full opacity-20" />
                                 </div>
                              </div>
                           </div>
                           <div className="hidden lg:flex lg:col-span-5 flex-col gap-6">
                              <div className="p-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[32px] border border-white/10 flex flex-col items-center justify-center text-center space-y-4 flex-1">
                                 <div className="text-6xl font-display font-black text-white italic">980</div>
                                 <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Sua Nota Estimada</div>
                              </div>
                              <div className="p-6 bg-[#0A0A0F] rounded-[32px] border border-white/10 space-y-4">
                                 <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-success" />
                                    <div className="w-2 h-2 rounded-full bg-success opacity-50" />
                                    <div className="w-2 h-2 rounded-full bg-success opacity-20" />
                                 </div>
                                 <p className="text-[11px] text-gray-400 font-medium italic leading-relaxed">
                                    "Malu detectou que sua C3 está perfeita, mas podemos melhorar um pouco a coesão no 2º parágrafo para chegar no 1000 absoluto."
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Decorative Floaters */}
               <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-12 -left-12 glass p-6 rounded-3xl border-primary/20 shadow-2xl z-20 hidden xl:block"
               >
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center"><Zap size={24} className="text-primary" /></div>
                     <div>
                        <div className="text-xs font-black text-white">IA Corretora</div>
                        <div className="text-[9px] font-black uppercase opacity-40">Malu Ativa</div>
                     </div>
                  </div>
               </motion.div>
               
               <motion.div 
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-10 -right-10 glass p-6 rounded-3xl border-secondary/20 shadow-2xl z-20 hidden xl:block"
               >
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center"><BookOpen size={24} className="text-secondary" /></div>
                     <div>
                        <div className="text-xs font-black text-white">Guia 1000</div>
                        <div className="text-[9px] font-black uppercase opacity-40">30 Págs de Ouro</div>
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* THE BENTO SECTION - Desktop Only now (Mobile has checklist) */}
      <section id="features" className="hidden md:block py-20 md:py-32 px-6">
         <div className="md:hidden space-y-4 mb-10 text-center">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase rounded-lg border border-primary/20">O QUE VOCÊ LEVA</span>
            <h2 className="text-4xl font-display font-black leading-none tracking-tight italic">SEU ARSENAL <span className="text-primary italic">PARA O 1000</span></h2>
         </div>
         
         <div className="hidden md:block">
           <SectionHeader 
             badge="⚡ O ARSENAL DO 1000" 
             title="Tudo o que você desbloqueia hoje" 
             subtitle="Chega de perder tempo com teoria chata. O curso é focado em prática e resultado imediato."
           />
         </div>
         
         <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-5 md:gap-8">
            {/* Benefício 1: IA - MAIS IMPORTANTE */}
            <div className="md:col-span-8 bento-card flex flex-col justify-end bg-gradient-to-br from-primary/10 to-transparent min-h-[320px] md:min-h-[450px] relative overflow-hidden group border-primary/20">
               <div className="absolute top-8 right-8 text-[100px] md:text-[180px] opacity-10 group-hover:scale-110 transition-transform duration-700">🤖</div>
               <div className="relative z-10">
                  <span className="px-3 py-1 bg-primary/20 text-primary text-[8px] md:text-[10px] font-black uppercase rounded-lg border border-primary/20 mb-4 md:mb-6 inline-block">CORRETORA INSTANTÂNEA</span>
                  <h3 className="text-3xl md:text-4xl font-display font-black mb-2 md:mb-4 italic">CORREÇÃO EM 2 MINUTOS</h3>
                  <p className="text-gray-400 font-medium text-base md:text-xl leading-snug max-w-xl">
                    Malu IA identifica todos os seus erros na C1 e C3 na hora. Sem esperar dias por um professor.
                  </p>
               </div>
            </div>
            
            {/* Benefício 2: Guia PDF */}
            <div className="md:col-span-4 bento-card flex flex-col justify-between group py-6 px-8 bg-white/[0.02]">
               <div className="text-4xl md:text-6xl group-hover:scale-125 transition-transform mb-4">📘</div>
               <div>
                  <h3 className="text-xl md:text-2xl font-display font-black mb-2 italic">GUIA DE ESTRUTURAS</h3>
                  <p className="text-xs md:text-sm text-gray-500 font-bold leading-relaxed italic">As fórmulas prontas para você apenas "encaixar" seu tema.</p>
               </div>
            </div>

            {/* Benefício 3: Estruturas (Simplified for mobile) */}
            <div className="md:col-span-12 bento-card flex flex-col md:flex-row items-center gap-6 md:gap-10 py-8 px-8 bg-secondary/5 border-secondary/10 group">
               <div className="text-5xl md:text-6xl group-hover:rotate-12 transition-transform">🎯</div>
               <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-4xl font-display font-black mb-1 md:mb-2 italic uppercase">Modelos Copy-Paste</h3>
                  <p className="text-sm md:text-lg text-gray-400 font-medium leading-relaxed">5 estruturas validadas que servem para qualquer tema do ENEM.</p>
               </div>
            </div>
         </div>
      </section>

      {/* VALUE PROPOSITION GRID - Hidden on Mobile */}
      <section className="hidden md:block py-32 px-6 bg-white/[0.01]">
         <div className="max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {VALUE_PROPS.map((prop, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-8 rounded-[32px] border-white/5 hover:border-primary/30 transition-all group"
                  >
                     <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{prop.icon}</div>
                     <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-3">{prop.title}</h4>
                     <p className="text-sm font-bold text-white mb-2">{prop.desc}</p>
                     <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{prop.sub}</p>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* TESTIMONIALS SECTION - Compact on Mobile */}
      <section className="py-20 md:py-32 px-6">
         <div className="md:hidden mb-12">
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-[9px] font-black uppercase rounded-lg border border-accent/20 mb-4">RESULTADOS REAIS</span>
            <h2 className="text-4xl font-display font-black leading-none tracking-tight italic text-white underline decoration-primary">ELES CHEGARAM LÁ.</h2>
         </div>
         
         <div className="hidden md:block">
           <SectionHeader 
             badge="SÓ RESULTADO REAL" 
             title="O que dizem os futuros aprovados" 
           />
         </div>
         
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {TESTIMONIALS.map((t, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 className="glass p-8 md:p-10 rounded-[40px] md:rounded-[48px] border-white/5 flex flex-col justify-between bg-white/[0.01]"
               >
                 <div className="space-y-4 md:space-y-6">
                    <div className="flex gap-1">
                       {[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-accent text-accent" />)}
                    </div>
                    <p className="text-gray-300 font-medium text-lg leading-relaxed italic">"{t.text}"</p>
                 </div>
                 
                 <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <img src={t.avatar} className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5" />
                       <div className="text-left">
                          <div className="text-xs md:text-sm font-black uppercase italic">{t.name}</div>
                          <div className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest">Aluno Pro</div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-[8px] md:text-[9px] font-black uppercase opacity-40 mb-1">Anterior: {t.before}</div>
                       <div className="text-lg md:text-xl font-display font-black text-primary">DEPOIS: {t.after}</div>
                    </div>
                 </div>
               </motion.div>
            ))}
         </div>
      </section>
      {/* MOBILE FAQ & GUARANTEE */}
      <section className="md:hidden py-16 px-6 bg-[#08080C]">
         <div className="space-y-6 mb-12">
            <h3 className="text-2xl font-display font-black italic uppercase text-white">Dúvidas Frequentes</h3>
            <div className="space-y-4">
               {[
                  { q: "Sou péssimo em redação, funciona?", a: "Sim! O método foi feito para quem tira 600 e quer o 900+ rápido." },
                  { q: "Como recebo o acesso?", a: "Imediato após o pagamento. Você recebe tudo por e-mail." },
                  { q: "O pagamento é único?", a: "Sim. Pague uma vez, use para sempre. Sem mensalidades." }
               ].map((f, i) => (
                  <div key={i} className="p-5 glass border-white/5 rounded-2xl bg-white/[0.01]">
                     <h4 className="text-xs font-black uppercase text-primary mb-2">? {f.q}</h4>
                     <p className="text-[11px] text-gray-400 font-bold leading-relaxed italic">{f.a}</p>
                  </div>
               ))}
            </div>
         </div>

         <div className="p-8 glass rounded-3xl border-success/20 bg-success/5 text-center space-y-4">
            <div className="w-16 h-16 bg-success rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-success/20">
               <ShieldCheck className="text-white" size={32} />
            </div>
            <div>
               <h4 className="text-sm font-black uppercase tracking-widest text-success mb-2">RISCO ZERO: GARANTIA DE 7 DIAS</h4>
               <p className="text-xs text-gray-400 font-bold leading-relaxed italic">
                 Se você não gostar de qualquer coisa, te devolvemos 100% do valor. O risco é todo nosso.
               </p>
            </div>
         </div>
      </section>

      {/* FINAL CTA - Simplified for Mobile */}
      <section className="py-24 md:py-48 px-6 relative">
         <div className="absolute top-0 left-1/2 -track-x-1/2 w-px h-24 md:h-48 bg-gradient-to-b from-transparent to-primary" />
         
         <div className="max-w-4xl mx-auto bento-card text-center p-8 md:p-32 border-primary/20 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 overflow-hidden relative">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
               <div className="mb-8 md:mb-12">
                  <p className="text-primary font-black uppercase tracking-[0.4em] mb-6 md:mb-8 italic text-white text-xs md:text-sm">O ENEM NÃO ESPERA POR VOCÊ</p>
                  <Countdown />
               </div>
               
               <h2 className="text-5xl md:text-8xl font-display font-black mb-8 md:mb-12 tracking-tighter leading-[0.8] italic text-white flex flex-col gap-2">
                  VAMOS COMEÇAR 
                  <span className="text-gradient">O SEU 1000?</span>
               </h2>
               
               <div className="flex flex-col items-center mb-10 md:mb-16">
                  <div className="space-y-2 md:space-y-4 mb-6 md:mb-10">
                     <p className="text-xl md:text-2xl font-display font-medium line-through opacity-20">DE R$ 99,90</p>
                     <p className="text-7xl md:text-8xl font-display font-black text-white">R$ 29,90</p>
                     <div className="px-4 md:px-6 py-2 bg-success/10 border border-success/20 rounded-full text-[10px] md:text-[12px] font-black uppercase tracking-widest text-success inline-block mt-2">
                        VOCÊ ECONOMIZA R$ 70,00 (70% OFF)
                     </div>
                  </div>
                  
                  <p className="text-sm md:text-lg text-gray-400 max-w-sm mx-auto font-medium leading-relaxed italic bg-white/5 p-4 rounded-2xl border border-white/5">
                    "Menos do que um café por mês, <br className="hidden md:block" /> mais que sua aprovação."
                  </p>
               </div>

               <div className="max-w-md mx-auto mb-10 pt-4 md:pt-8">
                 <button 
                   onClick={handleCTA}
                   className="w-full bg-primary text-white py-6 md:py-10 rounded-[32px] md:rounded-[48px] text-xl md:text-3xl font-display font-black hover:scale-105 active:scale-95 transition-all shadow-[0_20px_100px_rgba(255,0,102,0.3)] group flex items-center justify-center gap-4"
                 >
                   QUERO MEU 1000! <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
                 </button>
               </div>

               <div className="p-6 md:p-8 glass rounded-2xl md:rounded-3xl border-success/20 bg-success/5 mt-8 md:mt-12 max-w-xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-success rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-success/20 group hover:rotate-12 transition-transform">
                     <ShieldCheck className="text-white" size={28} />
                  </div>
                  <div>
                     <h4 className="text-xs md:text-sm font-black uppercase tracking-widest text-success mb-1 md:mb-2">GARANTIA DE 7 DIAS</h4>
                     <p className="text-[10px] md:text-xs text-gray-400 font-bold leading-relaxed">Se não gostar do método, devolvemos 100% do seu dinheiro imediatamente.</p>
                  </div>
               </div>
               
               <div className="mt-12 md:mt-20 flex justify-center gap-6 md:gap-10 opacity-30 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">
                  <span>● CHECKOUT SEGURO</span>
                  <span>● LIBERAÇÃO IMEDIATA</span>
               </div>
            </div>
         </div>
      </section>

      {/* FAQ - Hidden on Mobile */}
      <section id="faq" className="hidden md:block py-40 px-6">
        <SectionHeader badge="SÓ RESPOSTA PENSADA" title="Ficou alguma dúvida?" />
        <div className="max-w-4xl mx-auto space-y-6">
          {[
            { 
               q: "Eu sou péssimo em redação, consigo aprender isso?", 
               a: "Absolutamente! Temos alunos que entraram sem saber colocar um ponto final e saíram com nota 900+. Ninguém é péssimo, só te falta o método e as estruturas prontas que o ENEM espera de você." 
            },
            { 
               q: "Quanto tempo preciso estudar por dia?", 
               a: "Apenas 30 minutos. Nossas aulas são diretas ao ponto, sem enrolação. Você começa a ver resultado na clareza do seu texto em 3 dias, não 3 meses." 
            },
            { 
               q: "Vou conseguir nota 950+ mesmo?", 
               a: "Nossos alunos focados têm média de 900-950. Se você seguir o Arsenal e usar as estruturas que fornecemos, sua nota vai disparar naturalmente porque você vai parar de cometer erros 'bobos' de competência." 
            },
            { 
               q: "E se eu comprar e não gostar?", 
               a: "Fica tranquilo. Você tem 30 dias de garantia completa. Se por qualquer motivo sentir que o método não é para você, basta pedir o reembolso. Simples assim, risco zero." 
            },
            { 
               q: "Qual é a diferença entre este curso e outros?", 
               a: "Enquanto outros cursos te vendem horas de teoria chata e gramática pesada, nós te entregamos o que REALMENTE RESOLVE: Estruturas prontas, correções por IA instantâneas e o caminho mais curto para a aprovação." 
            }
          ].map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass p-10 rounded-[40px] border-white/5 hover:border-primary/20 transition-all group"
            >
              <h4 className="text-xl font-bold mb-6 flex items-center gap-4 italic tracking-tight text-white">
                 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform tracking-normal group-hover:bg-primary group-hover:text-white">?</div>
                 {faq.q}
              </h4>
              <p className="text-gray-400 font-medium leading-relaxed pl-14">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="mt-40 py-24 px-12 border-t border-white/5 opacity-50">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-2">
               <Trophy size={20} className="text-primary" />
               <span className="font-display font-black text-xl tracking-tighter uppercase">RED 1000 PRO</span>
            </div>
            <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black uppercase tracking-widest text-gray-500">
               <span>© 2024 • MatheuS 1000 PRO</span>
               <button onClick={() => setShowAuth('login')} className="hover:text-primary transition-colors">Área do Aluno</button>
               <a href="#" className="text-primary hover:underline">contato@redacao1000pro.com</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
