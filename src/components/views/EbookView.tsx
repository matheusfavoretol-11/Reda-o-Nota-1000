import React, { useState } from 'react';
import { EBOOK_PAGES } from '../../data/constants';

const EbookView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 40; // Updated to match the data

  const getPageContent = (page: number) => {
    return [...EBOOK_PAGES].reverse().find(p => p.p <= page) || EBOOK_PAGES[0];
  };

  const activePage = getPageContent(currentPage);

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-12 items-start mt-12 overflow-visible">
      {/* SIDEBAR NAVIGATION */}
      <div className="glass rounded-[32px] p-6 space-y-2 sticky top-6 hidden lg:block">
        <h3 className="text-xs font-black uppercase tracking-widest opacity-30 px-4 mb-4 font-mono">Manual do Aprovado</h3>
        {[
          { p: 1, t: "Págs 1-2: Comece Aqui" },
          { p: 3, t: "Págs 3-5: O Que é Redação" },
          { p: 6, t: "Págs 6-9: Estrutura & Intro" },
          { p: 10, t: "Págs 10-14: Conclusão" },
          { p: 15, t: "Págs 15-19: Repertório" },
          { p: 20, t: "Págs 20-24: Coesão" },
          { p: 25, t: "Págs 25-29: Prática" },
          { p: 30, t: "Págs 30: Próximos Passos" },
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={() => setCurrentPage(item.p)}
            className={`w-full text-left p-3 px-4 rounded-xl text-[10px] font-bold transition-all ${currentPage === item.p ? 'bg-primary text-white scale-105 shadow-lg shadow-primary/20' : 'hover:bg-white/5 opacity-60'}`}
          >
            {item.t}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="glass rounded-[48px] p-8 md:p-16 border-white/5 min-h-[800px] relative">
        <div className="absolute top-8 right-8 text-[10px] font-black uppercase opacity-20 font-mono tracking-widest">
          PÁGINA {currentPage} / {totalPages}
        </div>

        <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="space-y-6">
              <span className="p-2 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg border border-primary/20">{activePage.section}</span>
              <h1 className="text-5xl font-display font-black leading-tight italic">{activePage.title}</h1>
              <p className="text-xl text-gray-400 font-medium leading-relaxed">
                {activePage.content}
              </p>
           </div>

           {currentPage === 1 && (
             <div className="p-8 glass rounded-[32px] border-primary/20 bg-primary/5">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2 italic">🚀 Aviso aos Navegantes</h4>
                <p className="text-gray-300 italic leading-relaxed">
                  Não tente ser um gênio. Tente ser um técnico. Redação é o jogo mais previsível do ENEM.
                </p>
             </div>
           )}

           {currentPage === 15 && (
             <div className="grid gap-6">
                <div className="p-6 glass rounded-2xl border-white/10">
                   <h4 className="text-sm font-black text-primary mb-2">DICA DE OURO</h4>
                   <p className="text-xs text-gray-400 italic">"Repertório legitimado é aquele que tem autoridade comprovada. Não invente citações!"</p>
                </div>
             </div>
           )}
        </div>

        {/* NAVIGATION FOOTER */}
        <div className="mt-20 pt-12 border-t border-white/5 flex justify-between items-center">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="p-3 px-6 glass rounded-full font-black text-[10px] uppercase tracking-widest disabled:opacity-20 hover:bg-white/10"
          >
            Anterior
          </button>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="p-3 px-8 bg-primary text-white rounded-full font-black text-[10px] uppercase tracking-widest disabled:opacity-20 hover:scale-105 transition-all shadow-lg shadow-primary/20"
          >
            Próxima Página
          </button>
        </div>
      </div>
    </div>
  );
};

export default EbookView;
