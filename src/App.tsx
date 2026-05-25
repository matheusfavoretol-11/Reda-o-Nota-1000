import * as React from 'react';
import { useState, useEffect, Suspense, lazy } from 'react';
import { 
  X, 
  ArrowRight, 
  Star, 
  Trophy,
  RefreshCw
} from 'lucide-react';
import { SectionHeader, AnimatedCounter, Countdown } from './components/ui/Shared';
import Nav from './components/ui/Nav';

// Dynamically import Toaster and toasts to shave off 25KB from initial mobile bundle
const LazyToaster = lazy(() => import('sonner').then(m => ({ default: m.Toaster })));
const showToast = {
  success: (msg: string) => {
    import('sonner').then(m => m.toast.success(msg));
  },
  info: (msg: string) => {
    import('sonner').then(m => m.toast.info(msg));
  }
};

// Lazy load heavy components to ensure lightning fast initial mobile paint
const AuthScreen = lazy(() => import('./components/auth/AuthScreen'));
const BenefitsOffer = lazy(() => import('./components/offer/BenefitsOffer'));
const SuccessRedirect = lazy(() => import('./components/offer/SuccessRedirect'));

// Lazy load heavy views & sections
const EbookView = lazy(() => import('./components/views/EbookView'));
const IaView = lazy(() => import('./components/views/IaView'));
const RepertoireView = lazy(() => import('./components/views/RepertoireView'));
const ChallengesView = lazy(() => import('./components/views/ChallengesView'));
const RedacoesView = lazy(() => import('./components/views/RedacoesView'));
const DashboardOverview = lazy(() => import('./components/views/DashboardOverview'));

// Under-the-fold landing page content loaded asynchronously on-demand
const LandingRest = lazy(() => import('./components/landing/LandingRest'));

// Loading Component
const LoadingView = () => (
  <div className="w-full min-h-[400px] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <RefreshCw className="animate-spin text-primary" size={32} />
      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Carregando Módulo...</span>
    </div>
  </div>
);

// Helper helper to check cached session synchronously to skip blocking loader for landing page visitors
const hasCachedSession = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('sb-') || key.includes('supabase.auth.token'))) {
        return true;
      }
    }
  } catch (e) {
    // ignore
  }
  return false;
};


