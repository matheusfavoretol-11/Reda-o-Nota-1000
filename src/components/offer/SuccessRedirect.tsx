import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

const SuccessRedirect = ({ email, checkoutUrl }: { email: string, checkoutUrl: string }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const url = new URL(checkoutUrl);
      url.searchParams.append('email', email);
      window.location.href = url.toString();
    }, 3000);
    return () => clearTimeout(timer);
  }, [email, checkoutUrl]);

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
          <h2 className="text-5xl font-display font-black italic tracking-tighter leading-tight uppercase">
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

export default SuccessRedirect;
