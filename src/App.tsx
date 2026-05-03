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

export default function App() {
  const [isPaid, setIsPaid] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [email, setEmail] = useState("");
  const [isChecking, setIsChecking] = useState(false);

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
      <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6 selection:bg-primary/30">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bento-card max-w-2xl text-center border-primary/30 shadow-[0_0_100px_rgba(255,0,102,0.15)]"
        >
          <div className="w-24 h-24 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(255,0,102,0.5)]">
            <Trophy size={48} className="text-white" />
          </div>
          <h1 className="text-6xl font-display font-black mb-6 tracking-tighter leading-none">ACESSO <span className="text-gradient">LIBERADO!</span></h1>
          <p className="text-xl text-gray-400 mb-12 font-medium leading-relaxed">
            Bem-vindo ao Redação 1000 PRO. Sua conta foi atualizada e todas as funcionalidades estão desbloqueadas. Bora pro mil?
          </p>
          <button 
            onClick={() => setShowWelcome(false)}
            className="w-full bg-accent text-bg-dark py-6 rounded-[24px] font-display font-black text-xl mb-6 shadow-lg shadow-accent/20 active:scale-95 transition-all"
          >
            ENTRAR NO DASHBOARD
          </button>
          <p className="text-[10px] font-black uppercase opacity-30 italic">Acesso vitalício garantido</p>
        </motion.div>
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

      <footer className="py-24 px-12 border-t border-white/5 opacity-50">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-2">
               <Trophy size={20} className="text-primary" />
               <span className="font-display font-black text-xl tracking-tighter">RED 1000 PRO</span>
            </div>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-gray-500">
               <a href="#">Privacidade</a>
               <a href="#">Termos</a>
               <a href="#" className="text-primary">contato@redacao1000pro.com</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
