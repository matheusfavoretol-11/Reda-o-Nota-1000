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
  { 
    name: "João Silva", 
    age: 18, 
    note: 950, 
    text: "Entrei com nota 650 e saí com 950. Consegui bolsa integral na USP! O método de estruturas prontas salvou meu tempo.", 
    before: 650, 
    after: 950,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao" 
  },
  { 
    name: "Maria Eduarda", 
    age: 17, 
    note: 980, 
    text: "Eu simplesmente travava na introdução. Com as fórmulas 'copy-paste', minha redação fluiu em menos de 40 minutos.", 
    before: 580, 
    after: 980,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" 
  },
  { 
    name: "Pedro Santos", 
    age: 19, 
    note: 920, 
    text: "Paguei R$ 29 e tive mais correção que no cursinho presencial. A Malu IA não deixa passar nenhum erro de coesão.", 
    before: 700, 
    after: 920,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro" 
  }
];

const VALUE_PROPS = [
  { icon: "🤖", title: "CORRETOR COM IA INTEGRADA", desc: "Envie sua redação e receba feedback em 2 minutos.", sub: "Identifica erros de estrutura, coesão e gramática" },
  { icon: "✍️", title: "100 REDAÇÕES NOTA 1000", desc: "Modelos dos anos 2023-2024 analisados linha por linha.", sub: "Aprenda com quem já chegou no topo" },
  { icon: "🎯", title: "ESTRUTURAS PRONTAS", desc: "Planilha com 5 modelos 'copy-paste' para qualquer tema.", sub: "Introdução, Desenvolvimento e Conclusão completas" },
  { icon: "🎁", title: "BÔNUS: GUIA DE REPERTÓRIOS", desc: "Citações e séries curingas que cabem em tudo.", sub: "Filosofia, Sociologia e Cultura Pop" },
  { icon: "🕒", title: "ACESSO VITALÍCIO", desc: "Pague uma vez e estude para sempre, sem mensalidade.", sub: "Atualizações inclusas todo ano" }
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
              <div className="text-7xl md:text-8xl font-display font-black tracking-tighter">R$ 29,90</div>
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
                <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary animate-pulse mb-2">
                   <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                   Sincronizando com banco de dados...
                </div>
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
    setAuthLoading(true);

    let url = "";
    let key = "";

    // Prioridade total: Tentar pegar do servidor para garantir chaves reais
    try {
      const response = await fetch('/api/config/supabase');
      const data = await response.json();
      if (data.url && data.key && !data.url.includes("your-project-id")) {
        url = data.url;
        key = data.key;
        updateSupabaseConfig(url, key);
        console.log("✅ Configuração Supabase carregada do servidor.");
      }
    } catch (err) {
      console.warn("⚠️ Falha ao buscar config do servidor, tentando local:", err);
    }

    // Fallback para build-time ou global
    if (!url) {
      url = (window as any).__SUPABASE_DYNAMIC_CONFIG__?.url || import.meta.env.VITE_SUPABASE_URL || "";
      key = (window as any).__SUPABASE_DYNAMIC_CONFIG__?.key || import.meta.env.VITE_SUPABASE_ANON_KEY || "";
    }
    
    // Validação permissiva
    const isUrlMissing = !url || url.length < 10 || !url.startsWith('http');
    const isKeyMissing = !key || key.length < 20;
    const isPlaceholder = url.includes("your-project-id") || key.includes("your-anon-public-key");

    if (isUrlMissing || isKeyMissing || isPlaceholder) {
      console.error("❌ Falha na validação das chaves:", { url: url ? "PRESENTE" : "MISSING", key: key ? "PRESENTE" : "MISSING" });
      toast.error("Configuração do Banco de Dados não detectada", {
        description: "Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no menu 'Settings' -> 'Environment Variables' e reinicie o app."
      });
      setAuthLoading(false);
      return;
    }

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
              <span className="text-xs font-black uppercase tracking-[0.2em] italic">🔥 Já somos +500 alunos rumo ao 1000</span>
            </div>
            
            <h1 className="text-6xl md:text-[86px] font-display font-black leading-[0.85] mb-12 tracking-tighter">
              A Redação do <br/>
              <span className="text-gradient">ENEM sem drama.</span>
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
              
              <div className="flex flex-col gap-2 items-center sm:items-start group">
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

      {/* STATS */}
      <section className="py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-16 text-center">
          {[
            { v: "500+", l: "Alunos Pro" },
            { v: "12.847", l: "Redações lidas" },
            { v: "4.9/5", l: "Voto da Galera" }
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
           badge="⚡ O ARSENAL DO 1000" 
           title="Tudo o que você desbloqueia hoje" 
           subtitle="Chega de perder tempo com teoria chata. O curso é focado em prática e resultado imediato."
         />
         
         <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8">
            <div className="md:col-span-8 bento-card flex flex-col justify-end bg-gradient-to-br from-primary/10 to-transparent min-h-[450px] relative overflow-hidden group">
               <div className="absolute top-10 right-10 text-[180px] opacity-10 group-hover:scale-110 transition-transform duration-700">🤖</div>
               <div className="relative z-10">
                  <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase rounded-lg border border-primary/20 mb-6 inline-block">INTELIGÊNCIA ARTIFICIAL</span>
                  <h3 className="text-4xl font-display font-black mb-4 italic">Corretor com IA Integrada</h3>
                  <p className="text-gray-400 font-medium text-xl leading-relaxed max-w-xl">
                    Envie sua redação e receba feedback automático em 2 minutos. Identifica falhas na estrutura, argumentação, coesão e gramática.
                  </p>
               </div>
            </div>
            
            <div className="md:col-span-4 bento-card flex flex-col justify-between group">
               <div className="text-6xl group-hover:scale-125 transition-transform">📚</div>
               <div>
                  <h3 className="text-2xl font-display font-black mb-3 italic">100 Redações Perfeitas</h3>
                  <p className="text-sm text-gray-400">Estude redações nota 950-1000 do ENEM 2023-2024. Cada uma com análise completa.</p>
               </div>
            </div>

            <div className="md:col-span-12 bento-card flex flex-col justify-center bg-secondary/5 border-secondary/20 min-h-[250px] group text-center relative overflow-hidden">
               <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-[150px] opacity-5 group-hover:scale-110 transition-transform">🎯</div>
               <div className="relative z-10 max-w-2xl mx-auto">
                  <div className="text-6xl mb-6 group-hover:rotate-12 transition-transform inline-block">🎯</div>
                  <h3 className="text-4xl font-display font-black mb-4 italic">Estruturas que Funcionam</h3>
                  <p className="text-gray-400 font-medium text-lg leading-relaxed">Planilha 'copy-paste' com 5 estruturas validadas para qualquer tema do ENEM. Do 0 ao 950+ sem complicação.</p>
               </div>
            </div>
         </div>
      </section>

      {/* VALUE PROPOSITION GRID */}
      <section className="py-32 px-6 bg-white/[0.01]">
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

      {/* TESTIMONIALS SECTION */}
      <section className="py-32 px-6">
         <SectionHeader 
           badge="SÓ RESULTADO REAL" 
           title="O que dizem os futuros aprovados" 
         />
         
         <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 className="glass p-10 rounded-[48px] border-white/5 flex flex-col justify-between"
               >
                 <div className="space-y-6">
                    <div className="flex gap-1">
                       {[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-accent text-accent" />)}
                    </div>
                    <p className="text-gray-300 font-medium text-lg leading-relaxed italic">"{t.text}"</p>
                 </div>
                 
                 <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <img src={t.avatar} className="w-12 h-12 rounded-2xl bg-white/5" />
                       <div className="text-left">
                          <div className="text-sm font-black uppercase italic">{t.name}</div>
                          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Aluno Pro</div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-[9px] font-black uppercase opacity-40 mb-1">Nota Anterior: {t.before}</div>
                       <div className="text-xl font-display font-black text-primary">MIL: {t.after}</div>
                    </div>
                 </div>
               </motion.div>
            ))}
         </div>
      </section>
      {/* FINAL CTA */}
      <section className="py-48 px-6 relative">
         <div className="absolute top-0 left-1/2 -track-x-1/2 w-px h-48 bg-gradient-to-b from-transparent to-primary" />
         
         <div className="max-w-4xl mx-auto bento-card text-center p-16 md:p-32 border-primary/20 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 overflow-hidden relative">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
               <div className="mb-12">
                  <p className="text-primary font-black uppercase tracking-[0.4em] mb-8 italic text-white leading-relaxed">O ENEM NÃO ESPERA POR VOCÊ</p>
                  <Countdown />
               </div>
               
               <h2 className="text-6xl md:text-8xl font-display font-black mb-12 tracking-tighter leading-[0.8] italic text-white">VAMOS COMEÇAR <br/> <span className="text-gradient">O SEU 1000?</span></h2>
               
               <div className="flex flex-col items-center mb-16">
                  <div className="space-y-4 mb-10">
                     <p className="text-2xl font-display font-medium line-through opacity-20 mb-2">DE R$ 99,90</p>
                     <p className="text-8xl font-display font-black text-white">R$ 29,90</p>
                     <div className="px-6 py-2 bg-success/10 border border-success/20 rounded-full text-[12px] font-black uppercase tracking-widest text-success inline-block mt-4">
                        VOCÊ ECONOMIZA R$ 70,00 (70% OFF)
                     </div>
                  </div>
                  
                  <p className="text-lg text-gray-400 max-w-sm mx-auto font-medium leading-relaxed italic bg-white/5 p-4 rounded-2xl border border-white/5">
                    "Menos do que um café por mês, <br/> mais que sua aprovação."
                  </p>
               </div>

               <div className="max-w-md mx-auto mb-10 pt-8">
                 <button 
                   onClick={handleCTA}
                   className="w-full bg-primary text-white py-10 rounded-[48px] text-3xl font-display font-black hover:scale-105 active:scale-95 transition-all shadow-[0_30px_100px_rgba(255,0,102,0.3)] group flex items-center justify-center gap-4"
                 >
                   QUERO MEU 1000 AGORA! <ArrowRight className="group-hover:translate-x-2 transition-transform" size={32} />
                 </button>
               </div>

               <div className="p-8 glass rounded-3xl border-success/20 bg-success/5 mt-12 max-w-xl mx-auto flex flex-col md:flex-row items-center gap-8 text-left">
                  <div className="w-16 h-16 bg-success rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-success/20 group hover:rotate-12 transition-transform">
                     <ShieldCheck className="text-white" size={32} />
                  </div>
                  <div>
                     <h4 className="text-sm font-black uppercase tracking-widest text-success mb-2">GARANTIA INCONDICIONAL DE 30 DIAS</h4>
                     <p className="text-xs text-gray-400 font-bold leading-relaxed">Se você não sentir evolução na sua escrita em 30 dias, devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.</p>
                  </div>
               </div>
               
               <div className="mt-20 flex justify-center gap-10 opacity-30 text-[10px] font-black uppercase tracking-[0.3em]">
                  <span>● CHECKOUT SEGURO</span>
                  <span>● LIBERAÇÃO IMEDIATA</span>
                  <span>● ACESSO VITALÍCIO</span>
               </div>
            </div>
         </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-40 px-6">
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
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-gray-500">
               <span>© 2024 • MatheuS 1000 PRO</span>
               <a href="#" className="text-primary hover:underline">contato@redacao1000pro.com</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
