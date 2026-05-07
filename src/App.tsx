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
import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Toaster, toast } from 'sonner';
import { supabase, updateSupabaseConfig, getSupabase } from './lib/supabase';
import { correctEssay } from './services/aiService';

// --- CONFIG ---
const KIWIFY_CHECKOUT_URL = "https://pay.kiwify.com.br/AhSL8x0";

// --- DATA: TESTIMONIALS ---
const TESTIMONIALS = [
  { name: "Lucas", age: 17, note: 940, text: "Essa IA é insana. Ela me zoou por repetir palavras, mas foi o que me fez entender onde eu tava errando HAHA!", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas" },
  { name: "Ana Clara", age: 18, note: 920, text: "Eu não saia do 600. Com as fórmulas prontas, meu texto fluiu em 40 minutos.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana" },
  { name: "Rafael", age: 17, note: 900, text: "Paguei R$ 27 e tive mais correção que no cursinho de R$ 600. Custo-benefício imbatível.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafael" }
];

// --- COMPONENTS ---

const Nav = ({ onAction }: { onAction: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 p-6`}>
      <div className={`max-w-7xl mx-auto flex justify-between items-center glass p-4 px-8 rounded-[32px] ${isScrolled ? 'bg-white/10' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-2xl rotate-3 shadow-[0_0_20px_rgba(255,0,102,0.4)]">
            <Trophy className="text-white w-5 h-5" />
          </div>
          <span className="font-display font-black text-2xl tracking-tighter">RED <span className="text-primary italic">1000</span> PRO</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] opacity-60">
          <a href="#features" className="hover:text-primary transition-colors">Método</a>
          <a href="#ia" className="hover:text-primary transition-colors">Malu IA</a>
          <a href="#faq" className="hover:text-primary transition-colors">Dúvidas</a>
        </div>

        <button 
          onClick={onAction}
          className="bg-white text-bg-dark px-8 py-3 rounded-full font-display font-black text-xs uppercase tracking-widest hover:bg-accent transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/5"
        >
          QUERO MEU 1000
        </button>
      </div>
    </nav>
  );
};

const SectionHeader = ({ badge, title, subtitle }: { badge: string, title: string, subtitle?: string }) => (
  <div className="text-center max-w-3xl mx-auto mb-20 px-6">
    <motion.span 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 shadow-xl"
    >
      {badge}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-5xl md:text-7xl font-display font-black mb-8 leading-[0.9] tracking-tighter"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-gray-400 text-xl font-medium leading-relaxed"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const AnimatedCounter = ({ value, duration = 2 }: { value: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const targetStr = value.replace(/[^0-9.]/g, '');
  const target = parseFloat(targetStr) || 0;
  const suffix = value.replace(/[0-9.]/g, '');

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(progress * target);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span>{Math.floor(count).toLocaleString()}{suffix}</span>;
};

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({ d: 45, h: 23, m: 59 });
  
  return (
    <div className="flex gap-4 justify-center">
      {[
        { v: timeLeft.d, l: "Dias", c: "text-primary" },
        { v: timeLeft.h, l: "Hrs", c: "text-secondary" },
        { v: timeLeft.m, l: "Min", c: "text-accent" }
      ].map((time, i) => (
        <div key={i} className="glass w-24 h-24 rounded-[32px] flex flex-col items-center justify-center border-white/5">
          <div className={`text-4xl font-display font-black ${time.c}`}>{time.v}</div>
          <div className="text-[10px] uppercase font-black opacity-30">{time.l}</div>
        </div>
      ))}
    </div>
  );
};

// --- DASHBOARD VIEWS ---

const EbookView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 30;

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-12 items-start mt-12 overflow-visible">
      {/* SIDEBAR NAVIGATION */}
      <div className="glass rounded-[32px] p-6 space-y-2 sticky top-6 hidden lg:block">
        <h3 className="text-xs font-black uppercase tracking-widest opacity-30 px-4 mb-4 font-mono">Guia Emergencial</h3>
        {[
          { p: 1, t: "Págs 1-2: Comece Aqui" },
          { p: 3, t: "Págs 3-5: As 5 Competências" },
          { p: 6, t: "Págs 6-8: Fórmulas de Intro" },
          { p: 9, t: "Págs 9-12: Desenvolvimento" },
          { p: 13, t: "Págs 13-15: Conclusão" },
          { p: 16, t: "Págs 16-18: Repertórios" },
          { p: 19, t: "Págs 19-21: Redações 1000" },
          { p: 22, t: "Págs 22-24: Conectivos" },
          { p: 25, t: "Págs 25-27: Checklist Anti-Erro" },
          { p: 28, t: "Págs 28-30: Plano de Ação" },
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={() => setCurrentPage(item.p)}
            className={`w-full text-left p-3 px-4 rounded-xl text-[10px] font-bold transition-all ${currentPage === item.p ? 'bg-primary text-white scale-105 shadow-lg shadow-primary/20' : 'hover:bg-white/5 opacity-60'}`}
          >
            {item.t}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="glass rounded-[48px] p-8 md:p-16 border-white/5 min-h-[800px] relative">
        <div className="absolute top-8 right-8 text-[10px] font-black uppercase opacity-20 font-mono tracking-widest">
          PÁGINA {currentPage} / {totalPages}
        </div>

        <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {currentPage <= 2 && (
            <>
              <div className="space-y-6">
                <span className="p-2 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg border border-primary/20">📌 INTRODUÇÃO EMERGENCIAL</span>
                <h1 className="text-5xl font-display font-black leading-tight italic">Calma, eu entendo <br/> você.</h1>
                <p className="text-xl text-gray-400 font-medium leading-relaxed">
                  Você está com pressa? Eu também. Por isso, este guia foi feito sem enrolação. Nas próximas 30 páginas, você tem a fórmula exata do 1000.
                </p>
              </div>

              <div className="p-8 glass rounded-[32px] border-primary/20 bg-primary/5">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2 italic">🚀 Mindset Motivacional</h4>
                <p className="text-gray-300 italic leading-relaxed">
                  A redação não é sobre ser um gênio da literatura. É sobre seguir uma técnica. Decore as fórmulas, aplique o checklist e o resultado vem. O 1000 é um processo.
                </p>
              </div>
            </>
          )}

          {currentPage >= 3 && currentPage <= 5 && (
            <>
              <div className="space-y-6">
                <span className="p-2 bg-secondary/10 text-secondary text-[10px] font-black uppercase rounded-lg border border-secondary/20">⚡ DOMINANDO AS REGRAS</span>
                <h2 className="text-4xl font-display font-black italic">As 5 Competências em 3 Páginas</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse glass rounded-3xl overflow-hidden">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="p-6 text-[10px] font-black uppercase opacity-40">Comp.</th>
                      <th className="p-6 text-[10px] font-black uppercase opacity-40">O que é?</th>
                      <th className="p-6 text-[10px] font-black uppercase opacity-40">Como garantir pontos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { c: "C1", n: "Norma culta", d: "Não errar português", g: ["Evite gerúndio", "Revise concordância", "Vírgulas"] },
                      { c: "C2", n: "Tema", d: "Não fugir do assunto", g: ["Leia o tema 3x", "Sublinhe keywords", "Textos motivadores"] },
                      { c: "C3", n: "Argumentar", d: "Defender sua tese", g: ["Tese na intro", "2 argumentos fortes", "Dados/citações"] },
                      { c: "C4", n: "Conectar", d: "Usar conectivos", g: ["Varie conectivos", "Não repita", "Transições suaves"] },
                      { c: "C5", n: "Proposta", d: "Solução completa", g: ["5 elementos", "Direitos humanos", "Específico"] },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="p-6 font-black text-primary">{row.c}</td>
                        <td className="p-6 text-[11px] font-bold">{row.n}<br/><span className="text-[9px] font-medium opacity-40">{row.d}</span></td>
                        <td className="p-6">
                          <div className="space-y-1">
                            {row.g.map((g, j) => <div key={j} className="text-[9px] font-bold flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full" /> {g}</div>)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {currentPage >= 6 && currentPage <= 8 && (
            <>
              <div className="space-y-6">
                <span className="p-2 bg-accent/10 text-accent text-[10px] font-black uppercase rounded-lg border border-accent/20">📌 INTRODUÇÃO</span>
                <h2 className="text-4xl font-display font-black italic">Fórmula da Introdução</h2>
              </div>
              <div className="p-8 glass rounded-3xl border-white/10 space-y-4">
                <div className="text-[10px] font-black uppercase text-primary">Template Mestre</div>
                <p className="text-sm font-medium leading-relaxed italic text-gray-300">
                  "Desde o período colonial, povos indígenas e quilombolas enfrentam processos de marginalização territorial e cultural no Brasil. Atualmente, mesmo com marcos legais de proteção, essas comunidades continuam sofrendo com invasões de terras. Diante desse cenário, é fundamental compreender os desafios estruturais que impedem a plena valorização dessas populações."
                </p>
              </div>
            </>
          )}

          {currentPage >= 22 && currentPage <= 24 && (
            <div className="space-y-10">
              <div className="space-y-6">
                 <span className="p-2 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg border border-primary/20">🔗 CONEXÃO</span>
                 <h2 className="text-4xl font-display font-black italic">Conectivos</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { f: "Adicionar", c: "Além disso, Ademais" },
                   { f: "Contrapor", c: "Entretanto, Todavia" },
                   { f: "Explicar", c: "Haja vista, Pois" },
                   { f: "Concluir", c: "Portanto, Logo" }
                 ].map((item, i) => (
                   <div key={i} className="p-6 glass rounded-2xl space-y-2">
                      <div className="text-primary font-black uppercase text-[9px]">{item.f}</div>
                      <div className="text-xs font-bold">{item.c}</div>
                   </div>
                 ))}
              </div>
            </div>
          )}
        </div>

        {/* NAVIGATION FOOTER */}
        <div className="mt-20 pt-12 border-t border-white/5 flex justify-between items-center">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="p-3 px-6 glass rounded-full font-black text-[10px] uppercase tracking-widest disabled:opacity-20 hover:bg-white/10"
          >
            Anterior
          </button>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="p-3 px-8 bg-primary text-white rounded-full font-black text-[10px] uppercase tracking-widest disabled:opacity-20 hover:scale-105 transition-all shadow-lg shadow-primary/20"
          >
            Próxima Página
          </button>
        </div>
      </div>
    </div>
  );
};

const IaView = () => {
    const [essay, setEssay] = useState("");
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCorrect = async () => {
        if (!essay.trim()) return;
        setLoading(true);
        setResult(null);
        try {
            const feedback = await correctEssay(essay);
            setResult(feedback);
        } catch (e) {
            setResult("Eita! Ocorreu um erro. Tenta de novo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 mt-12 mb-20 pb-20">
            <div className="glass rounded-[64px] border-white/5 p-2 shadow-2xl overflow-hidden">
                <div className="bg-[#0A0A0F] rounded-[62px] min-h-[600px] flex flex-col border border-white/10">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-3xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                                <Sparkles size={24} className="text-white" />
                            </div>
                            <div className="text-left">
                                <div className="text-xs font-black uppercase">Malu AI Corretora</div>
                                <div className="text-[10px] font-mono opacity-30 text-success">ONLINE E PRONTA</div>
                            </div>
                        </div>
                        {result && (
                            <button 
                                onClick={() => {setResult(null); setEssay("");}}
                                className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                            >
                                [ Limpar Tudo ]
                            </button>
                        )}
                    </div>
                    
                    {!result ? (
                        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-8 min-h-[500px]">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-5xl">📄</div>
                            <h3 className="text-3xl font-display font-black italic tracking-tighter">Pronto para a correção?</h3>
                            <p className="text-gray-400 font-medium max-w-sm">Para uma análise precisa, cole seu texto abaixo. A Malu vai ler tudo e te falar a real.</p>
                            
                            <div className="w-full max-w-2xl space-y-4">
                                <textarea 
                                    className="w-full bg-white/5 border border-white/10 rounded-[32px] p-8 text-sm font-medium focus:outline-none focus:border-primary/50 transition-all min-h-[300px] resize-none"
                                    placeholder="Digite ou cole sua redação completa aqui..."
                                    value={essay}
                                    onChange={(e) => setEssay(e.target.value)}
                                />
                                <button 
                                    onClick={handleCorrect}
                                    disabled={loading || !essay.trim()}
                                    className="w-full bg-primary py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ANALISANDO...
                                        </>
                                    ) : "SOLTAR O VEREDITO"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 p-8 md:p-12 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <div className="max-w-2xl mx-auto markdown-body">
                                <Markdown>{result}</Markdown>
                            </div>
                            <div className="mt-12 flex justify-center pb-8">
                                <button 
                                    onClick={() => setResult(null)}
                                    className="p-4 px-10 glass rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/10"
                                >
                                    Fazer Outra Correção
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 opacity-40">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Baseado no Manual do Candidato</span>
                </div>
                <div className="flex items-center gap-2">
                    <Sparkles size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Correção via Gemini 1.5 Flash</span>
                </div>
            </div>
        </div>
    )
}

const RepertoireView = () => {
    const categories = [
        { title: "Desigualdade", icon: "🏛️", reps: ["Parasita", "Carolina M. Jesus"] },
        { title: "Educação", icon: "📚", reps: ["Paulo Freire", "I. Kant"] },
        { title: "Tecnologia", icon: "📱", reps: ["Z. Bauman", "LGPD"] },
        { title: "Saúde Mental", icon: "🧠", reps: ["O Coringa", "OMS"] },
    ]

    return (
        <div className="space-y-12 mt-12 mb-20">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {categories.map((cat, i) => (
                    <div key={i} className="bento-card space-y-6 group">
                        <div className="text-4xl p-4 glass rounded-2xl w-fit group-hover:scale-110 transition-all">{cat.icon}</div>
                        <h3 className="text-xl font-display font-black leading-tight italic tracking-tighter">{cat.title}</h3>
                        <div className="space-y-3">
                            {cat.reps.map((r, j) => (
                                <div key={j} className="text-[10px] font-bold text-gray-500 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
                                    {r}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}


// --- REDIRECT VIEW ---
const SuccessRedirect = ({ email }: { email: string }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const url = new URL(KIWIFY_CHECKOUT_URL);
      url.searchParams.append('email', email);
      window.location.href = url.toString();
    }, 3000);
    return () => clearTimeout(timer);
  }, [email]);

  return (
    <div className="fixed inset-0 z-[200] bg-bg-dark flex items-center justify-center p-6 selection:bg-primary/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[160px] rounded-full animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-10 relative z-10"
      >
        <div className="relative mx-auto w-32 h-32">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="w-full h-full bg-gradient-to-tr from-primary to-secondary rounded-[40px] flex items-center justify-center shadow-[0_20px_50px_rgba(255,0,102,0.4)] rotate-6"
          >
            <CheckCircle2 size={64} className="text-white" />
          </motion.div>
          <div className="absolute -top-4 -right-4 bg-white text-bg-dark p-2 rounded-xl shadow-xl animate-bounce">
            <Sparkles size={20} className="text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-5xl font-display font-black italic tracking-tighter leading-tight">
            CONTA CRIADA <br/>
            <span className="text-gradient">COM SUCESSO!</span>
          </h2>
          <p className="text-gray-400 text-lg font-medium">
            Sua vaga na elite está garantida. <br/>
            <span className="text-white">Você será redirecionado para finalizar sua assinatura...</span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="w-full h-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
            <RefreshCw className="animate-spin" size={12} /> Preparando Checkout Seguro
          </div>
        </div>
      </motion.div>
    </div>
  );
};


// --- OFFER VIEW ---
const BenefitsOffer = ({ user, onLogout, manualVerify, isVerifying }: { user: any, onLogout: () => void, manualVerify: () => void, isVerifying: boolean }) => {
  const benefits = [
    { 
      icon: <Sparkles className="text-primary" />, 
      title: "Malu IA Corretora", 
      desc: "Feedback instantâneo seguindo as 5 competências do ENEM." 
    },
    { 
      icon: <BookOpen className="text-secondary" />, 
      title: "Guia Emergencial", 
      desc: "O atalho de 30 páginas com as fórmulas prontas para o 1000." 
    },
    { 
      icon: <Trophy className="text-accent" />, 
      title: "Repertórios Curinga", 
      desc: "Citações e argumentos que encaixam em qualquer tema." 
    },
    { 
      icon: <CheckCircle2 className="text-success" />, 
      title: "Redações Comentadas", 
      desc: "Exemplos de nota 1000 analisados linha por linha." 
    }
  ];

  const goToCheckout = () => {
    const url = new URL(KIWIFY_CHECKOUT_URL);
    url.searchParams.append('email', user.email);
    window.location.href = url.toString();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-bg-dark overflow-y-auto selection:bg-primary/30">
      <div className="min-h-screen flex flex-col items-center justify-center p-6 py-20 relative">
        {/* BG EFFECTS */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-secondary blur-[120px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full space-y-12 relative z-10"
        >
          {/* HEADER */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              <Zap size={12} /> Conta Criada com Sucesso
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black leading-[0.9] tracking-tighter italic">
              BEM-VINDO À ELITE, <br/>
              <span className="text-gradient">FUTURO NOTA 1000!</span>
            </h1>
            <p className="text-gray-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Você está a um passo de desbloquear o arsenal completo que vai transformar sua redação em tempo recorde.
            </p>
          </div>

          {/* BENEFITS GRID */}
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="glass p-8 rounded-[32px] border-white/5 flex gap-6 items-start hover:border-primary/20 transition-all group"
              >
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {b.icon}
                </div>
                <div>
                  <h3 className="text-xl font-display font-black mb-1 italic tracking-tight">{b.title}</h3>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA BOX */}
          <div className="glass p-10 md:p-16 rounded-[48px] border-primary/20 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/5 text-center space-y-10">
            <div className="space-y-4">
              <div className="text-2xl font-display font-medium line-through opacity-20">R$ 197,00</div>
              <div className="text-7xl md:text-8xl font-display font-black tracking-tighter">R$ 27,90</div>
              <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Acesso Vitalício • Pagamento Único</p>
            </div>

            <div className="space-y-6 max-w-md mx-auto">
              <button 
                onClick={goToCheckout}
                className="w-full bg-primary text-white py-8 rounded-[32px] text-2xl font-display font-black hover:scale-105 active:scale-95 transition-all shadow-[0_20px_60px_rgba(255,0,102,0.4)] flex items-center justify-center gap-4 group"
              >
                DESBLOQUEAR TUDO <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={manualVerify}
                  disabled={isVerifying}
                  className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 flex items-center justify-center gap-2"
                >
                  {isVerifying ? <RefreshCw className="animate-spin" size={12} /> : <RefreshCw size={12} />}
                  Já comprei, verificar meu e-mail
                </button>
                <button onClick={onLogout} className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">
                  Sair da conta
                </button>
              </div>
            </div>

            <div className="pt-10 border-t border-white/5 grid grid-cols-3 gap-4 opacity-30 text-[9px] font-black uppercase tracking-widest mt-12">
              <div className="flex flex-col items-center gap-2">
                <ShieldCheck size={16} />
                <span>Compra Segura</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Clock size={16} />
                <span>Liberação Imediata</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Trophy size={16} />
                <span>Garantia 7 Dias</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// --- AUTH VIEWS ---
const AuthScreen = ({ mode, onClose, setMode }: { mode: 'login' | 'signup', onClose: () => void, setMode: (m: 'login' | 'signup') => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for Supabase configuration
    const config = (window as any).__SUPABASE_DYNAMIC_CONFIG__ || {
      url: import.meta.env.VITE_SUPABASE_URL,
      key: import.meta.env.VITE_SUPABASE_ANON_KEY
    };
    const url = config.url || "";
    const key = config.key || "";
    
    const isUrlMissing = !url || url.includes("missing-url") || !url.startsWith('http');
    const isKeyMissing = !key || key.length < 20;
    const isPlaceholder = url.includes("your-project-id") || key.includes("your-anon-public-key");

    if (isUrlMissing || isKeyMissing || isPlaceholder) {
      if (isPlaceholder) {
        toast.error("Você está usando chaves de exemplo!", {
          description: "Substitua os valores 'your-project-id' e 'your-anon-public-key' no seu .env ou nas Settings pelas suas chaves REAIS do dashboard do Supabase."
        });
      } else {
        const missingVars = [];
        if (isUrlMissing) missingVars.push("VITE_SUPABASE_URL");
        if (isKeyMissing) missingVars.push("VITE_SUPABASE_ANON_KEY");

        toast.error("Configuração do Supabase incompleta", {
          description: `Variáveis faltando: ${missingVars.join(" e ")}. Configure no seu .env ou nas Settings do projeto.`
        });
      }
      setAuthLoading(false);
      return;
    }

    setAuthLoading(true);
    const client = getSupabase();
    
    // Limpar e-mail e senha de espaços em branco acidentais
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    try {
      if (mode === 'signup') {
        const { data, error } = await client.auth.signUp({ 
          email: cleanEmail, 
          password: cleanPassword,
          options: { emailRedirectTo: window.location.origin }
        });
        
        if (error) {
          // Se o erro for rate limit, damos uma explicação amigável
          if (error.message?.includes("rate limit exceeded")) {
             toast.error("Limite de segurança atingido", {
               description: "O Supabase bloqueou novos cadastros temporariamente para evitar spam. Por favor, aguarde de 15 a 30 minutos e tente novamente com este mesmo e-mail."
             });
             return;
          }
          throw error;
        }

        // Se o Supabase retornar uma sessão imediatamente (confirmação desativada), logamos o usuário
        if (data?.session) {
          setShowSuccess(true);
        } else {
          setShowSuccess(true); // Mostramos sucesso para o redirecionamento mesmo sem sessão imediata
        }
      } else {
        const { error } = await client.auth.signInWithPassword({ 
          email: cleanEmail, 
          password: cleanPassword 
        });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        onClose();
      }
    } catch (err: any) {
      console.error("Auth process error detail:", {
        message: err.message,
        name: err.name,
        stack: err.stack,
        clientUrl: (client as any).supabaseUrl
      });
      
      if (err.message?.includes("Invalid path")) {
        toast.error("Erro de configuração no Supabase", {
          description: "O endereço (URL) do Supabase parece estar incorreto ou mal formatado. Verifique se ele termina em .supabase.co e não possui caminhos extras."
        });
      } else if (err.message === "Failed to fetch") {
        toast.error("Erro de conexão (Failed to fetch). Verifique se o seu projeto Supabase não está pausado e se sua internet permite conexões externas.");
        console.error("Connectivity issue with Supabase. Active Client URL:", (client as any).supabaseUrl);
      } else if (err.message?.includes("Invalid login credentials")) {
        toast.error("E-mail ou senha incorretos.");
      } else if (err.message?.includes("Email address") && err.message?.includes("invalid")) {
        toast.error("O formato do e-mail é inválido. Verifique se digitou corretamente.");
      } else if (err.message?.includes("rate limit exceeded")) {
        toast.error("Limite de segurança atingido", {
          description: "O Supabase bloqueou novos e-mails temporariamente para evitar spam. Por favor, aguarde cerca de 15 minutos e tente novamente."
        });
      } else {
        toast.error(err.message || "Erro no processo de autenticação");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  if (showSuccess) {
    return <SuccessRedirect email={email} />;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg-dark/95 backdrop-blur-xl transition-all">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass w-full max-w-md p-10 py-16 rounded-[48px] border-white/5 relative shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-8 right-8 opacity-40 hover:opacity-100 transition-opacity">
          <X size={24} />
        </button>

        <div className="text-center mb-10">
          <div className="bg-primary w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-[0_0_20px_rgba(255,0,102,0.4)]">
            <Lock className="text-white" size={24} />
          </div>
          <h2 className="text-4xl font-display font-black italic tracking-tighter mb-2">
            {mode === 'signup' ? 'Nova Conta' : 'Área do Aluno'}
          </h2>
          <p className="text-sm text-gray-400 font-medium">{mode === 'signup' ? 'Junte-se à elite da Redação 1000' : 'Entre para continuar seus estudos'}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4 font-mono">E-mail</label>
            <input 
              required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:outline-none focus:border-primary/50 font-bold text-sm transition-all"
              placeholder="seu@email.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4 font-mono">Senha</label>
            <input 
              required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:outline-none focus:border-primary/50 font-bold text-sm transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            disabled={authLoading}
            className="w-full bg-primary py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 mt-4"
          >
            {authLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : mode === 'signup' ? 'CRIAR MINHA CONTA' : 'ACESSAR AGORA'}
          </button>
        </form>

        <div className="mt-8 text-center pt-8 border-t border-white/5">
          <button 
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-[11px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity hover:text-primary"
          >
            {mode === 'login' ? 'Ainda não tem conta? Clique aqui' : 'Já sou aluno, fazer login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{ status: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'ebook' | 'ia' | 'repertorios'>('overview');
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

  const isPaid = profile?.status === 'paid';

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

  // Auto-verify every 10 seconds if on pending screen
  useEffect(() => {
    let interval: number;
    if (user && !isPaid) {
      interval = window.setInterval(() => {
        checkPaymentStatus(user.email);
      }, 10000);
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
        <Toaster position="bottom-right" invert />
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

        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <>
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mb-12"
                >
                  <h1 className="text-5xl md:text-7xl font-display font-black mb-4 tracking-tighter">BORA PRO <span className="text-gradient italic">MIL?</span> 🚀</h1>
                  <p className="text-gray-400 font-medium">Seu acesso completo está disponível. Por onde vamos começar hoje?</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                    className="bento-card bg-primary/5 border-primary/20 flex flex-col justify-between group"
                  >
                      <BookOpen size={48} className="text-primary mb-12 group-hover:scale-110 transition-transform" />
                      <div>
                        <h3 className="text-2xl font-display font-black mb-2 italic">Ebook Emergencial</h3>
                        <p className="text-sm text-gray-400 mb-6 font-medium">O manual exato de 30 páginas para salvar sua nota.</p>
                        <button onClick={() => setActiveTab('ebook')} className="w-full bg-primary py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">ESTUDAR AGORA</button>
                      </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    className="bento-card bg-secondary/5 border-secondary/20 flex flex-col justify-between group"
                  >
                      <MessageSquare size={48} className="text-secondary mb-12 group-hover:scale-110 transition-transform" />
                      <div>
                        <h3 className="text-2xl font-display font-black mb-2 italic">Malu IA Corretora</h3>
                        <p className="text-sm text-gray-400 mb-6 font-medium">Envie sua redação e receba os pontos de melhoria.</p>
                        <button onClick={() => setActiveTab('ia')} className="w-full bg-secondary py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-secondary/20 transition-all hover:scale-105 active:scale-95">CORRIGIR AGORA</button>
                      </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                    className="bento-card bg-accent/5 border-accent/20 flex flex-col justify-between group"
                  >
                      <Trophy size={48} className="text-accent mb-12 group-hover:scale-110 transition-transform" />
                      <div>
                        <h3 className="text-2xl font-display font-black mb-2 italic">Repertórios Curinga</h3>
                        <p className="text-sm text-gray-400 mb-6 font-medium">Banco completo de citações que cabem em tudo.</p>
                        <button onClick={() => setActiveTab('repertorios')} className="w-full bg-accent text-bg-dark py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-95">VER REPERTÓRIOS</button>
                      </div>
                  </motion.div>
                </div>

                <div className="mt-12 p-8 glass border-white/5 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                        <ShieldCheck size={32} className="text-success shadow-[0_0_20px_rgba(0,255,153,0.3)]" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold italic tracking-tighter">Precisa de ajuda urgente?</h4>
                        <p className="text-sm text-gray-400">Suporte prioritário via WhatsApp disponível.</p>
                      </div>
                  </div>
                  <button className="px-10 py-4 glass rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all border-white/10">CHAMAR NO WHATSAPP</button>
                </div>
              </>
            )}

            {activeTab === 'ebook' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <EbookView />
              </motion.div>
            )}
            {activeTab === 'ia' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <IaView />
              </motion.div>
            )}
            {activeTab === 'repertorios' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <RepertoireView />
              </motion.div>
            )}
          </div>
        </main>
      </div>
    );
  }

  const handleCTA = () => {
    if (user) {
      if (isPaid) setActiveTab('overview');
      else {
        const url = new URL(KIWIFY_CHECKOUT_URL);
        url.searchParams.append('email', user.email);
        window.location.href = url.toString();
      }
    } else {
      setShowAuth('signup');
    }
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
      <Nav onAction={handleCTA} />
      
      <AnimatePresence>
        {showAuth && (
          <AuthScreen 
            mode={showAuth} 
            onClose={() => setShowAuth(null)} 
            setMode={(m) => setShowAuth(m)}
          />
        )}
        {user && !isPaid && (
          <BenefitsOffer 
            user={user} 
            onLogout={handleLogout} 
            manualVerify={manualVerify} 
            isVerifying={isVerifying} 
          />
        )}
      </AnimatePresence>
      
      {/* GLOWS */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 blur-[180px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* HERO SECTION */}
      <section className="pt-48 pb-32 px-6">
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
              <span className="text-xs font-black uppercase tracking-[0.2em] italic">🔥 Já somos +500 rumo ao 1000</span>
            </div>
            
            <h1 className="text-7xl md:text-[100px] font-display font-black leading-[0.85] mb-12 tracking-tighter">
              Seu ENEM <br/>
              <span className="text-gradient">sem drama.</span>
            </h1>
            
            <p className="text-2xl text-gray-400 mb-16 leading-relaxed font-medium max-w-lg">
              Domine a estrutura exata da Redação Nota 1000 com fórmulas prontas e uma IA que te corrige na hora.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <button 
                onClick={handleCTA}
                className="w-full sm:w-auto bg-primary text-white p-8 px-14 rounded-[40px] text-2xl font-display font-black flex items-center justify-center gap-4 hover:scale-110 hover:shadow-[0_30px_60px_rgba(255,0,102,0.4)] transition-all active:scale-95 group"
              >
                COMEÇAR AGORA <ArrowRight className="group-hover:translate-x-2 transition-transform" size={28} />
              </button>
              
              <div className="flex flex-col gap-2 items-center sm:items-start group">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-accent text-accent" />)}
                </div>
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Pagamento Único • R$ 27,90</div>
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

      {/* STATS */}
      <section className="py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-16 text-center">
          {[
            { v: "500+", l: "Alunos Pro" },
            { v: "12,847", l: "Redações lidas" },
            { v: "4.8/5", l: "Voto da Galera" }
          ].map((s, i) => (
            <div key={i}>
              <div className="text-6xl font-display font-black text-gradient block mb-2">
                <AnimatedCounter value={s.v} />
              </div>
              <div className="text-[11px] font-black uppercase tracking-[0.3em] opacity-30">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* THE BENTO SECTION */}
      <section id="features" className="py-32 px-6">
         <SectionHeader 
           badge="⚡ TUDO INCLUSO" 
           title="O Arsenal que você recebe agora" 
           subtitle="Tudo pensado para quem não tem tempo a perder e quer resultados imediatos."
         />
         
         <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8">
            <div className="md:col-span-8 bento-card flex flex-col justify-end bg-gradient-to-br from-primary/10 to-transparent min-h-[400px]">
               <div className="flex-1 flex items-center justify-center text-9xl">🤖</div>
               <div>
                 <h3 className="text-3xl font-display font-black mb-4">Correção Ilimitada (Malu IA)</h3>
                 <p className="text-gray-400 font-medium text-lg leading-relaxed">Nossa IA treinada nos critérios do ENEM te dá feedback em segundos. Sem espera por corretor humano.</p>
               </div>
            </div>
            
            <div className="md:col-span-4 bento-card flex flex-col justify-between">
               <div className="text-6xl">📘</div>
               <div>
                  <h3 className="text-2xl font-display font-black mb-3">Guia Emergencial</h3>
                  <p className="text-sm text-gray-400">30 páginas de puro hack. Fórmulas prontas de intro, des e conclusão.</p>
               </div>
            </div>

            <div className="md:col-span-4 bento-card flex flex-col justify-between">
               <div className="text-6xl">🎬</div>
               <div>
                  <h3 className="text-2xl font-display font-black mb-3">30+ Repertórios</h3>
                  <p className="text-sm text-gray-400">Filmes, séries e filósofos que encaixam em QUALQUER tema.</p>
               </div>
            </div>

            <div className="md:col-span-8 bento-card bg-secondary/5 border-secondary/20 flex flex-col md:flex-row items-center gap-10">
               <div className="text-8xl">💯</div>
               <div>
                  <h3 className="text-3xl font-display font-black mb-4">Redações Nota 1000 Comentadas</h3>
                  <p className="text-gray-400 font-medium leading-relaxed">Analise o sucesso de outros alunos linha por linha e copie o que funciona.</p>
               </div>
            </div>
         </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-48 px-6 relative">
         <div className="absolute top-0 left-1/2 -track-x-1/2 w-px h-48 bg-gradient-to-b from-transparent to-primary" />
         
         <div className="max-w-4xl mx-auto bento-card text-center p-16 md:p-32 border-primary/20 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10">
            <div className="mb-12">
               <p className="text-primary font-black uppercase tracking-[0.4em] mb-8 italic">O ENEM NÃO ESPERA</p>
               <Countdown />
            </div>
            
            <h2 className="text-7xl md:text-8xl font-display font-black mb-12 tracking-tighter leading-[0.8] italic">TÁ ESPERANDO <br/> <span className="text-gradient">O QUÊ?</span></h2>
            
            <div className="mb-16">
               <p className="text-2xl font-display font-medium line-through opacity-20 mb-2">R$ 197,00</p>
               <p className="text-7xl font-display font-black">R$ 27,90</p>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mt-4 underline decoration-primary underline-offset-8">Pagamento Único • Acesso na Hora</p>
            </div>

            <div className="max-w-md mx-auto mb-10 pt-8">
              <button 
                onClick={handleCTA}
                className="w-full bg-primary text-white py-10 rounded-[48px] text-3xl font-display font-black hover:scale-105 active:scale-95 transition-all shadow-[0_30px_100px_rgba(255,0,102,0.3)] group flex items-center justify-center gap-4"
              >
                QUERO MEU 1000 AGORA! <ArrowRight className="group-hover:translate-x-2 transition-transform" size={32} />
              </button>
            </div>
            
            <div className="mt-16 flex justify-center gap-10 opacity-30 text-[10px] font-black uppercase tracking-[0.3em]">
               <span>● Hotmart / Kiwify</span>
               <span>● Seguro</span>
               <span>● Garantia 7 Dias</span>
            </div>
         </div>
      </section>

            {/* FAQ */}
            <section id="faq" className="mt-40">
              <SectionHeader badge="Dúvidas comuns" title="Ficou alguma dúvida?" />
              <div className="max-w-4xl mx-auto space-y-4">
                {[
                  { q: "Como meu acesso é liberado?", a: "Usamos tecnologia de Webhook oficial. Assim que a Kiwify confirma o pagamento, seu acesso é liberado instantaneamente. Basta fazer login com o e-mail usado na compra e pronto, o Dashboard estará desbloqueado." },
                  { q: "A IA realmente corrige bem?", a: "Sim! A Malu foi treinada com o banco de dados oficial do INEP para identificar as 5 competências. Ela não substitui um professor, mas te dá feedback 24h por dia para você treinar exaustivamente." }
                ].map((faq, i) => (
                  <div key={i} className="glass p-8 rounded-[32px] border-white/5">
                    <h4 className="text-xl font-bold mb-4 flex items-center gap-3">
                       <Lightbulb className="text-accent" size={20} />
                       {faq.q}
                    </h4>
                    <p className="text-gray-400 font-medium leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

      <footer className="mt-40 py-24 px-12 border-t border-white/5 opacity-50">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-2">
               <Trophy size={20} className="text-primary" />
               <span className="font-display font-black text-xl tracking-tighter uppercase">RED 1000 PRO</span>
            </div>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-gray-500">
               <span>© 2024 • MatheuS 1000 PRO</span>
               <a href="#" className="text-primary hover:underline">contato@redacao1000pro.com</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
