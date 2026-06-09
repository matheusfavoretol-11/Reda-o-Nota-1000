import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, MessageSquare, AlertTriangle, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { getSupabase, updateSupabaseConfig } from '../../lib/supabase';
import SuccessRedirect from '../offer/SuccessRedirect';

const AuthScreen = ({ mode, onClose, setMode, checkoutUrl }: { mode: 'login' | 'signup', onClose: () => void, setMode: (m: 'login' | 'signup') => void, checkoutUrl: string }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    let url = "";
    let key = "";

    try {
      const response = await fetch('/api/config/supabase');
      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data && data.url && data.key && !data.url.includes("your-project-id")) {
          url = data.url;
          key = data.key;
          updateSupabaseConfig(url, key);
        }
      }
    } catch (err) {
      // Ignorado, usará fallbacks
    }

    if (!url) {
      url = (window as any).__SUPABASE_DYNAMIC_CONFIG__?.url || import.meta.env.VITE_SUPABASE_URL || "";
      key = (window as any).__SUPABASE_DYNAMIC_CONFIG__?.key || import.meta.env.VITE_SUPABASE_ANON_KEY || "";
    }
    
    if (!url || url.includes("your-project-id")) {
      toast.error("Configuração do Banco de Dados não detectada");
      setAuthLoading(false);
      return;
    }

    const client = getSupabase();
    const cleanEmail = email.trim().toLowerCase();
    
    try {
      if (mode === 'signup') {
        const { error } = await client.auth.signUp({ email: cleanEmail, password });
        if (error) throw error;
        toast.success("Conta criada!");
        setShowSuccess(true);
      } else {
        const { error } = await client.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) throw error;
        toast.success("Login realizado!");
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  if (showSuccess) {
    return <SuccessRedirect email={email} checkoutUrl={checkoutUrl} />;
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-bg-dark/80 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass w-full max-w-md p-10 rounded-[48px] border-white/10 relative z-10 overflow-hidden shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
            {mode === 'signup' ? <MessageSquare size={32} /> : <Lock size={32} />}
          </div>
          <h2 className="text-4xl font-display font-black italic tracking-tighter uppercase">
            {mode === 'signup' ? 'Nova Conta' : 'Acesse a Elite'}
          </h2>
          <p className="text-gray-400 font-medium text-sm">
            {mode === 'signup' ? 'Junte-se a 2.847 alunos nota 1000.' : 'Suas redações perfeitas te esperam.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-6">Seu melhor e-mail</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-medium focus:outline-none focus:border-primary/50 transition-all"
                placeholder="nome@exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-6">Sua senha secreta</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-medium focus:outline-none focus:border-primary/50 transition-all pr-14"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={authLoading}
            className="w-full bg-primary py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
          >
            {authLoading ? <RefreshCw className="animate-spin" size={16} /> : mode === 'signup' ? 'CRIAR MINHA CONTA' : 'DESTRAVAR ACESSO'}
          </button>

          <div className="text-center pt-4">
            <button 
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors"
            >
              {mode === 'login' ? 'Ainda não é membro? Cadastre-se' : 'Já tem uma conta? Entre aqui'}
            </button>
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-2 opacity-30 text-[9px] font-black uppercase tracking-widest">
           <AlertTriangle size={12} /> Seus dados estão criptografados
        </div>
      </motion.div>
    </div>
  );
};

export default AuthScreen;
