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
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

// --- CONFIG ---
const KIWIFY_CHECKOUT_URL = "https://pay.kiwify.com.br/AhSL8x0";

// --- DATA: TESTIMONIALS ---
const TESTIMONIALS = [
  { name: "Lucas", age: 17, note: 940, text: "Essa IA é insana. Ela me zoou por repetir palavras, mas foi o que me fez entender onde eu tava errando HAHA!", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas" },
  { name: "Ana Clara", age: 18, note: 920, text: "Eu não saia do 600. Com as fórmulas prontas, meu texto fluiu em 40 minutos.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana" },
  { name: "Rafael", age: 17, note: 900, text: "Paguei R$ 49 e tive mais correção que no cursinho de R$ 600. Custo-benefício imbatível.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafael" }
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
    return (
        <div className="max-w-4xl mx-auto space-y-12 mt-12 mb-20">
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
                    </div>
                    
                    <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-8">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-5xl">📄</div>
                        <h3 className="text-3xl font-display font-black italic tracking-tighter">Pronto para a correção?</h3>
                        <p className="text-gray-400 font-medium max-w-sm">Para uma análise precisa, cole seu texto aqui ou anexe uma foto legível da sua folha de redação.</p>
                        
                        <div className="w-full max-w-xl p-2 glass rounded-[32px] border-white/5 flex gap-2">
                            <input className="flex-1 bg-transparent p-4 text-xs font-bold focus:outline-none placeholder:opacity-30" placeholder="Escreva ou cole seu texto..." />
                            <button className="bg-primary px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-105">Corrigir</button>
                        </div>
                    </div>
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

export default function App() {
  const [isPaid, setIsPaid] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [email, setEmail] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'ebook' | 'ia' | 'repertorios'>('overview');

  // Poll for payment status if email is set
  useEffect(() => {
    let interval: number;
    if (email && !isPaid) {
      interval = window.setInterval(async () => {
        try {
          const res = await fetch(`/api/check-payment?email=${encodeURIComponent(email)}`);
          const data = await res.json();
          if (data.isPaid) {
            setIsPaid(true);
            setShowWelcome(true);
            setIsChecking(false);
          }
        } catch (e) {
          console.error("Error checking payment:", e);
        }
      }, 3000); // Check every 3 seconds
    }
    return () => clearInterval(interval);
  }, [email, isPaid]);

  const handleCheckout = () => {
    if (!email) {
      alert("Por favor, digite seu e-mail para continuar para o checkout.");
      const emailInput = document.getElementById('email-input');
      emailInput?.scrollIntoView({ behavior: 'smooth' });
      emailInput?.focus();
      return;
    }
    
    // REDIRECIONAMENTO IMEDIATO PARA KIWIFY
    setIsChecking(true);
    
    // Concatenando e-mail para facilitar o preenchimento no checkout
    const url = new URL(KIWIFY_CHECKOUT_URL);
    url.searchParams.append('email', email);
    
    window.location.href = url.toString();
  };

  const simulateWebhook = async () => {
    if (!email) return alert("Digite um email primeiro!");
    try {
      await fetch('/api/kiwify-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_status: 'paid',
          customer: { email }
        })
      });
      alert("Webhook simulado enviado! O acesso será liberado em instantes...");
    } catch (e) {
      alert("Erro ao simular webhook");
    }
  };

  if (isPaid && showWelcome) {
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col selection:bg-primary/30">
        {/* DASHBOARD NAVBAR */}
        <nav className="p-6 border-b border-white/5 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
             <button onClick={() => setActiveTab('overview')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Trophy className="text-primary w-6 h-6 shadow-[0_0_20px_rgba(255,0,102,0.5)]" />
                <span className="font-display font-black text-xl tracking-tighter uppercase">Área do <span className="text-primary italic">Aluno</span></span>
             </button>
             <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                   <div className="text-[10px] font-black uppercase opacity-40">Estudante Logado</div>
                   <div className="text-xs font-bold text-gradient">{email}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-black">
                   <User size={18} />
                </div>
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

  return (
    <div className="relative overflow-hidden">
      <Nav onAction={handleCheckout} />
      
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
                onClick={handleCheckout}
                disabled={isChecking}
                className="w-full sm:w-auto bg-primary text-white p-8 px-14 rounded-[40px] text-2xl font-display font-black flex items-center justify-center gap-4 hover:scale-110 hover:shadow-[0_30px_60px_rgba(255,0,102,0.4)] transition-all active:scale-95 group disabled:opacity-50"
              >
                {isChecking ? "CARREGANDO..." : "COMEÇAR AGORA"} <ArrowRight className="group-hover:translate-x-2 transition-transform" size={28} />
              </button>
              
              <div className="flex flex-col gap-2 items-center sm:items-start group">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-accent text-accent" />)}
                </div>
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Pagamento Único • R$ 49,90</div>
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
               <p className="text-7xl font-display font-black">R$ 49,90</p>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mt-4 underline decoration-primary underline-offset-8">Pagamento Único • Acesso na Hora</p>
            </div>

            <div className="max-w-md mx-auto mb-10 space-y-4">
              <div className="relative group">
                <div className="absolute inset-x-0 bottom-0 h-px bg-white/10 group-focus-within:bg-primary transition-colors" />
                <input 
                  id="email-input"
                  type="email" 
                  placeholder="Seu melhor e-mail..." 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent p-6 text-center text-xl font-display font-black placeholder:opacity-20 focus:outline-none"
                />
              </div>
              {isChecking && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-black uppercase tracking-widest text-primary animate-pulse"
                >
                  ⌛ Aguardando confirmação do pagamento...
                </motion.div>
              )}
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isChecking}
              className="w-full bg-white text-bg-dark py-10 rounded-[48px] text-3xl font-display font-black hover:scale-105 active:scale-95 transition-all shadow-[0_30px_100px_rgba(255,255,255,0.15)] mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChecking ? "REDIRECIONANDO..." : "GARANTE MEU 1000 AGORA!"}
            </button>

            {/* DEV ONLY: SIMULAÇÃO */}
            <div className="mt-4 p-4 border border-dashed border-white/10 rounded-2xl">
               <p className="text-[9px] font-black uppercase opacity-30 mb-2 tracking-widest">Área do Desenvolvedor (Simulação)</p>
               <button 
                 onClick={simulateWebhook}
                 className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-100 opacity-60 transition-opacity"
               >
                 [ CLIQUE AQUI PARA SIMULAR WEBHOOK DA KIWIFY ]
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
                  { q: "Como meu acesso é liberado?", a: "Usamos tecnologia de Webhook. Assim que a Kiwify confirma o pagamento, nosso servidor libera seu e-mail automaticamente. Se você estiver com a página aberta, ela atualiza sozinha em segundos." },
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
