import React from 'react';
import { 
  ArrowRight, 
  Star, 
  Trophy, 
  Scale, 
  Zap, 
  Sparkles 
} from 'lucide-react';

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

interface WhatsAppScreenshotProps {
  name: string;
  text: string;
  time: string;
  avatarBg?: string;
}

const WhatsAppScreenshot = ({ name, text, time, avatarBg = "bg-[#FF3366]" }: WhatsAppScreenshotProps) => {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/5 bg-[#0b141a] shadow-xl text-left select-none max-w-sm mx-auto flex flex-col">
      {/* Header bar */}
      <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between border-b border-[#2a3942]/20">
        <div className="flex items-center gap-3">
          {/* Back Arrow */}
          <span className="text-white/70 text-sm cursor-pointer hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
          </span>
          {/* Avatar with status indicator */}
          <div className="relative">
            <div className={`w-9 h-9 rounded-full ${avatarBg} flex items-center justify-center font-black text-xs text-white`}>
              {name.split(" ")[0].substring(0, 2).toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00e676] rounded-full border-2 border-[#1f2c34]" />
          </div>
          {/* Name & custom status */}
          <div className="flex flex-col">
            <span className="text-white font-bold text-xs sm:text-sm leading-none flex items-center gap-1.5">
              {name}
            </span>
            <span className="text-[#00e676] text-[10px] font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-1 h-1 bg-[#00e676] rounded-full animate-pulse inline-block" />
              online
            </span>
          </div>
        </div>
        {/* Call icons right side */}
        <div className="flex items-center gap-3.5 text-white/50">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16" className="cursor-pointer hover:text-white transition-colors">
            <path fillRule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"/>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="cursor-pointer hover:text-white transition-colors">
            <path d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="cursor-pointer hover:text-white transition-colors">
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
          </svg>
        </div>
      </div>
      
      {/* Screen body wallpaper */}
      <div 
        className="p-4 min-h-[140px] relative flex flex-col justify-end gap-3"
        style={{
          backgroundColor: '#0b141a',
          backgroundImage: 'radial-gradient(rgba(32, 44, 51, 0.4) 1px, transparent 0)',
          backgroundSize: '16px 16px'
        }}
      >
        {/* Subtle decorative "Doodle-like" transparent vectors */}
        <div className="absolute inset-0 bg-black/15 mix-blend-overlay opacity-30 pointer-events-none" />

        {/* Message Bubble (Left / Received) */}
        <div className="relative max-w-[88%] bg-[#202c33] text-white py-2 px-3.5 rounded-2xl rounded-tl-none border-b border-[#2a3942]/10 self-start shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]">
          {/* Arrow pointing left */}
          <div className="absolute -left-1.5 top-0 w-0 h-0 border-y-[6px] border-y-transparent border-r-[8px] border-r-[#202c33]" />
          
          <p className="text-xs sm:text-[13.5px] leading-relaxed font-semibold text-[#e9edef] antialiased">
            {text}
          </p>

          {/* Time & Bubble Ticks */}
          <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-[#8696a0] select-none font-semibold leading-none">
            <span>{time}</span>
            <span className="text-[#53bdeb]">
              {/* Double Blue Checked Symbol */}
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16" className="inline-block">
                <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.5.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.354 10.5l3.5-3.5a.5.5 0 0 1 .708.708l-4 4z"/>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
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
          
          <button 
            onClick={handleCTA}
            className="group w-full bg-[#FF6B35] text-white py-5 rounded-2xl text-base font-display font-black shadow-[0_15px_35px_rgba(255,107,53,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2 border-b-4 border-[#FF6B35]/20"
          >
            <span>QUERO MINHA REDAÇÃO NOTA 1000</span>
            <ArrowRight size={16} />
          </button>
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

      {/* SEÇÃO 3: PROVA SOCIAL */}
      <section className="py-16 md:py-24 px-5 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[#00FF88] text-xs font-black uppercase tracking-[0.2em]">PROVA REAL OUVIDA DOS ALUNOS</span>
          <h2 className="text-3xl md:text-5xl font-display font-black uppercase italic text-white leading-none">
            O Que Eles Dizem Sem Censura
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Depoimento 1 - Bernardo Alves */}
          <WhatsAppScreenshot 
            name="Bernardo Alves"
            text="nossa mto bom, sai de 640 pra 820 em 8 semanas! 😱 as estruturas prontas ajudaram dms, nem tive aquela ansiedade de travar na hora da escrita do ENEM"
            time="14:32"
            avatarBg="bg-[#FF3366]"
          />

          {/* Depoimento 2 - Maria, RJ */}
          <WhatsAppScreenshot 
            name="Maria • RJ"
            text="melhor investimento do ano real! o arsenal de repertório pronto salvou minha aprovação 🥹"
            time="18:05"
            avatarBg="bg-[#7C3AED]"
          />

          {/* Depoimento 3 - Carlos (Pai), MG */}
          <WhatsAppScreenshot 
            name="Carlos (Pai) • MG"
            text="meu filho subiu mais de 230 pontos treinando com a corretora Malu. recomendo dms para todos os pais q tao estressados 👍"
            time="11:24"
            avatarBg="bg-[#00FF88]"
          />

          {/* Depoimento 4 - Bruna K., PR */}
          <WhatsAppScreenshot 
            name="Bruna K. • PR"
            text="as correções da Malu em 30 segundos me permitiram ajustar meus erros na hora. economiza muito dinheiro!"
            time="09:41"
            avatarBg="bg-[#FF6B35]"
          />

          {/* Depoimento 5 - Gabriela M., BA */}
          <WhatsAppScreenshot 
            name="Gabriela M. • BA"
            text="estava travada na nota 600 em redações e tirei 920 pontos na redação de 2025!! mto grata ❤️"
            time="22:15"
            avatarBg="bg-[#3B82F6]"
          />
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
