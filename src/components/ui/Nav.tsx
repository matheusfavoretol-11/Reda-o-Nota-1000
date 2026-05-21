import React, { useState, useEffect } from 'react';
import { Trophy, User } from 'lucide-react';

interface NavProps {
  onAction: () => void;
  onLogin: () => void;
}

const Nav = ({ onAction, onLogin }: NavProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 p-3 md:p-6`}>
      <div className={`max-w-7xl mx-auto flex justify-between items-center glass p-3 md:p-4 px-4 md:px-8 rounded-2xl md:rounded-[32px] ${isScrolled ? 'bg-white/10' : ''}`}>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-primary p-1.5 md:p-2 rounded-xl md:rounded-2xl rotate-3 shadow-[0_0_20px_rgba(255,0,102,0.4)]">
            <Trophy className="text-white w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span className="font-display font-black text-lg md:text-2xl tracking-tighter uppercase">RED <span className="text-primary italic">1000</span> PRO</span>
        </div>
        
        <div className="hidden lg:flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] opacity-60">
          <a href="#features" className="hover:text-primary transition-colors">Método</a>
          <a href="#ia" className="hover:text-primary transition-colors">Malu IA</a>
          <a href="#faq" className="hover:text-primary transition-colors">Dúvidas</a>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={onLogin}
            className="flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity px-2"
          >
            <User size={14} /> <span>Entrar</span>
          </button>
          
          <button 
            onClick={onAction}
            className="bg-white text-bg-dark px-4 md:px-8 py-2.5 md:py-3 rounded-full font-display font-black text-[9px] md:text-xs uppercase tracking-widest hover:bg-accent transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/5 whitespace-nowrap"
          >
            QUERO MEU 1000
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