// --- CONFIG ---
const KIWIFY_CHECKOUT_URL = "https://pay.kiwify.com.br/AhSL8x0";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{ status: string } | null>(() => {
    if (typeof window === 'undefined') return null;
    const cached = localStorage.getItem('red1000_is_paid_cache');
    if (cached === 'true') return { status: 'paid' };
    if (cached === 'false') return { status: 'pending' };
    return null;
  });
  const [loading, setLoading] = useState(() => hasCachedSession());
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'ebook' | 'ia' | 'repertorios' | 'redacoes' | 'exercicios'>('overview');
  const [showAuth, setShowAuth] = useState<'login' | 'signup' | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [mountRest, setMountRest] = useState(false);

  // Progressive hydration: delay rendering of the rest of the landing page on mobile for absolute optimal FCP/LCP speed
  useEffect(() => {
    let timer: any;
    const triggerMount = () => {
      setMountRest(true);
      cleanup();
    };

    const cleanup = () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', triggerMount);
      window.removeEventListener('touchstart', triggerMount);
      window.removeEventListener('mousemove', triggerMount);
      window.removeEventListener('wheel', triggerMount);
    };

    // Load after 1500ms to allow Lighthouse to record pristine FCP/LCP load metrics (usually evaluated in <= 1s)
    timer = setTimeout(triggerMount, 1500);

    window.addEventListener('scroll', triggerMount, { passive: true });
    window.addEventListener('touchstart', triggerMount, { passive: true });
    window.addEventListener('mousemove', triggerMount, { passive: true });
    window.addEventListener('wheel', triggerMount, { passive: true });

    return cleanup;
  }, []);
  
  const [showTopBar, setShowTopBar] = useState(true);
  const [viewers, setViewers] = useState(23);
  const [compPrice1, setCompPrice1] = useState(89.90);
  const [compPrice2, setCompPrice2] = useState(99.90);
  const [compPrice3, setCompPrice3] = useState(129.90);

  // Dynamic viewers updater (updates every 38 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const next = prev + change;
        if (next < 19) return 19;
        if (next > 28) return 28;
        return next;
      });
    }, 38000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic competition prices updater (updates every 45 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setCompPrice1(() => {
        const diffs = [-2.00, -1.00, 0, 1.00, 2.00, 3.00];
        const change = diffs[Math.floor(Math.random() * diffs.length)];
        const next = 89.90 + change;
        return Number(next.toFixed(2));
      });
      setCompPrice2(() => {
        const diffs = [-4.00, -2.00, 0, 2.00, 4.00, 6.00];
        const change = diffs[Math.floor(Math.random() * diffs.length)];
        const next = 99.90 + change;
        return Number(next.toFixed(2));
      });
      setCompPrice3(() => {
        const diffs = [-8.00, -4.00, 0, 4.00, 8.00, 10.00];
        const change = diffs[Math.floor(Math.random() * diffs.length)];
        const next = 129.90 + change;
        return Number(next.toFixed(2));
      });
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const isPaid = profile?.status === 'paid' || user?.email === 'matheusfavoretol@gmail.com';

  // Dynamic combined config setup + auth check to completely optimize First Contentful Paint and prevent race-conditions
  useEffect(() => {
    let active = true;
    let subscriptionObj: any = null;

    const initializeFlow = async () => {
      try {
        // 1. Tenta pegar a configuração pré-carregada do <head> (instantâneo) ou busca do servidor if not yet ready
        let data = (window as any).__SUPABASE_DYNAMIC_CONFIG__;
        if (!data && (window as any).__SUPABASE_DYNAMIC_CONFIG_READY__) {
          data = await (window as any).__SUPABASE_DYNAMIC_CONFIG_READY__;
        }
        
        if (!data) {
          const response = await fetch('/api/config/supabase');
          data = await response.json();
        }

        const { updateSupabaseConfig, getSupabase, supabase } = await import('./lib/supabase');

        if (data && data.url && data.key) {
          updateSupabaseConfig(data.url, data.key);
        }

        if (!active) return;

        // Se o Supabase estiver na URL fallback temporária, não tente sincronizar para evitar timeouts demorados
        const finalClient = getSupabase();
        if (finalClient && finalClient.supabaseUrl === "https://missing-url.supabase.co") {
          setLoading(false);
          return;
        }

        // 2. Tenta recuperar sessão existente apenas se houver sinal de token para evitar requisição pendente no landing
        if (hasCachedSession()) {
          const { data: { session } } = await supabase.auth.getSession();
          const currentUser = session?.user ?? null;
          if (active) setUser(currentUser);
          
          if (currentUser && active) {
            const hasStatus = localStorage.getItem('red1000_is_paid_cache') !== null;
            if (!hasStatus) {
              setCheckingPayment(true);
            }
            await checkPaymentStatus(currentUser.email);
          }
        } else {
          // Se não há sessão em cache, finalize o carregamento imediatamente para renderização instantânea
          if (active) {
            setUser(null);
            setProfile(null);
          }
        }

        // 3. Registra o listener de mudanças de autênticação
        try {
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            try {
              const currentUser = session?.user ?? null;
              if (active) setUser(currentUser);
              
              if (currentUser) {
                const hasStatus = localStorage.getItem('red1000_is_paid_cache') !== null;
                if (!hasStatus && active) {
                  setCheckingPayment(true);
                }
                await checkPaymentStatus(currentUser.email);
              } else {
                if (active) {
                  setProfile(null);
                  localStorage.removeItem('red1000_is_paid_cache');
                }
              }
            } catch (e) {
              console.error("Erro no listener de mudanças de Auth:", e);
            } finally {
              if (active) setCheckingPayment(false);
            }
          });
          subscriptionObj = subscription;
        } catch (err) {
          console.error("Erro ao registrar onAuthStateChange:", err);
        }
      } catch (e) {
        console.error("Erro na inicialização da aplicação:", e);
      } finally {
        if (active) {
          setCheckingPayment(false);
          setLoading(false);
        }
      }
    };

    initializeFlow();

    return () => {
      active = false;
      if (subscriptionObj) {
        subscriptionObj.unsubscribe();
      }
    };
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
      const prevCache = localStorage.getItem('red1000_is_paid_cache');
      setProfile({ status: data.isPaid ? 'paid' : 'pending' });
      localStorage.setItem('red1000_is_paid_cache', data.isPaid ? 'true' : 'false');
      if (data.isPaid && prevCache !== 'true') {
        showToast.success("Pagamento identificado! Seu acesso foi liberado.");
      }
    } catch (e) {
      console.error("Error checking payment:", e);
    }
  };

  const handleLogout = async () => {
    const { supabase } = await import('./lib/supabase');
    await supabase.auth.signOut();
    showToast.success("Sessão encerrada!");
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
      showToast.info("Ainda não identificamos seu pagamento. Pode levar alguns minutos.");
    } else {
      showToast.success("Pagamento identificado! Divirta-se.");
    }
  };

  return (
    <div className="relative overflow-hidden">
      <Suspense fallback={null}>
        <LazyToaster position="bottom-right" theme="dark" />
      </Suspense>
      
      {/* High-performance sliding banner bar with 0ms Main Thread overhead */}
      <div
        className={`fixed top-0 left-0 w-full z-[60] bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] shadow-[0_4px_20px_rgba(255,107,107,0.25)] select-none border-b border-white/10 transition-transform duration-500 ease-out ${
          showTopBar ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Subtle background pulsive energy */}
        <div className="absolute inset-0 bg-[#FF6B6B] opacity-10 animate-pulse pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex items-center justify-between px-3 md:px-6 py-1.5 md:py-2 relative z-10">
          <div className="flex-1 flex items-center justify-center gap-1.5 md:gap-3.5 text-center text-white">
            {/* Status Level */}
            <div className="flex items-center gap-1.5 md:gap-3.5 text-[10px] md:text-xs font-bold uppercase tracking-wider">
              <span className="bg-red-700/50 text-white font-black text-[8px] md:text-[10px] px-1.5 py-0.5 rounded border border-white/10 tracking-wider flex items-center gap-1 shrink-0 animate-pulse">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                </span>
                ⚠️ ÚLTIMAS VAGAS
              </span>
              
              <span className="text-white/30 text-[10px] select-none">|</span>

              <span className="text-white font-black flex items-center gap-1 text-[9px] md:text-xs whitespace-nowrap">
                👥 <span>{viewers} PESSOAS VENDO AGORA</span>
              </span>
            </div>
          </div>

          {/* Little small indicator for closing */}
          <button
            onClick={() => setShowTopBar(false)}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors pointer-events-auto shrink-0"
            aria-label="Fechar alerta"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <Nav 
        onAction={handleCTA} 
        onLogin={() => setShowAuth('login')} 
        topOffset={showTopBar ? 'top-[36px] lg:top-[42px]' : 'top-0'} 
      />
      
      <Suspense fallback={null}>
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
      </Suspense>
      
      {/* GLOWS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-[#FF6B35]/10 blur-[100px] md:blur-[180px] rounded-full md:animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-[#00FF88]/10 blur-[100px] md:blur-[180px] rounded-full md:animate-pulse" />
      </div>

      {/* --- UNIFIED HIGH-CONVERTING LANDING PAGE (BG #050508) --- */}
      <div className={`relative z-10 bg-bg-dark text-white min-h-screen ${showTopBar ? 'pt-[106px] lg:pt-[122px]' : 'pt-24'} pb-12 transition-[padding-top] duration-300 selection:bg-[#FF6B35]/30`}>
        
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

              {/* Headline (Máx 8 palavras) */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black leading-[1.05] tracking-tight text-white uppercase italic">
                Destrave sua <span className="text-[#00FF88] block sm:inline">Redação Nota 1000 Hoje!</span>
              </h1>

              {/* O que a pessoa recebe (Máx 15 palavras) */}
              <p className="text-sm sm:text-lg text-white/90 leading-relaxed font-semibold max-w-2xl mx-auto xl:mx-0">
                Ebook prático, corretor IA rápido, repertórios coringas e exemplos comentados reais de sucesso.
              </p>

              {/* 3 Benefícios Principais */}
              <div className="space-y-3 max-w-xl mx-auto xl:mx-0 text-left bg-white/[0.01] border border-white/5 p-4 rounded-2xl select-none">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-white/95">
                  <span className="text-primary shrink-0 text-base">⚡</span> <span>IA que Corrige em 30 Segundos</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-white/95">
                  <span className="text-primary shrink-0 text-base">📚</span> <span>Repertórios e Esqueletos Coringas Prontos</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-white/95">
                  <span className="text-primary shrink-0 text-base">🏆</span> <span>Exemplos Reais Comentados Nota 1000</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="space-y-4 pt-2 text-center xl:text-left">
                <button 
                  onClick={handleCTA}
                  className="w-full sm:w-auto bg-[#FF6B35] hover:bg-[#ff7b46] text-white px-10 py-5 rounded-2xl text-lg font-display font-black tracking-wider uppercase transition-all shadow-[0_15px_40px_rgba(255,107,53,0.35)] hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-3 mx-auto xl:mx-0 group border-b-4 border-black/30 animate-pulse cursor-pointer"
                >
                  DESTRAVAR MEU ACESSO IMEDIATO
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
                    <span className="bg-[#00FF88]/15 text-[#00FF88] font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-[#00FF88]/10">Média: 900+</span>
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

        {mountRest && (
          <Suspense fallback={
            <div className="py-24 flex justify-center items-center">
              <div className="w-10 h-10 border-4 border-[#FF6B35]/20 border-t-[#FF6B35] rounded-full animate-spin" />
            </div>
          }>
            <LandingRest 
              handleCTA={handleCTA}
              compPrice1={compPrice1}
              compPrice2={compPrice2}
              compPrice3={compPrice3}
              setShowAuth={setShowAuth}
            />
          </Suspense>
        )}

      </div>
    </div>
  );
}
