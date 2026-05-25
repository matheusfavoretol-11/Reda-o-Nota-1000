import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, BookOpen, Trophy, CheckCircle2, Zap, ArrowRight, RefreshCw, ShieldCheck, Clock } from 'lucide-react';

const BenefitsOffer = ({ user, onLogout, manualVerify, isVerifying, checkoutUrl }: { user: any, onLogout: () => void, manualVerify: () => void, isVerifying: boolean, checkoutUrl: string }) => {
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
    const url = new URL(checkoutUrl);
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
            <p className="text-gray-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed text-center">
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
                QUERO MINHA REDAÇÃO NOTA 1000 <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary animate-pulse mb-2">
                   <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                   Sincronizando com e-mail: {user.email}
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

export default BenefitsOffer;
