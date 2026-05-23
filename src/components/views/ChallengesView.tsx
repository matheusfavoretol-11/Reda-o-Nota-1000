import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Clock, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { toast } from 'sonner';
import { CHALLENGES_DATA } from '../../data/constants';
import { correctEssay } from '../../services/geminiService';

const ChallengesView = () => {
    const [level, setLevel] = useState<'iniciante' | 'intermediario' | 'avancado'>('iniciante');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [answer, setAnswer] = useState("");
    const [showGabarito, setShowGabarito] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [loadingFeedback, setLoadingFeedback] = useState(false);

    const activeChallenge = (CHALLENGES_DATA as any)[level]?.find((c: any) => c.id === selectedId);

    useEffect(() => {
        if (typeof window !== 'undefined' && selectedId) {
            setAnswer(localStorage.getItem(`red1000_challenge_${selectedId}_answer`) || "");
            setFeedback(localStorage.getItem(`red1000_challenge_${selectedId}_feedback`) || null);
            setShowGabarito(localStorage.getItem(`red1000_challenge_${selectedId}_gabarito`) === 'true');
        } else {
            setAnswer("");
            setFeedback(null);
            setShowGabarito(false);
        }
    }, [selectedId]);

    const handleAnswerChange = (value: string) => {
        setAnswer(value);
        if (typeof window !== 'undefined' && selectedId) {
            localStorage.setItem(`red1000_challenge_${selectedId}_answer`, value);
        }
    };

    const handleFeedback = async () => {
        if (!answer.trim()) return;
        setLoadingFeedback(true);
        try {
            const prompt = `Você é um TREINADOR DE REDAÇÃO. Avalie o seguinte exercício prático do aluno.
            Nível: ${level}
            Desafio: ${activeChallenge?.title}
            Tema: ${activeChallenge?.theme}
            Tarefa: ${activeChallenge?.task}
            Resposta do Aluno: "${answer}"
            
            Compare com os critérios: ${activeChallenge?.criteria.join(', ')}.
            Dê uma nota de 0 a 1000 baseada na qualidade e forneça um feedback construtivo (Pontos Fortes, O que melhorar, Dica de Ouro).`;
            
            const result = await correctEssay(prompt);
            setFeedback(result);
            setShowGabarito(true);
            if (typeof window !== 'undefined' && selectedId) {
                localStorage.setItem(`red1000_challenge_${selectedId}_feedback`, result);
                localStorage.setItem(`red1000_challenge_${selectedId}_gabarito`, 'true');
            }
        } catch (e) {
            toast.error("Erro ao gerar feedback.");
        } finally {
            setLoadingFeedback(false);
        }
    }

    const handleClearChallenge = () => {
        if (typeof window !== 'undefined' && selectedId) {
            localStorage.removeItem(`red1000_challenge_${selectedId}_answer`);
            localStorage.removeItem(`red1000_challenge_${selectedId}_feedback`);
            localStorage.removeItem(`red1000_challenge_${selectedId}_gabarito`);
        }
        setSelectedId(null);
        setAnswer("");
        setShowGabarito(false);
        setFeedback(null);
    };

    if (selectedId && activeChallenge) {
        return (
            <div className="max-w-4xl mx-auto space-y-12 mt-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <button 
                  onClick={() => setSelectedId(null)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 mb-8"
                >
                    <ArrowRight className="rotate-180" size={14} /> Voltar aos Desafios
                </button>

                <div className="glass p-12 rounded-[64px] border-white/5 space-y-10">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <span className="p-2 bg-primary/10 text-primary text-[9px] font-black uppercase rounded-lg border border-primary/20">{activeChallenge.type}</span>
                         <span className="text-[10px] font-black uppercase opacity-30 flex items-center gap-1"><Clock size={12} /> {activeChallenge.time}</span>
                      </div>
                      <h2 className="text-4xl font-display font-black italic tracking-tighter">{activeChallenge.title}</h2>
                      <div className="p-6 bg-white/5 rounded-3xl border border-white/5 shadow-inner">
                         <div className="text-[10px] font-black uppercase opacity-30 mb-2 font-mono">🎯 O DESAFIO:</div>
                         <p className="text-xl font-bold leading-tight">{activeChallenge.theme}</p>
                         <p className="mt-4 text-gray-400 font-medium">{activeChallenge.task}</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="flex justify-between items-center px-4">
                         <div className="text-[10px] font-black uppercase tracking-widest opacity-30">Sua Resposta:</div>
                         {answer && (
                            <button 
                               onClick={handleClearChallenge}
                               className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                            >
                               [ Limpar Resposta ]
                            </button>
                         )}
                      </div>
                      <textarea 
                        className="w-full bg-[#0A0A0F] border border-white/10 rounded-[32px] p-8 text-sm font-medium focus:outline-none focus:border-primary/50 transition-all min-h-[250px] resize-none shadow-2xl"
                        placeholder="Escreva sua resposta aqui..."
                        value={answer}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        disabled={showGabarito}
                      />
                      
                      {!showGabarito ? (
                        <button 
                            disabled={!answer.trim() || loadingFeedback}
                            onClick={handleFeedback}
                            className="w-full bg-primary py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-20 flex items-center justify-center gap-3"
                        >
                            {loadingFeedback ? <RefreshCw className="animate-spin" size={16} /> : "ENVIAR PARA AVALIAÇÃO"}
                        </button>
                      ) : (
                        <div className="space-y-12 py-10 border-t border-white/5">
                           {feedback && (
                             <div className="p-10 glass rounded-[48px] border-primary/20 bg-primary/5">
                                <h3 className="text-2xl font-display font-black italic mb-6 text-primary flex items-center gap-3">
                                   <Zap size={24} /> Feedback da Malu IA
                                </h3>
                                <div className="markdown-body">
                                   <Markdown>{feedback}</Markdown>
                                </div>
                             </div>
                           )}

                           <div className="space-y-10">
                              <h3 className="text-2xl font-display font-black italic mb-6 flex items-center gap-3">
                                 <CheckCircle2 size={24} className="text-success" /> Gabarito Comentado
                              </h3>
                              
                              <div className="grid gap-6">
                                 {activeChallenge.gabarito.examples.map((ex: any, i: number) => (
                                   <div key={i} className="p-8 glass rounded-[32px] border-white/5 bg-white/[0.02]">
                                      <h4 className="text-lg font-bold mb-4 italic text-success">{ex.title}</h4>
                                      <p className="text-sm italic text-gray-400 mb-6 bg-white/5 p-6 rounded-2xl">"{ex.text}"</p>
                                      <p className="text-xs font-medium border-l-2 border-success pl-4">{ex.analysis}</p>
                                   </div>
                                 ))}
                              </div>

                              <div className="p-8 glass rounded-[32px] border-white/5 bg-white/[0.01]">
                                 <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">💡 LIÇÕES DESSE EXERCÍCIO</h4>
                                 <p className="text-sm font-medium text-gray-400 italic">"{activeChallenge.gabarito.lessons}"</p>
                              </div>

                              <div className="flex justify-between items-center pt-8 border-t border-white/5">
                                 <div className="text-[10px] font-black uppercase text-accent">PRÓXIMO PASSO: {activeChallenge.gabarito.next}</div>
                                 <button 
                                    onClick={() => setSelectedId(null)}
                                    className="p-4 px-10 glass rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/10"
                                 >
                                    Fazer Outro Desafio
                                 </button>
                              </div>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-12 mt-12 mb-20 animate-in fade-in duration-500">
            <div className="flex flex-wrap gap-4 mb-12 bg-white/5 p-2 rounded-full w-fit mx-auto border border-white/5">
               {[
                  { id: 'iniciante', label: 'Iniciante' },
                  { id: 'intermediario', label: 'Intermediário' },
                  { id: 'avancado', label: 'Avançado' }
               ].map((lvl) => (
                  <button 
                     key={lvl.id}
                     onClick={() => setLevel(lvl.id as any)}
                     className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${level === lvl.id ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'opacity-60 hover:opacity-100 hover:bg-white/5'}`}
                  >
                     {lvl.label}
                  </button>
               ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {(CHALLENGES_DATA as any)[level].map((challenge: any, i: number) => (
                  <motion.div 
                     key={challenge.id}
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     whileHover={{ y: -10 }}
                     className="glass p-8 rounded-[48px] border-white/5 hover:border-primary/20 transition-all flex flex-col justify-between group h-[400px]"
                  >
                     <div className="space-y-6">
                        <div className="flex justify-between items-start">
                           <span className="p-2 bg-white/5 text-[9px] font-black uppercase rounded-lg border border-white/10 opacity-40">{challenge.type}</span>
                           <span className="text-[10px] font-black uppercase opacity-20 flex items-center gap-1 font-mono tracking-tighter">
                              <Clock size={12} /> {challenge.time}
                           </span>
                        </div>
                        <h3 className="text-2xl font-display font-black italic tracking-tighter leading-[1] group-hover:text-primary transition-colors">{challenge.title}</h3>
                        <p className="text-gray-400 text-xs font-semibold leading-relaxed line-clamp-3">Tema: {challenge.theme}</p>
                     </div>
                     
                     <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
                        <div className="text-[10px] font-black uppercase opacity-30 tracking-widest font-mono">Foco: {challenge.competence}</div>
                        <button 
                           onClick={() => setSelectedId(challenge.id)}
                           className="w-full p-4 glass rounded-2xl bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-2"
                        >
                           Iniciar Desafio <ArrowRight size={14} />
                        </button>
                     </div>
                  </motion.div>
               ))}
            </div>
        </div>
    )
}

export default ChallengesView;
