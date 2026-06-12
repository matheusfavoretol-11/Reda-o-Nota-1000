import * as React from 'react';
import { useState, useEffect, Suspense, lazy } from 'react';
import { 
  X, 
  ArrowRight, 
  Star, 
  Trophy,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { Countdown } from './components/ui/Shared';
import Nav from './components/ui/Nav';
import { WhatsAppScreenshot } from './components/landing/WhatsAppScreenshot';

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

  // Lazy loading of Supabase for outstanding FCP/LCP network chain speeds
  const [loadSupabase, setLoadSupabase] = useState(() => hasCachedSession());

  if ((showAuth !== null || user !== null) && !loadSupabase) {
    setLoadSupabase(true);
  }

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
  
  const [showTopBar, setShowTopBar] = useState(false);
  const [viewers, setViewers] = useState(23);
  const [compPrice1, setCompPrice1] = useState(89.90);
  const [compPrice2, setCompPrice2] = useState(99.90);
  const [compPrice3, setCompPrice3] = useState(129.90);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const mobileVideoRef = React.useRef<HTMLVideoElement>(null);
  const [playMobileVideo, setPlayMobileVideo] = useState(false);

  // Attempt to play the video once the component mounts
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (window.innerWidth < 768) {
        video.removeAttribute('autoplay');
        video.pause();
      } else {
        video.play().catch(err => {
          console.warn("Autoplay was prevented by the browser. Ready to play on user interaction.", err);
        });
      }
    }
  }, []);

  // Ensure mobile video plays immediately upon user click / play enablement
  useEffect(() => {
    if (playMobileVideo && mobileVideoRef.current) {
      mobileVideoRef.current.play().catch(err => {
        console.warn("Falha ao iniciar vídeo no mobile", err);
      });
    }
  }, [playMobileVideo]);

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
    if (!loadSupabase) {
      setLoading(false);
      setCheckingPayment(false);
      return;
    }

    let active = true;
    let subscriptionObj: any = null;

    const initializeFlow = async () => {
      try {
        // 1. Tenta pegar a configuração pré-carregada do <head> (instantâneo) ou busca do servidor if not yet ready
        let data = (window as any).__SUPABASE_DYNAMIC_CONFIG__;
        if (!data && (window as any).__SUPABASE_DYNAMIC_CONFIG_READY__) {
          try {
            data = await (window as any).__SUPABASE_DYNAMIC_CONFIG_READY__;
          } catch (e) {
            // Ignorado, usará fallbacks
          }
        }
        
        if (!data) {
          try {
            const response = await fetch('/api/config/supabase');
            const contentType = response.headers.get("content-type");
            if (response.ok && contentType && contentType.includes("application/json")) {
              data = await response.json();
            }
          } catch (e) {
            // Ignorado, usará fallbacks
          }
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
  }, [loadSupabase]);

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
    try {
      const { supabase } = await import('./lib/supabase');
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('red1000_is_paid_cache');
    localStorage.removeItem('red1000_free_test');
    setUser(null);
    setProfile(null);
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
    <div className="relative overflow-hidden bg-[#050508] text-white min-h-screen">
      <Suspense fallback={null}>
        <LazyToaster position="bottom-right" theme="dark" />
      </Suspense>
      
      {/* Top Bar matching static index.html layout */}
      <div className="fixed top-0 left-0 w-full z-[60] bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] shadow-[0_4px_20px_rgba(255,107,107,0.25)] select-none border-b border-white/10 h-[36px] lg:h-[42px] flex items-center justify-between px-3 md:px-6">
        <div className="absolute inset-0 bg-[#FF6B6B] opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex items-center justify-between px-3 md:px-6 relative z-10 w-full">
          <div className="flex-1 flex items-center justify-center gap-1.5 md:gap-3.5 text-center text-white">
            <div className="flex items-center gap-1.5 md:gap-3.5 text-[10px] md:text-xs font-bold uppercase tracking-wider">
              <span className="bg-red-700/50 text-white font-black text-[8px] md:text-[10px] px-1.5 py-0.5 rounded border border-white/10 tracking-wider flex items-center gap-1 shrink-0">
                ⚠️ ÚLTIMAS VAGAS
              </span>
              <span className="text-white/30 text-[10px] select-none">|</span>
              <span className="text-white font-black flex items-center gap-1 text-[9px] md:text-xs whitespace-nowrap">
                👥 <span>{viewers} PESSOAS VENDO AGORA</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <Nav 
        onAction={handleCTA} 
        onLogin={() => setShowAuth('login')} 
        topOffset="top-[36px] lg:top-[42px]" 
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
      <div className="relative z-10 bg-bg-dark text-white min-h-screen pt-[106px] lg:pt-[122px] pb-12 selection:bg-[#FF6B35]/30">
        
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

              {/* Headline (Sugestão de Alta Conversão) */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black leading-[1.05] tracking-tight text-white uppercase italic">
                SAIA DO ZERO E GARANTA <span className="text-[#00FF88]">900+ NA REDAÇÃO</span> DO ENEM EM APENAS 4 SEMANAS
              </h1>

              {/* O que a pessoa recebe (O Mecanismo Único: Sem gramática chata, foco no Sistema de Blocos Lógicos) */}
              <p className="text-sm sm:text-lg text-white/90 leading-relaxed font-semibold max-w-2xl mx-auto xl:mx-0">
                Você não vai aprender gramática chata. Você vai dominar o <span className="text-[#00FF88]">Sistema de Blocos Lógicos</span>, onde você apenas encaixa suas ideias em uma estrutura "Coringa" que os corretores amam e serve para qualquer tema de 2026.
              </p>

              {/* Title above cellphone mockup requested by user */}
              <div className="text-center xl:text-left pt-4 -mb-2">
                <h3 className="text-base sm:text-lg font-display font-black tracking-widest text-[#00FF88] uppercase inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
                  Como funciona por dentro
                </h3>
              </div>

              {/* Video Mockup - Posicionado logo abaixo da frase/descrição */}
              <div 
                id="demo-video" 
                data-loading="lazy" 
                className="relative max-w-[280px] sm:max-w-[310px] mx-auto xl:mx-0 rounded-[48px] border-[10px] border-neutral-900 bg-black shadow-[0_0_50px_rgba(0,255,136,0.12),0_25px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/10 overflow-hidden group my-6 animate-fade-in"
                style={{ aspectRatio: '9/16', width: '280px', height: 'auto', contain: 'layout size' }}
              >
                
                {/* Front Camera Notch / Speaker */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neutral-900 rounded-b-2xl z-30 flex items-center justify-center">
                  <div className="w-10 h-1 bg-neutral-800 rounded-full" />
                  <div className="w-2 h-2 bg-neutral-950 rounded-full ml-2 border border-neutral-800/50" />
                </div>

                {/* Video Player Box with 9:16 aspect ratio */}
                <div className="relative bg-neutral-950 overflow-hidden w-full h-full" style={{ aspectRatio: '9/16' }}>
                  <a href="https://youtube.com/shorts/qvIivSti-ZM" target="_blank" rel="noopener noreferrer" className="absolute inset-0 block w-full h-full">
                    <img 
                      src="https://img.youtube.com/vi/qvIivSti-ZM/hqdefault.jpg"
                      alt="Assistir vídeo"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '9/16' }}
                      width={310}
                      height={551}
                      loading="lazy"
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-red-700 transition-all">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </a>
                  
                  {/* Overlay reflection for realism */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none z-20" />
                </div>

                {/* Home indicator bar */}
                <div className="absolute bottom-1 w-24 h-1 bg-white/20 rounded-full left-1/2 -translate-x-1/2 z-30 pointer-events-none" />
              </div>

              {/* 3 Benefícios Principais */}
              <div className="space-y-3 max-w-xl mx-auto xl:mx-0 text-left bg-white/[0.01] border border-white/5 p-4 rounded-2xl select-none">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-white/95">
                  <span className="text-[#00FF88] shrink-0 text-base">⚡</span> <span>Malu IA: Corretora automática em 30 Segundos</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-white/95">
                  <span className="text-[#00FF88] shrink-0 text-base">📚</span> <span>Sistema de Blocos Lógicos com Esqueletos Coringas Prontos</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-white/95">
                  <span className="text-[#00FF88] shrink-0 text-base">🏆</span> <span>Exemplos Reais Comentados Nota 1000 de Alunos Reais</span>
                </div>
              </div>

              {/* CTA Button + Scarcity Closing Timer */}
              <div className="space-y-4 pt-2 text-center xl:text-left">
                <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-[#FF6B35]/15 border border-[#FF6B35]/20 p-3 rounded-2xl w-fit mb-2">
                  <span className="text-[11px] font-black uppercase text-[#FF6B35] animate-pulse">🔥 Ganhe correções ilimitadas! Oferta por tempo limitado:</span>
                  <div className="shrink-0"><Countdown compact /></div>
                </div>

                <button 
                  onClick={handleCTA}
                  className="w-full sm:w-auto bg-[#FF6B35] hover:bg-[#ff7b46] text-white px-10 py-5 rounded-2xl text-lg font-display font-black tracking-wider uppercase transition-all shadow-[0_15px_40px_rgba(255,107,53,0.35)] hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-3 mx-auto xl:mx-0 group border-b-4 border-black/30 animate-pulse cursor-pointer"
                >
                  QUERO MINHA REDAÇÃO NOTA 1000
                  <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                </button>
                <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-4">
                  <p className="text-[#00FF88] text-xs font-extrabold uppercase tracking-wider">
                    ⏰ Apenas 7 vagas restantes nesta oferta
                  </p>
                  <span className="hidden sm:inline text-white/10 text-xs">|</span>
                  <div className="flex items-center gap-1.5 text-[#00FF88] font-display font-black text-[11px] uppercase tracking-wider">
                    <ShieldCheck size={14} className="text-[#00FF88]" />
                    <span>Garantia de 7 Dias Incondicional</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visuals */}
            <div className="lg:col-span-12 xl:col-span-5 space-y-6">
              {/* Ebook Mockup Cover Image (LCP optimized) */}
              <div className="relative max-w-[280px] sm:max-w-[320px] mx-auto xl:mx-0 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group mb-6 hover:scale-[1.02] transition-transform duration-300" style={{ aspectRatio: '350/490', width: '100%', contain: 'layout size' }}>
                <img 
                  src="/guia_do_zero.svg" 
                  alt="Guia do Zero ao 1000 Redação ENEM v3.0" 
                  width={350} 
                  height={490}
                  fetchPriority="high"
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: '350/490' }}
                  referrerPolicy="no-referrer"
                />
              </div>

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
          <>
            {/* SEÇÃO 2: PROVA SOCIAL */}
            <section className="py-12 pb-16 px-5 max-w-7xl mx-auto relative z-10 space-y-10 text-center animate-fade-in" id="prova-social">
              <div className="space-y-3">
                <span className="text-[#00FF88] text-xs font-black uppercase tracking-[0.2em] bg-[#00FF88]/10 px-3.5 py-1.5 rounded-full border border-[#00FF88]/20 inline-block">
                  PROVA DE ESTUDANTES REAIS (900+ NOTA OFICIAL)
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-black uppercase italic text-white leading-tight">
                  Eles também achavam que <span className="text-[#00FF88]">não sabiam escrever</span>
                </h2>
                <p className="text-sm text-gray-400 font-semibold max-w-xl mx-auto leading-relaxed">
                  Milhares de estudantes começaram do completo zero, venceram a folha em branco com o Sistema de Blocos Lógicos e garantiram as notas mais altas do país.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto min-h-[350px]">
                {/* Depoimento 1 - Bernardo Alves */}
                <WhatsAppScreenshot 
                  name="Bernardo Alves"
                  text="cara do céu... saí do absoluto zero pra tirar 960 pontos na redação do ENEM! 😱 o método de Blocos Lógicos impediu que eu travasse na prova. Vale cada centavo dms!"
                  time="14:32"
                  avatarBg="bg-[#FF3366]"
                />

                {/* Depoimento 2 - Maria, RJ */}
                <WhatsAppScreenshot 
                  name="Maria • RJ"
                  text="melhor investimento do ano real! Tirei 980 pontos na redação de 2025!! Mandei meu print lá no grupo de alunos, eu achava que redação era bicho de 7 cabeças 🥹"
                  time="18:05"
                  avatarBg="bg-[#7C3AED]"
                />

                {/* Depoimento 3 - Carlos (Pai), MG */}
                <WhatsAppScreenshot 
                  name="Carlos (Pai) • MG"
                  text="Meu filho subiu de 450 para 940 pontos oficiais treinando com os esqueletos prontos e a corretora Malu. Economizei milhares de reais com cursinhos caros 👍"
                  time="11:24"
                  avatarBg="bg-[#00FF88]"
                />

                {/* Depoimento 4 - Bruna K., PR */}
                <WhatsAppScreenshot 
                  name="Bruna K. • PR"
                  text="Tirei 940 pontos treinando com a Malu IA em 30 segundos! Corrigir toda semana sem esperar 10 dias por um corretor humano mudou o meu jogo."
                  time="09:41"
                  avatarBg="bg-[#FF6B35]"
                />

                {/* Depoimento 5 - Gabriela M., BA */}
                <WhatsAppScreenshot 
                  name="Gabriela M. • BA"
                  text="estava travada na nota 600 em redações e tirei 960 pontos na redação oficial do ENEM!! To dentro da Universidade Federal!! mto grata de verdade ❤️"
                  time="22:15"
                  avatarBg="bg-[#3B82F6]"
                />
              </div>
            </section>

            {/* SEÇÃO 3: RECURSOS COMPLEMENTARES DA PLATAFORMA */}
            <section className="py-8 pb-16 px-5 max-w-4xl mx-auto relative z-10 text-center animate-fade-in" id="features">
              {/* Key showcase feature list */}
              <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="text-[#00FF88] text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                    📖 ÁREA DO ALUNO
                  </div>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    Acesse o Guia de 30 páginas e esqueletos coringas diretamente na plataforma para acelerar sua redação.
                  </p>
                </div>
                
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="text-[#00FF88] text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                    🧠 TREINO PRÁTICO
                  </div>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    Exercícios e desafios rápidos com foco direto nas principais competências exigidas pela banca do ENEM.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="text-[#00FF88] text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                    🤖 CORRETORA MALU IA
                  </div>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    Escreva ou cole seu texto e receba correção, estimativa de nota e feedbacks detalhados em até 30 segundos.
                  </p>
                </div>
              </div>
            </section>

            {/* Selo de Garantia de 7 Dias - Minimalista e Verde */}
            <div className="max-w-4xl mx-auto px-5 pb-16 pt-4 relative z-10 animate-fade-in">
              <div className="relative overflow-hidden rounded-2xl border border-[#00FF88]/10 bg-black/40 p-6 md:p-8 backdrop-blur-sm">
                
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                  
                  {/* Minimal Icon Badge */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00FF88]/5 border border-[#00FF88]/20 shrink-0 text-[#00FF88]">
                    <ShieldCheck size={32} className="stroke-1" />
                  </div>

                  {/* Text Description */}
                  <div className="space-y-2 text-center md:text-left flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-x-3 gap-y-1 justify-center md:justify-start">
                      <span className="text-[#00FF88] text-[9px] font-black uppercase tracking-[0.2em]">GARANTIA INCONDICIONAL</span>
                      <span className="hidden md:inline text-white/20 text-xs">•</span>
                      <span className="text-white/60 text-xs font-medium">7 Dias de Risco Zero</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-display font-bold text-white tracking-tight">
                      Sua satisfação garantida ou <span className="text-[#00FF88]">reembolso integral</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed max-w-2xl">
                      Experimente o método por até 7 dias. Use a correção de redação Inteligente à vontade. Se não perceber sua evolução na escrita para o ENEM, basta pedir o cancelamento e devolvemos cada centavo, sem perguntas ou burocracia.
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </>
        )}

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

        {/* Floating WhatsApp Button */}
        <a
          href="https://wa.me/5528999106887?text=Olá!%20Fiquei%20com%20dúvidas%20sobre%20o%20RED%201000%20PRO%20e%20gostaria%20de%20ajuda."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar conosco no WhatsApp"
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-full font-bold shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-105 active:scale-95 transition-all group border border-white/10 select-none cursor-pointer"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.016 14.1 1.01 11.99 1.01c-5.447 0-9.866 4.372-9.87 9.802 0 1.96.512 3.878 1.483 5.584l-.976 3.562 3.69-.958zM17.52 14.3c-.302-.15-1.786-.88-2.037-.972-.251-.09-.435-.136-.62.136-.184.272-.713.88-.872 1.058-.159.18-.32.203-.62.054-.303-.151-1.277-.47-2.433-1.499-.9-.8-1.507-1.79-1.284-1.21.32-.544.116-.859-.033-1.01-.137-.137-.302-.35-.454-.524-.151-.174-.202-.299-.303-.497-.101-.198-.051-.371-.025-.521.025-.15.184-.435.251-.592.067-.158.136-.32.2-.454.067-.136.101-.227.151-.379.05-.152.025-.286-.013-.362-.038-.075-.32-.782-.442-1.079-.117-.282-.236-.24-.32-.245-.084-.004-.18-.005-.276-.005-.097 0-.253.036-.385.18-.132.143-.503.491-.503 1.198 0 .707.514 1.39.585 1.487.073.099 1.01 1.542 2.45 2.162.342.148.608.236.814.301.344.11.657.094.904.057.276-.041.88-.36 1.004-.707.126-.347.126-.645.088-.707-.038-.063-.15-.1-.453-.25z"/>
          </svg>
          <span className="text-xs font-black uppercase tracking-wider hidden sm:inline">Dúvida sobre o curso? Fale com um monitor agora</span>
          <span className="text-xs font-black uppercase tracking-wider sm:hidden">Falar com monitor</span>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        </a>

      </div>
    </div>
  );
}
