import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { REPERTORIOS_DATA, TOP_THEMES_REPERTOIRE } from '../../data/constants';

const RepertoireView = () => {
    const [selectedCat, setSelectedCat] = useState<string | null>(null);

    return (
        <div className="space-y-12 mt-12 mb-20">
            <div className="flex flex-wrap gap-4 mb-12">
               <button 
                  onClick={() => setSelectedCat(null)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!selectedCat ? 'bg-primary text-white' : 'glass opacity-60'}`}
               >
                  Todos
               </button>
               {REPERTORIOS_DATA.map((cat, i) => (
                  <button 
                     key={i}
                     onClick={() => setSelectedCat(cat.category)}
                     className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedCat === cat.category ? 'bg-primary text-white' : 'glass opacity-60'}`}
                  >
                     {cat.category}
                  </button>
               ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {REPERTORIOS_DATA.filter(c => !selectedCat || c.category === selectedCat).map((cat, i) => (
                    cat.items.map((item: any, j: number) => (
                      <motion.div 
                        key={`${i}-${j}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-8 rounded-[40px] border-white/5 hover:border-primary/20 transition-all flex flex-col justify-between group h-full"
                      >
                         <div>
                            <div className="flex justify-between items-start mb-6">
                               <h3 className="text-2xl font-display font-black italic tracking-tighter group-hover:text-primary transition-colors">{item.name}</h3>
                               <span className="text-[9px] font-black px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg uppercase tracking-widest">{cat.category}</span>
                            </div>
                            <div className="space-y-6">
                               <div className="space-y-1">
                                  <div className="text-[10px] font-black opacity-30 uppercase tracking-widest font-mono">Conceito</div>
                                  <div className="text-base font-bold text-white leading-relaxed">{item.concept}</div>
                               </div>
                               <div className="space-y-1">
                                  <div className="text-[10px] font-black opacity-30 uppercase tracking-widest font-mono">Aplicação</div>
                                  <div className="text-xs font-semibold text-gray-400 leading-relaxed">{item.application}</div>
                               </div>
                               {item.usage && (
                                  <div className="p-5 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                                     <div className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-2">💡 Como usar na prática</div>
                                     <div className="text-[11px] font-medium text-gray-300 italic leading-relaxed">"{item.usage}"</div>
                                  </div>
                                )}
                            </div>
                         </div>
                         <div className="mt-8 space-y-6 pt-8 border-t border-white/5">
                            {item.quote && (
                               <div className="italic text-gray-500 text-xs bg-white/[0.01] p-4 rounded-xl">
                                  "{item.quote}"
                                </div>
                            )}
                            <div className="flex flex-wrap gap-2">
                               {item.theme && (
                                  <div className="text-[9px] font-black text-accent uppercase tracking-widest bg-accent/5 px-2 py-1 rounded">#{item.theme}</div>
                               )}
                               {item.themes?.map((t: string, k: number) => (
                                  <div key={k} className="text-[9px] font-black text-secondary uppercase tracking-widest bg-secondary/5 px-2 py-1 rounded">#{t}</div>
                               ))}
                            </div>
                         </div>
                      </motion.div>
                    ))
                ))}
            </div>

            <div className="mt-24 p-12 glass rounded-[64px] border-primary/20 bg-primary/5 space-y-12">
               <div className="text-center space-y-4">
                  <h3 className="text-3xl font-display font-black italic tracking-tighter">🔥 Guia Rápido por Temas</h3>
                  <p className="text-gray-400 font-medium italic">As melhores combinações de repertório para os temas mais prováveis.</p>
               </div>
               
               <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {TOP_THEMES_REPERTOIRE.map((item, i) => (
                     <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-primary/30 transition-all group">
                        <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-4 group-hover:scale-105 transition-transform inline-block">{item.theme}</h4>
                        <ul className="space-y-3">
                           {item.items.map((repertory, j) => (
                              <li key={j} className="text-[11px] font-bold text-gray-400 flex items-start gap-2">
                                 <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mt-1 shrink-0" />
                                 {repertory}
                              </li>
                           ))}
                        </ul>
                     </div>
                  ))}
               </div>
            </div>
        </div>
    )
}

export default RepertoireView;
