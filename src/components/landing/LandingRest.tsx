import React from 'react';
import { 
  ArrowRight, 
  Star, 
  Trophy, 
  Scale, 
  Zap, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { WhatsAppScreenshot } from './WhatsAppScreenshot';

// Moved HowItWorks inside LandingRest so it is loaded lazily and doesn't pollute the core chunk
const HowItWorks = ({ onAction, isMobile = false }: { onAction: () => void; isMobile?: boolean }) => {
  const steps = [
    {
      step: "01",
      title: "Recursos Prontos",
      desc: "Esqueletos indestrutíveis para qualquer tema.",
      icon: <Scale className="text-primary" size={isMobile ? 18 : 24} />
    },
    {
      step: "02",
      title: "Treino Prático",
      desc: "Micro-redações rápidas de 8 minutos.",
      icon: <Zap className="text-secondary" size={isMobile ? 18 : 24} />
    },
    {
      step: "03",
      title: "IA Malu",
      desc: "Correção instantânea que ensina a pensar.",
      icon: <Sparkles className="text-accent" size={isMobile ? 18 : 24} />
    }
  ];

  if (isMobile) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <span className="text-primary text-[9px] font-black uppercase tracking-[0.3em]">A Engenharia do 1000</span>
          <h2 className="text-3xl font-display font-black italic uppercase">Como <span className="text-gradient">funciona?</span></h2>
        </div>
        
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div 
              key={i}
              className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                {step.icon}
              </div>
              <div>
                <h3 className="text-sm font-black italic uppercase">{step.title}</h3>
                <p className="text-[11px] text-gray-500 font-medium leading-tight">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 blur-[120px] rounded-full" />
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="text-center space-y-4">
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 inline-block">MÉTODO RED 1000 PRO</span>
          <h2 className="text-4xl md:text-7xl font-display font-black italic uppercase tracking-tighter">
            COMO FUNCIONA <span className="text-gradient">POR DENTRO?</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            O atalho que os corretores do ENEM não querem que você descubra. Uma mistura de engenharia reversa e inteligência artificial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div 
              key={i}
              className="glass p-10 rounded-[48px] border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent relative group hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-6xl font-display font-black opacity-10 mb-8 group-hover:text-primary transition-colors">{step.step}</div>
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-2xl font-display font-black mb-4 italic tracking-tight">{step.title === "Recursos Prontos" ? "A Engenharia Reversa" : step.title === "Treino Prático" ? "Treinamento Celular" : "Simbiose com Malu IA"}</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed italic">{step.title === "Recursos Prontos" ? "Dissecamos mais de 5.000 redações nota 1000 reais para isolar os padrões que SEMPRE recebem nota máxima." : step.title === "Treino Prático" ? "Exercícios de 'micro-redação' que treinam seu cérebro para gerar conectivos automaticamente." : "Nossa IA exclusiva foi treinada exclusivamente com a grade de correção oficial do MEC."}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface LandingRestProps {
  handleCTA: () => void;
  compPrice1: number;
  compPrice2: number;
  compPrice3: number;
  setShowAuth: (mode: 'login' | 'signup' | null) => void;
}

export default function LandingRest({ 
  handleCTA, 
  compPrice1, 
  compPrice2, 
  compPrice3, 
  setShowAuth 
}: LandingRestProps) {
  return (
    <>
      {/* MOBILE VER_COMO_FUNCIONA AUTO-PROMOTIONAL SCROLLER (REQUEST 1, 2) */}
      <section id="como-funciona-mobile" className="md:hidden pt-4 pb-8 px-5 bg-black/10 border-t border-white/5 scroll-mt-20">
        <HowItWorks onAction={handleCTA} isMobile />
        
        {/* USER SPECIFIC REQUEST 5: "Deixe o preço em baixo de como funciona" */}
        <div className="mt-8 space-y-4 pt-4 bg-[#141414] border border-white/5 p-5 rounded-3xl text-left shadow-lg">
          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#00FF88] bg-[#00FF88]/15 px-2.5 py-1 rounded w-fit border border-[#00FF88]/20">Oferta Especial</span>
              <span className="text-[8.5px] font-black text-[#FF6B35] uppercase tracking-wider mt-1.5 leading-none">Últimas vagas com desconto</span>
            </div>
            <div className="text-right flex flex-col justify-end">
              <span className="text-xs line-through opacity-30 font-black block leading-none mb-1">R$ 197</span>
              <span className="text-3xl text-white font-black tracking-tight italic leading-none">R$ 29,90</span>
            </div>
          </div>

          {/* COMPARAÇÃO COM CONCORRÊNCIA */}
          <div className="pt-3 border-t border-white/5 space-y-1.5">
            <span className="text-[8px] font-black text-white/40 tracking-wider block">⚠️ OUTROS CURSOS COBRAM ATÉ:</span>
            <div className="flex flex-wrap gap-1.5">
              <span className="line-through text-white/50 text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5">R$ {compPrice1.toFixed(2).replace('.', ',')}</span>
              <span className="line-through text-white/50 text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5">R$ {compPrice2.toFixed(2).replace('.', ',')}</span>
              <span className="line-through text-white/50 text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5">R$ {compPrice3.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={handleCTA}
              className="group w-full bg-[#FF6B35] text-white py-5 rounded-2xl text-base font-display font-black shadow-[0_15px_35px_rgba(255,107,53,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2 border-b-4 border-[#FF6B35]/20"
            >
              <span>QUERO MINHA REDAÇÃO NOTA 1000</span>
              <ArrowRight size={16} />
            </button>
            <div className="flex items-center justify-center gap-2 bg-[#00FF88]/5 border border-[#00FF88]/10 py-2.5 px-3 rounded-xl">
              <ShieldCheck size={14} className="text-[#00FF88] shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#00FF88] text-center">Garantia de 7 Dias Incondicional</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: VOCÊ RECEBE (O QUE COMPRA) */}
      <section className="py-16 md:py-24 px-5 bg-[#151515] border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[#FF6B35] text-xs font-black uppercase tracking-[0.2em]">CONTEÚDO DO MÉTODO</span>
            <h2 className="text-3xl md:text-5xl font-display font-black uppercase italic text-white">
              Exatamente o Que Você Ganha
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Card 1 */}
            <div className="glass p-6 rounded-3xl border-white/10 hover:border-[#FF6B35]/30 hover:bg-white/[0.02] transition-colors flex gap-4 items-start bg-[#1a1a1a]">
              <div className="p-3 bg-white/5 rounded-2xl text-xl text-[#FF6B35] shrink-0">📖</div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase text-white">EBOOK INICIANTE→AVANÇADO</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-semibold">
                  Ebook completo. Pilares fundamentais + estruturas que funcionam + redações nota 1000 comentadas + repertórios selecionados.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass p-6 rounded-3xl border-white/10 hover:border-[#FF6B35]/30 hover:bg-white/[0.02] transition-colors flex gap-4 items-start bg-[#1a1a1a]">
              <div className="p-3 bg-white/5 rounded-2xl text-xl text-[#FF6B35] shrink-0">🤖</div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase text-white">IA QUE CORRIGE 24/7</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-semibold">
                  Manda sua redação. Em 30 segundos recebe: nota em cada competência, erros específicos, sugestões de melhoria. Ilimitado.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="glass p-6 rounded-3xl border-white/10 hover:border-[#FF6B35]/30 hover:bg-white/[0.02] transition-colors flex gap-4 items-start bg-[#1a1a1a]">
              <div className="p-3 bg-white/5 rounded-2xl text-xl text-[#FF6B35] shrink-0">📚</div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase text-white">REPERTÓRIOS</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-semibold">
                  Filósofos, dados, histórias - tudo organizado por tema. Busca rápido e usa na hora.
                </p>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* SEÇÃO 4: OBJEÇÕES + FAQ */}
      <section className="py-16 md:py-24 px-5 bg-[#151515] border-y border-white/5">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[#FF6B35] text-xs font-black uppercase tracking-[0.2em]">PRINCIPAIS OBJEÇÕES</span>
            <h2 className="text-3xl md:text-5xl font-display font-black uppercase italic text-white">
              Dúvidas?
            </h2>
          </div>

          <div className="grid gap-4">
            {[
              { q: "Quanto tempo por dia?", a: "Apenas 45 min, 4-5x por semana. Você estuda no seu tempo." },
              { q: "Funciona junto com o cursinho presencial?", a: "Sim, serve como um impulsionador de nota. A maioria dos nossos alunos estuda assim." },
              { q: "Quanto tempo para eu ver o resultado?", a: "4 a 6 semanas para notar alta consistência no 750+ e de 8 a 12 semanas para notas de 900+ na redação." },
              { q: "Sou totalmente iniciante, vou entender?", a: "Sim, começamos do zero teórico absoluto. O Ebook tem um guia básico para redação." },
              { q: "O acesso dura quanto tempo?", a: "Acesso vitalício. O método é seu de forma permanente." },
              { q: "E se eu não gostar ou achar difícil?", a: "Garantia incondicional de 7 dias. Não gostou? Devolvemos 100% sem perguntas." }
            ].map((obj, i) => (
              <div key={i} className="glass p-5 rounded-2xl border-white/5 bg-[#1a1a1a] flex flex-col gap-2 shadow-sm">
                <div className="flex items-start gap-2.5 text-white font-bold text-sm sm:text-base">
                  <span className="text-[#FF6B35] shrink-0">❓</span>
                  <span>{obj.q}</span>
                </div>
                <div className="flex items-start gap-2.5 text-gray-400 text-xs sm:text-sm font-semibold pl-6">
                  <span className="text-[#00FF88] shrink-0">✅</span>
                  <span>{obj.a}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>





      {/* Footer */}
      <footer className="mt-20 py-16 px-12 border-t border-white/5 opacity-50 bg-[#121212]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-[#FF6B35]" />
            <span className="font-display font-black text-lg tracking-tighter uppercase">RED 1000 PRO</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-[#FF6B35]">
            <span>© 2026 • MatheuS 1000 PRO</span>
            <button onClick={() => setShowAuth('login')} className="hover:text-white transition-colors">Área do Aluno</button>
            <a href="mailto:contato@redacao1000pro.com" className="hover:underline text-gray-400">contato@redacao1000pro.com</a>
          </div>
        </div>
      </footer>
    </>
  );
}
