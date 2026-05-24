import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Zap, 
  BarChart3, 
  ArrowRight, 
  ClipboardList,
  Sparkles,
  Trophy,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface DashboardOverviewProps {
  user: any;
  onNavigate: (view: any) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ user, onNavigate }) => {
  const accessItems = [
    { text: "Ebook 30 páginas", status: "✓" },
    { text: "15 Exercícios práticos", status: "✓" },
    { text: "Redações nota 1000 analisadas", status: "✓" },
    { text: "Malu IA disponível", status: "✓" },
    { text: "Suporte 30 dias", status: "✓" },
  ];

  const quickActions = [
    { label: "Ler Ebook", icon: <BookOpen className="w-5 h-5" />, view: 'ebook', color: 'primary', desc: "Guia de 30 páginas" },
    { label: "Fazer Exercício", icon: <ClipboardList className="w-5 h-5" />, view: 'exercicios', color: 'secondary', desc: "Treinos curtos" },
    { label: "Analisar Redação", icon: <Sparkles className="w-5 h-5" />, view: 'ia', color: 'accent', desc: "Malu IA Corretora" },
  ];

  const progressData = [
    { label: "Ebook", value: 45, text: "45% concluído" },
    { label: "Exercícios", value: 20, text: "3 de 15 feitos" },
    { label: "Redações analisadas", value: 40, text: "2 analisadas" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-12 px-4 md:px-6 space-y-6 md:space-y-12">
      
      {/* BOXED WELCOME SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0A0A0F] border border-white/10 rounded-2xl md:rounded-[40px] overflow-hidden"
      >
        <div className="p-6 border-b border-white/5 flex flex-col gap-1">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Bem-vindo! 👋</h2>
          <h1 className="text-3xl md:text-5xl font-display font-black italic tracking-tighter text-white">
            {user?.email?.split('@')[0] || "Estudante"}
          </h1>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2">
            <Trophy size={14} className="text-secondary" /> SEU ACESSO
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accessItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-300 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                <span className="text-success font-black">{item.status}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* BOXED ACTIONS */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#0A0A0F] border border-white/10 rounded-2xl md:rounded-[40px] overflow-hidden"
      >
        <div className="p-6 border-b border-white/5">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-accent flex items-center gap-2">
            <Zap size={14} className="text-accent" /> COMECE AGORA
          </h3>
        </div>
        <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => onNavigate(action.view)}
              className="group flex items-center md:flex-col md:justify-center p-5 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all active:scale-95 text-left md:text-center gap-4 md:gap-5"
            >
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white group-hover:bg-primary group-hover:text-white transition-all shrink-0`}>
                {action.icon}
              </div>
              <div className="flex-1">
                <span className="block text-xs md:text-sm font-black uppercase tracking-widest text-white">{action.label}</span>
                <span className="block text-[10px] font-bold opacity-30 uppercase mt-1">{action.desc}</span>
              </div>
              <ChevronRight className="md:hidden opacity-20" size={20} />
            </button>
          ))}
        </div>
      </motion.div>

      {/* BOXED PROGRESS */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#0A0A0F] border border-white/10 rounded-2xl md:rounded-[40px] overflow-hidden"
      >
        <div className="p-6 border-b border-white/5">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-success flex items-center gap-2">
            <BarChart3 size={14} className="text-success" /> SEU PROGRESSO
          </h3>
        </div>
        <div className="p-6 md:p-10 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
          {progressData.map((prog, i) => (
            <div key={i} className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{prog.label}</span>
                <span className="text-[9px] font-mono font-black italic text-primary">{prog.text}</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${prog.value}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(255,0,102,0.5)]"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
