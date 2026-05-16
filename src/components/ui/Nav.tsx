import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';

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
          <span className="font-display font-black text-2xl tracking-tighter uppercase">RED <span className="text-primary italic">1000</span> PRO</span>
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

export default Nav;
