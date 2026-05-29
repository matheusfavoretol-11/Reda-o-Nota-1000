import React from 'react';
import { 
  ArrowRight, 
  Star, 
  Trophy, 
  Scale, 
  Zap, 
  Sparkles,
  CheckCircle2,
  Users,
  Clock
} from 'lucide-react';

const HowItWorks = ({ onAction, isMobile = false }: { onAction: () => void; isMobile?: boolean }) => {
  const steps = [
    {
      step: "01",
      title: "Engenharia Reversa",
      desc: "Dissecamos os padrões das notas 1000 reais.",
      icon: <Scale className="text-primary" size={isMobile ? 18 : 24} />
    },
    {
      step: "02",
      title: "Treino Celular",
      desc: "Exercícios rápidos para automatizar conectivos.",
      icon: <Zap className="text-secondary" size={isMobile ? 18 : 24} />
    },
    {
      step: "03",
      title: "Malu IA 3.0",
      desc: "Correção oficial do MEC em 30 segundos.",
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
            A CIÊNCIA POR TRÁS DO <span className="text-gradient">900+</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            O atalho tecnológico que os corretores do ENEM não querem que você descubra. Uma mistura de engenharia reversa e inteligência artificial de elite.
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
              <h3 className="text-2xl font-display font-black mb-4 italic tracking-tight">{step.title}</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed italic">
                {step.title === "Engenharia Reversa" ? "Isolamos os padrões matemáticos das redações nota 1000 para criar esqueletos que funcionam em qualquer tema." : 
                 step.title === "Treino Celular" ? "Exercícios de 'micro-redação' que treinam seu cérebro para gerar argumentos nota máxima automaticamente." : 
                 "Nossa IA exclusiva foi treinada com a grade de correção oficial do MEC para te dar o feedback real em segundos."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface TestimonialProps {
  name: string;
  result: string;
  text: string;
  avatarBg?: string;
  location?: string;
}

const TestimonialCard = ({ name, result, text, avatarBg = "bg-primary", location }: TestimonialProps) => {
  return (
    <div className="glass p-8 rounded-[32px] border-white/5 bg-[#1a1a1a] flex flex-col gap-6 hover:border-primary/30 transition-all group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl ${avatarBg} flex items-center justify-center font-black text-white shadow-lg`}>
            {name.charAt(0)}
          </div>
          <div>
            <h4 className="text-white font-bold text-sm leading-none">{name}</h4>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">{location || 'Aluno Pro'}</p>
          </div>
        </div>
        <div className="bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-[9px] font-black text-primary uppercase tracking-tighter">
          {result}
        </div>
      </div>
      <p className="text-gray-300 text-sm font-semibold leading-relaxed italic">
        "{text}"
      </p>
      <div className="flex gap-1">
        {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-primary text-primary" />)}
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
      {/* MOBILE OFFER SECTION */}
      <section id="como-funciona-mobile" className="md:hidden pt-4 pb-8 px-5 bg-black/10 border-t border-white/5 scroll-mt-20">
        <HowItWorks onAction={handleCTA} isMobile />
        
        <div className="mt-8 space-y-4 pt-4 bg-[#141414] border border-white/5 p-5 rounded-3xl text-left shadow-lg">
          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/15 px-2.5 py-1 rounded w-fit border border-primary/20">Oferta Especial</span>
              <span className="text-[8.5px] font-black text-secondary uppercase tracking-wider mt-1.5 leading-none">Vagas limitadas para o ENEM 2026</span>
            </div>
            <div className="text-right flex flex-col justify-end">
              <span className="text-xs line-through opacity-30 font-black block leading-none mb-1">R$ 197</span>
              <span className="text-3xl text-white font-black tracking-tight italic leading-none">R$ 29,90</span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 space-y-1.5">
            <span className="text-[8px] font-black text-white/40 tracking-wider block uppercase">Economia real frente a cursinhos:</span>
            <div className="flex flex-wrap gap-1.5">
              <span className="line-through text-white/50 text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5">R$ {compPrice1.toFixed(2).replace('.', ',')}</span>
              <span className="line-through text-white/50 text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5">R$ {compPrice2.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
          
          <button 
            onClick={handleCTA}
            className="group w-full bg-primary text-white py-5 rounded-2xl text-base font-display font-black shadow-[0_15px_35px_rgba(255,51,102,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2 border-b-4 border-black/20"
          >
            <span>QUERO MINHA REDAÇÃO NOTA 1000</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* SEÇÃO: VOCÊ RECEBE */}
      <section className="py-16 md:py-24 px-5 bg-[#151515] border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-primary text-xs font-black uppercase tracking-[0.2em]">O ARSENAL COMPLETO</span>
            <h2 className="text-3xl md:text-5xl font-display font-black uppercase italic text-white">
              Tudo que você precisa para o 900+
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="glass p-6 rounded-3xl border-white/10 hover:border-primary/30 transition-all flex gap-4 items-start bg-[#1a1a1a]">
              <div className="p-3 bg-white/5 rounded-2xl text-xl text-primary shrink-0">📖</div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase text-white">Guia Emergencial Nota 1000</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-semibold">
                  O atalho de 30 páginas com as fórmulas prontas, pilares fundamentais e estruturas que funcionam de verdade.
                </p>
              </div>
            </div>

            <div className="glass p-6 rounded-3xl border-white/10 hover:border-primary/30 transition-all flex gap-4 items-start bg-[#1a1a1a]">
              <div className="p-3 bg-white/5 rounded-2xl text-xl text-primary shrink-0">🤖</div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase text-white">Malu IA: Correção 24/7</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-semibold">
                  Mande sua redação e receba nota por competência, erros específicos e sugestões em 30 segundos. Ilimitado.
                </p>
              </div>
            </div>

            <div className="glass p-6 rounded-3xl border-white/10 hover:border-primary/30 transition-all flex gap-4 items-start bg-[#1a1a1a]">
              <div className="p-3 bg-white/5 rounded-2xl text-xl text-primary shrink-0">📚</div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase text-white">Arsenal de Repertórios</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-semibold">
                  Filósofos, dados e citações "curingas" organizados por tema para você usar em qualquer redação.
                </p>
              </div>
            </div>

            <div className="glass p-6 rounded-3xl border-white/10 hover:border-primary/30 transition-all flex gap-4 items-start bg-[#1a1a1a]">
              <div className="p-3 bg-white/5 rounded-2xl text-xl text-primary shrink-0">🏆</div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase text-white">Redações Nota 1000 Reais</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-semibold">
                  Exemplos reais comentados linha por linha para você entender exatamente o que o corretor quer ver.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: PROVA SOCIAL MELHORADA */}
      <section className="py-16 md:py-24 px-5 max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-3 text-left">
            <span className="text-accent text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <Users size={14} /> RESULTADOS COMPROVADOS
            </span>
            <h2 className="text-3xl md:text-6xl font-display font-black uppercase italic text-white leading-[0.9]">
              Quem usa o <span className="text-gradient">Método</span>,<br/>chega no topo.
            </h2>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-display font-black text-primary">2.8k+</div>
              <div className="text-[8px] font-black uppercase tracking-widest opacity-40">Alunos</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-display font-black text-secondary">92%</div>
              <div className="text-[8px] font-black uppercase tracking-widest opacity-40">com 750+</div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard 
            name="Bernardo Alves"
            location="Aprovado em Direito"
            result="+180 PONTOS"
            text="Saí de 640 para 820 em 8 semanas! As estruturas prontas ajudaram demais, perdi o medo de travar na hora da escrita."
            avatarBg="bg-pink-500"
          />
          <TestimonialCard 
            name="Maria Eduarda"
            location="Rio de Janeiro, RJ"
            result="NOTA 940"
            text="Melhor investimento do ano. O arsenal de repertórios salvou minha aprovação. A Malu IA é surreal de rápida!"
            avatarBg="bg-purple-500"
          />
          <TestimonialCard 
            name="Gabriela M."
            location="Salvador, BA"
            result="DE 600 PARA 920"
            text="Estava travada no 600 e tirei 920 no último ENEM. A correção instantânea me permitiu ajustar os erros na hora."
            avatarBg="bg-blue-500"
          />
        </div>

        {/* TRUST BAR */}
        <div className="pt-12 border-t border-white/5 flex flex-wrap justify-center gap-12 opacity-30 grayscale">
           <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
             <CheckCircle2 size={16} /> Grade Oficial MEC
           </div>
           <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
             <Clock size={16} /> Correção em 30s
           </div>
           <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
             <Trophy size={16} /> +2.800 Aprovados
           </div>
        </div>
      </section>

      {/* SEÇÃO: FAQ */}
      <section className="py-16 md:py-24 px-5 bg-[#151515] border-y border-white/5">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-primary text-xs font-black uppercase tracking-[0.2em]">PRINCIPAIS OBJEÇÕES</span>
            <h2 className="text-3xl md:text-5xl font-display font-black uppercase italic text-white">
              Ainda com dúvidas?
            </h2>
          </div>

          <div className="grid gap-4">
            {[
              { q: "A IA Malu é realmente confiável?", a: "Sim! Nossa IA foi treinada especificamente com a grade de correção oficial do MEC e milhares de redações nota 1000 reais. Ela avalia as 5 competências com precisão cirúrgica." },
              { q: "Quanto tempo por dia preciso estudar?", a: "Apenas 45 min, 4-5x por semana. O método foi feito para quem tem rotina apertada e precisa de eficiência." },
              { q: "Funciona para quem é iniciante do zero?", a: "Com certeza. Começamos do zero absoluto, ensinando desde a estrutura básica até os repertórios mais avançados." },
              { q: "O acesso é vitalício?", a: "Sim. Pagamento único e acesso para sempre. Você pode usar para o ENEM deste ano e de todos os próximos se precisar." },
              { q: "E se eu não gostar?", a: "Garantia incondicional de 7 dias. Se não sentir que sua nota vai subir, devolvemos 100% do seu dinheiro." }
            ].map((obj, i) => (
              <div key={i} className="glass p-6 rounded-2xl border-white/5 bg-[#1a1a1a] flex flex-col gap-2">
                <div className="flex items-start gap-2.5 text-white font-bold text-sm sm:text-base">
                  <span className="text-primary shrink-0">❓</span>
                  <span>{obj.q}</span>
                </div>
                <div className="flex items-start gap-2.5 text-gray-400 text-xs sm:text-sm font-semibold pl-6">
                  <span className="text-secondary shrink-0">✅</span>
                  <span>{obj.a}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-20 py-16 px-12 border-t border-white/5 opacity-50 bg-[#121212]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-primary" />
            <span className="font-display font-black text-lg tracking-tighter uppercase">RED 1000 PRO</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-primary">
            <span>© 2026 • MatheuS 1000 PRO</span>
            <button onClick={() => setShowAuth('login')} className="hover:text-white transition-colors">Área do Aluno</button>
            <a href="mailto:contato@redacao1000pro.com" className="hover:underline text-gray-400">contato@redacao1000pro.com</a>
          </div>
        </div>
      </footer>
    </>
  );
}
