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
              <h3 className="text-2xl font-display font-black mb-4 italic tracking-tight">{step.title === "Recursos Prontos" ? "A Engenharia Reversa" : step.title === "Treino Prático" ? "Treinamento Celular" : "Simbiose com Malu IA"}</h3>
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
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-[#FF6B35]/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-[#00FF88]/10 blur-[180px] rounded-full animate-pulse" />
      </div>

      {/* --- UNIFIED HIGH-CONVERTING LANDING PAGE (BG #1A1A1A) --- */}
      <div className="relative z-10 bg-[#1A1A1A] text-white min-h-screen pt-24 pb-12 selection:bg-[#FF6B35]/30">
        
        {/* SEÇÃO 1: HERO (3-5 segundos) */}
        <section className="py-12 md:py-24 px-5 max-w-7xl mx-auto relative justify-center">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Copy & CTA */}
            <div className="lg:col-span-12 xl:col-span-7 space-y-8 text-center xl:text-left">
              {/* Proof Points */}
              <div className="inline-flex flex-wrap items-center justify-center xl:justify-start gap-2.5 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-full">
                <span className="text-[#00FF88] font-black text-xs">✅ 2.847 alunos</span>
                <span className="text-white/20">|</span>
                <span className="text-white font-bold text-xs">92% com 750+</span>
                <span className="text-white/20">|</span>
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-current text-amber-400" />)}
                  </div>
                  <span className="text-xs font-black text-white">4,9/5 estrelas</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black leading-[1.05] tracking-tight text-white uppercase italic">
                De 550 para <span className="text-[#00FF88] block sm:inline">850+ em 90 Dias</span> <br/>
                <span className="text-white/80 text-3xl sm:text-4xl md:text-5xl">(Sem Cursinho Caro)</span>
              </h1>

              {/* Subheadline (Incorporando a Frase do Panico e o Texto Maior) */}
              <p className="text-xl sm:text-2xl text-white/95 leading-normal font-black text-[#FF6B35] tracking-tight py-1 bg-[#FF6B35]/5 rounded-xl px-4 border-l-4 border-[#FF6B35] max-w-2xl mx-auto xl:mx-0">
                Finalmente: o fim do pânico na hora de escrever redação ENEM.
              </p>
              
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-semibold max-w-2xl mx-auto xl:mx-0">
                Ebook estruturado + IA que corrige em 30s + 3000 repertórios prontos
              </p>

              {/* CTA Button */}
              <div className="space-y-4 pt-4 text-center xl:text-left">
                <button 
                  onClick={handleCTA}
                  className="w-full sm:w-auto bg-[#FF6B35] hover:bg-[#ff7b46] text-white px-10 py-6 rounded-2xl text-lg sm:text-xl font-display font-black tracking-wider uppercase transition-all shadow-[0_15px_40px_rgba(255,107,53,0.35)] hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-3 mx-auto xl:mx-0 group border-b-4 border-black/30 animate-pulse"
                >
                  GARANTIR ACESSO - R$ 97
                  <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                </button>
                <p className="text-[#00FF88] text-xs font-extrabold uppercase tracking-wider">
                  ⏰ Apenas 7 vagas restantes nesta oferta
                </p>
              </div>
            </div>

            {/* Right Column: Visuals */}
            <div className="lg:col-span-12 xl:col-span-5 space-y-6">
              {/* Evolution Badges */}
              <div className="glass p-6 rounded-3xl border-white/5 bg-[#151515]/90 space-y-4 shadow-xl">
                <p className="text-[11px] font-black uppercase text-[#00FF88] tracking-widest flex items-center gap-1.5">
                  🛡️ EVOLUÇÃO COMPROVADA
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-white/50">Antes do programa</span>
                    <span className="bg-red-500/15 text-red-400 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-red-500/10">Nota Média: 550</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '55%' }} />
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-white/5">
                    <span className="text-xs font-black uppercase text-[#00FF88]">Depois do RED 1000 PRO</span>
                    <span className="bg-[#00FF88]/15 text-[#00FF88] font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-[#00FF88]/10">Média: 850+</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00FF88] rounded-full animate-pulse" style={{ width: '88%' }} />
                  </div>
                </div>
              </div>

              {/* Correction mockup */}
              <div className="glass p-5 rounded-3xl border-white/5 bg-[#121212] space-y-3 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00FF88] animate-ping" />
                    <span className="text-[10px] font-black uppercase text-white/60 tracking-wider">Malu IA • Corretora v3.0</span>
                  </div>
                  <span className="text-[9px] font-bold text-white/30 font-mono">ENEM 2026</span>
                </div>
                <p className="text-xs text-white/50 italic leading-relaxed">
                  "O consumismo na sociedade contemporânea, segundo Bauman..."
                </p>
                <div className="p-3 bg-[#1A1A1A] rounded-xl border border-white/5 space-y-2">
                  <p className="text-xs font-bold text-white leading-normal">
                    💡 <span className="text-[#00FF88]">Análise concluída em 30 segundos!</span> Excelente uso da sociologia. Corrija o conectivo do D2 para garantir nota máxima na C4.
                  </p>
                  <div className="flex gap-1.5">
                    <span className="text-[8px] font-black bg-[#FF6B35]/10 text-[#FF6B35] px-2 py-0.5 rounded uppercase">Erro Identificado</span>
                    <span className="text-[8px] font-black bg-[#00FF88]/10 text-[#00FF88] px-2 py-0.5 rounded uppercase font-mono">Nota Projetada: 940+</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* MOBILE VER_COMO_FUNCIONA AUTO-PROMOTIONAL SCROLLER (REQUEST 1, 2) */}
        <section id="como-funciona-mobile" className="md:hidden pt-4 pb-8 px-5 bg-black/10 border-t border-white/5 scroll-mt-20">
          <HowItWorks onAction={handleCTA} isMobile />
          
          {/* USER SPECIFIC REQUEST 5: "Deixe o preço em baixo de como funciona" */}
          <div className="mt-8 space-y-4 pt-4 bg-white/[0.01] border border-white/5 p-4 rounded-3xl text-left bg-gradient-to-b from-white/[0.01] to-[#FF6B35]/[0.02]">
               <div className="flex items-center justify-between px-2">
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black uppercase tracking-widest text-[#00FF88] bg-[#00FF88]/15 px-2.5 py-1 rounded w-fit border border-[#00FF88]/20">Oferta Especial</span>
                     <span className="text-[8.5px] font-black text-[#FF6B35] uppercase tracking-wider mt-1.5 leading-none">Últimas vagas com desconto</span>
                  </div>
                  <div className="text-right flex flex-col justify-end">
                     <span className="text-xs line-through opacity-30 font-black block leading-none mb-1">R$ 197</span>
                     <span className="text-3xl text-white font-black tracking-tight italic leading-none">R$ 97</span>
                  </div>
               </div>
               
               <button 
                 onClick={handleCTA}
                 className="group w-full bg-[#FF6B35] text-white py-5 rounded-2xl text-base font-display font-black shadow-[0_15px_35px_rgba(255,107,53,0.3)] active:scale-95 transition-all flex flex-col items-center justify-center gap-0 border-b-4 border-black/30"
               >
                 <span className="flex items-center gap-2">GARANTIR ACESSO AGORA <ArrowRight size={16} /></span>
                 <span className="text-[9px] opacity-70 font-bold uppercase tracking-widest">Acesso vitalício à Plataforma</span>
               </button>
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

            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Card 1 */}
              <div className="glass p-6 rounded-3xl border-white/10 hover:border-[#FF6B35]/30 hover:bg-white/[0.02] transition-colors flex gap-4 items-start bg-[#1a1a1a]">
                <div className="p-3 bg-white/5 rounded-2xl text-xl text-[#FF6B35] shrink-0">📖</div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase text-white">EBOOK INICIANTE→AVANÇADO</h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-semibold">
                    156 páginas. 5 pilares + estruturas que funcionam + 12 redações nota 1000 comentadas + 50+ repertórios.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="glass p-6 rounded-3xl border-white/10 hover:border-[#FF6B35]/30 hover:bg-white/[0.02] transition-colors flex gap-4 items-start bg-[#1a1a1a]">
                <div className="p-3 bg-white/5 rounded-2xl text-xl text-[#FF6B35] shrink-0">🤖</div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase text-white">IA QUE CORRIGE 24/7</h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-semibold">
                    Manda sua redação. Em 30 segundos recebe: nota em cada competência, erros específicos, sugestões de melhoria. Ilimitado.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="glass p-6 rounded-3xl border-white/10 hover:border-[#FF6B35]/30 hover:bg-white/[0.02] transition-colors flex gap-4 items-start bg-[#1a1a1a]">
                <div className="p-3 bg-white/5 rounded-2xl text-xl text-[#FF6B35] shrink-0">📚</div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase text-white">3000 REPERTÓRIOS PRONTOS</h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-semibold">
                    Filósofos, dados, histórias - tudo organizado por tema. Busca rápido e usa na hora.
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="glass p-6 rounded-3xl border-white/10 hover:border-[#FF6B35]/30 hover:bg-white/[0.02] transition-colors flex gap-4 items-start bg-[#1a1a1a]">
                <div className="p-3 bg-white/5 rounded-2xl text-xl text-[#FF6B35] shrink-0">⭐</div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase text-white">COMUNIDADE + MENTORIAS</h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-semibold">
                    Dúvidas? Responde na comunidade privada. Mentorias coletivas 2x por semana.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 3: PROVA SOCIAL (Só números com mais depoimentos no mobile - REQUEST 2) */}
        <section className="py-16 md:py-24 px-5 max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[#00FF88] text-xs font-black uppercase tracking-[0.2em]">PROVA REAL OUVIDA DOS ALUNOS</span>
            <h2 className="text-3xl md:text-5xl font-display font-black uppercase italic text-white leading-none">
              O Que Eles Dizem Sem Censura
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Depoimento 1 */}
            <div className="glass p-6 rounded-3xl border-white/5 bg-[#141414]/90 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-current text-amber-400" />)}
                </div>
                <p className="text-sm sm:text-base text-white/95 italic leading-relaxed font-semibold">
                  "Saí de 640 para 820 em 8 semanas. A estrutura reduziu minha ansiedade de travar na hora da escrita do ENEM."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-right text-xs font-black uppercase tracking-wider text-[#FF6B35]">
                — João, SP
              </div>
            </div>

            {/* Depoimento 2 */}
            <div className="glass p-6 rounded-3xl border-white/5 bg-[#141414]/90 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-current text-amber-400" />)}
                </div>
                <p className="text-sm sm:text-base text-white/95 italic leading-relaxed font-semibold">
                  "Melhor investimento do ano. O arsenal de repertório pronto salvou minha aprovação."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-right text-xs font-black uppercase tracking-wider text-[#FF6B35]">
                — Maria, RJ
              </div>
            </div>

            {/* Depoimento 3 */}
            <div className="glass p-6 rounded-3xl border-white/5 bg-[#141414]/90 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-current text-amber-400" />)}
                </div>
                <p className="text-sm sm:text-base text-white/95 italic leading-relaxed font-semibold">
                  "Meu filho subiu mais de 230 pontos treinando com a corretora Malu. Recomendo para todos os pais estressados."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-right text-xs font-black uppercase tracking-wider text-[#FF6B35]">
                — Carlos (Pai), MG
              </div>
            </div>

            {/* Extra Prova Social para Mobile (Request 2) */}
            <div className="glass p-6 rounded-3xl border-white/5 bg-[#141414]/90 flex flex-col justify-between md:hidden">
              <div className="space-y-4">
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-current text-amber-400" />)}
                </div>
                <p className="text-sm text-white/95 italic leading-relaxed font-semibold">
                  "As correções da Malu em 30 segundos me permitiram ajustar meus erros na hora. Economiza muito dinheiro!"
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-right text-xs font-black uppercase tracking-wider text-[#FF6B35]">
                — Bruna K., PR
              </div>
            </div>

            <div className="glass p-6 rounded-3xl border-white/5 bg-[#141414]/90 flex flex-col justify-between md:hidden">
              <div className="space-y-4">
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-current text-amber-400" />)}
                </div>
                <p className="text-sm text-white/95 italic leading-relaxed font-semibold">
                  "Estava travada na nota 600 em redações e tirei 920 pontos na redação de 2025!"
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-right text-xs font-black uppercase tracking-wider text-[#FF6B35]">
                — Gabriela M., BA
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
                Dúvidas?
              </h2>
            </div>

            <div className="grid gap-4">
              {[
                { q: "Quanto tempo por dia?", a: "Apenas 45 min, 4-5x por semana. Você estuda no seu tempo." },
                { q: "Funciona junto com o cursinho presencial?", a: "Sim, serve como um impulsionador de nota. A maioria dos nossos alunos estuda assim." },
                { q: "Quanto tempo para eu ver o resultado?", a: "4 a 6 semanas para notar alta consistência no 750+ e de 8 a 12 semanas para notas 850+." },
                { q: "Sou totalmente iniciante, vou entender?", a: "Sim, começamos do zero teórico absoluto. O Ebook tem um guia básico para redação." },
                { q: "O acesso dura quanto tempo?", a: "Acesso vitalício. O método é seu de forma permanente." },
                { q: "E se eu não gostar ou achar difícil?", a: "Garantia incondicional de 7 dias. Não gostou? Devolvemos 100% sem perguntas." }
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
          </div>
        </section>

        {/* SEÇÃO 5: DECISÃO + URGÊNCIA */}
        <section className="py-16 md:py-28 px-5 max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[#00FF88] text-xs font-black uppercase tracking-[0.2em]">O FUTURO É SEU</span>
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase italic text-white leading-none">
              Você Está Pronto?
            </h2>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-[32px] p-8 md:p-12 text-center space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest bg-red-600 px-3 py-1 rounded inline-block text-white animate-pulse">
                🔥 OFERTA ATIVA HOJE
              </span>
              <div className="flex items-center justify-center gap-4 pt-4">
                <span className="text-lg md:text-xl line-through text-white/30 font-bold">R$ 197</span>
                <span className="text-5xl md:text-6xl text-white font-black italic tracking-tighter">R$ 97</span>
              </div>
            </div>

            <p className="text-[#00FF88] font-black text-xs md:text-sm uppercase tracking-widest border border-[#00FF88]/20 py-2.5 rounded-xl bg-[#00FF88]/5 inline-block px-6">
              ⏰ APENAS 7 VAGAS DISPONÍVEIS
            </p>

            <div className="grid grid-cols-3 gap-2 pt-4 text-center text-[10px] md:text-xs text-white/80 font-bold border-t border-white/5 max-w-lg mx-auto">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-[#00FF88] text-lg">✓</span> 7 dias de garantia
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-[#00FF88] text-lg">✓</span> Acesso vitalício
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-[#00FF88] text-lg">✓</span> Sem mensalidade
              </div>
            </div>

            <div className="pt-4">
              <button 
                onClick={handleCTA}
                className="w-full bg-[#FF6B35] hover:bg-[#ff7b46] text-white py-6 rounded-2xl text-lg sm:text-xl font-display font-black tracking-wider uppercase transition-all shadow-[0_15px_35px_rgba(255,107,53,0.4)] hover:scale-[1.03] active:scale-[0.97] border-b-4 border-black/30 animate-pulse"
              >
                GARANTIR MEU ACESSO AGORA
              </button>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-3 font-mono">
                🔒 PAGAMENTO ÚNICO • DADOS TOTALMENTE CRIPTOGRAFADOS
              </p>
            </div>
          </div>
        </section>

        {/* SEÇÃO 6: PÓS-COMPRA (1 parágrafo) */}
        <section className="py-12 md:py-16 px-5 max-w-2xl mx-auto">
          <div className="bg-[#151515] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-4 text-center md:text-left">
            <h3 className="text-base sm:text-lg font-black uppercase text-[#00FF88] flex items-center justify-center md:justify-start gap-2">
              <span>👉</span> Pronto! Você receberá acesso em 2 minutos:
            </h3>
            
            <div className="grid grid-cols-4 gap-3 text-xs font-bold text-white/90 text-center">
              <div className="p-3 bg-[#111] border border-white/5 rounded-xl">
                <span className="block text-lg mb-1">📧</span> Login IA
              </div>
              <div className="p-3 bg-[#111] border border-white/5 rounded-xl">
                <span className="block text-lg mb-1">📘</span> Ebook
              </div>
              <div className="p-3 bg-[#111] border border-white/5 rounded-xl">
                <span className="block text-lg mb-1">👥</span> Comunidade
              </div>
              <div className="p-3 bg-[#111] border border-white/5 rounded-xl">
                <span className="block text-lg mb-1">🧠</span> Mentorias
              </div>
            </div>

            <p className="text-[11px] sm:text-xs text-[#FF6B35] font-black text-center md:text-left tracking-wider uppercase pt-2 animate-pulse">
              PRÓXIMO PASSO: Baixe seu material → Escreva sua redação piloto → Mande para a Malu criar seu plano
            </p>
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

      </div>
    </div>
  );
}
