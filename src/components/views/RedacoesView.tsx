import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, User, Hash } from 'lucide-react';
import { REDACOES_MODELO } from '../../data/constants';

const RedacoesView = () => {
    const [selectedRedacao, setSelectedRedacao] = useState<number | null>(null);

    return (
        <div className="space-y-12 mt-12 mb-20 animate-in fade-in duration-700">
            <AnimatePresence mode="wait">
                {selectedRedacao === null ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {REDACOES_MODELO.map((red, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ y: -10 }}
                                className="glass p-8 rounded-[48px] border-white/5 hover:border-primary/20 transition-all flex flex-col justify-between h-[450px] relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-all" />
                                
                                <div className="space-y-6 relative">
                                    <div className="flex justify-between items-center">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                            <Trophy className="text-secondary w-6 h-6" />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Nota ENEM</div>
                                            <div className="text-3xl font-display font-black text-white">{red.note}</div>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-display font-black italic tracking-tighter leading-[1] group-hover:text-primary transition-colors">{red.title}</h3>
                                    <p className="text-gray-400 text-xs font-semibold leading-relaxed line-clamp-3 italic opacity-60">Tema: {red.theme}</p>
                                </div>
                                
                                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-6 relative">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                            <User size={14} className="opacity-40" />
                                        </div>
                                        <div className="text-[10px] font-black uppercase opacity-40 tracking-widest">{red.author}</div>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedRedacao(i)}
                                        className="w-full p-4 glass rounded-2xl bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        Ler Redação Completa <ArrowRight size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-4xl mx-auto space-y-12"
                    >
                        <button 
                          onClick={() => setSelectedRedacao(null)}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100"
                        >
                            <ArrowRight className="rotate-180" size={14} /> Voltar à Lista
                        </button>

                        <div className="glass rounded-[64px] border-white/5 overflow-hidden shadow-2xl">
                            <div className="p-12 md:p-16 border-b border-white/5 bg-white/[0.01]">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="p-2 bg-primary/10 text-primary text-[9px] font-black uppercase rounded-lg border border-primary/20 italic tracking-widest">Modelo Nota 1000</span>
                                            <span className="text-[10px] font-black uppercase opacity-30 flex items-center gap-1 font-mono tracking-tighter"><Hash size={12} /> {REDACOES_MODELO[selectedRedacao].author}</span>
                                        </div>
                                        <h1 className="text-5xl font-display font-black italic tracking-tighter leading-[0.9]">{REDACOES_MODELO[selectedRedacao].title}</h1>
                                    </div>
                                    <div className="bg-primary p-6 px-10 rounded-[32px] text-center shadow-2xl shadow-primary/30 rotate-2">
                                        <div className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Pontuação Final</div>
                                        <div className="text-5xl font-display font-black text-white tracking-widest leading-none">{REDACOES_MODELO[selectedRedacao].note}</div>
                                    </div>
                                </div>
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                                    <div className="text-[10px] font-black uppercase opacity-30 mb-2 font-mono">TEMA OFICIAL:</div>
                                    <p className="text-base md:text-xl font-bold leading-tight italic">"{REDACOES_MODELO[selectedRedacao].theme}"</p>
                                </div>
                            </div>
                            
                            <div className="p-12 md:p-16 grid lg:grid-cols-[1fr_300px] gap-16">
                                <div className="space-y-8">
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-30 font-mono flex items-center gap-2">
                                        <div className="w-12 h-[1px] bg-white/20" /> TEXTO ORIGINAL
                                    </div>
                                    <div className="text-lg md:text-xl text-gray-400 font-medium leading-[1.8] whitespace-pre-line text-justify italic">
                                        {REDACOES_MODELO[selectedRedacao].text}
                                    </div>
                                </div>
                                
                                <div className="space-y-12">
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-30 font-mono flex items-center gap-2">
                                        <div className="w-12 h-[1px] bg-white/20" /> ANÁLISE TÉCNICA
                                    </div>
                                    <div className="space-y-8">
                                        {[
                                            { label: 'INTRODUÇÃO', content: REDACOES_MODELO[selectedRedacao].analysis.intro, color: 'text-primary' },
                                            { label: 'DESENVOLVIMENTO 1', content: REDACOES_MODELO[selectedRedacao].analysis.dev1, color: 'text-secondary' },
                                            { label: 'DESENVOLVIMENTO 2', content: REDACOES_MODELO[selectedRedacao].analysis.dev2, color: 'text-accent' },
                                            { label: 'CONCLUSÃO', content: REDACOES_MODELO[selectedRedacao].analysis.conclusion, color: 'text-success' }
                                        ].map((item, i) => (
                                            <div key={i} className="space-y-3 p-6 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/[0.08] transition-all">
                                                <div className={`text-[10px] font-black uppercase tracking-tighter ${item.color}`}>{item.label}</div>
                                                <div className="text-xs font-bold text-gray-300 italic leading-relaxed">{item.content}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center pb-20">
                            <button 
                                onClick={() => setSelectedRedacao(null)}
                                className="p-4 px-12 glass rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/10"
                            >
                                Voltar à Biblioteca de Modelos
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default RedacoesView;
