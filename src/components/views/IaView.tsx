import React, { useState } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import Markdown from 'react-markdown';
import { correctEssay } from '../../services/geminiService';

const IaView = () => {
    const [essay, setEssay] = useState("");
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCorrect = async () => {
        if (!essay.trim()) return;
        setLoading(true);
        setResult(null);
        try {
            const feedback = await correctEssay(essay);
            setResult(feedback);
        } catch (e) {
            setResult("Eita! Ocorreu um erro. Tenta de novo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 mt-12 mb-20 pb-20">
            <div className="glass rounded-[64px] border-white/5 p-2 shadow-2xl overflow-hidden">
                <div className="bg-[#0A0A0F] rounded-[62px] min-h-[600px] flex flex-col border border-white/10">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-3xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                                <Sparkles size={24} className="text-white" />
                            </div>
                            <div className="text-left">
                                <div className="text-xs font-black uppercase">Malu AI Corretora</div>
                                <div className="text-[10px] font-mono opacity-30 text-success">ONLINE E PRONTA</div>
                            </div>
                        </div>
                        {result && (
                            <button 
                                onClick={() => {setResult(null); setEssay("");}}
                                className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                            >
                                [ Limpar Tudo ]
                            </button>
                        )}
                    </div>
                    
                    {!result ? (
                        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-8 min-h-[500px]">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-5xl">📄</div>
                            <h3 className="text-3xl font-display font-black italic tracking-tighter">Pronto para a correção?</h3>
                            <p className="text-gray-400 font-medium max-w-sm">Para uma análise precisa, cole seu texto abaixo. A Malu vai ler tudo e te falar a real.</p>
                            
                            <div className="w-full max-w-2xl space-y-4">
                                <textarea 
                                    className="w-full bg-white/5 border border-white/10 rounded-[32px] p-8 text-sm font-medium focus:outline-none focus:border-primary/50 transition-all min-h-[300px] resize-none"
                                    placeholder="Digite ou cole sua redação completa aqui..."
                                    value={essay}
                                    onChange={(e) => setEssay(e.target.value)}
                                />
                                <button 
                                    onClick={handleCorrect}
                                    disabled={loading || !essay.trim()}
                                    className="w-full bg-primary py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ANALISANDO...
                                        </>
                                    ) : "SOLTAR O VEREDITO"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 p-8 md:p-12 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <div className="max-w-2xl mx-auto markdown-body">
                                <Markdown>{result}</Markdown>
                            </div>
                            <div className="mt-12 flex justify-center pb-8">
                                <button 
                                    onClick={() => setResult(null)}
                                    className="p-4 px-10 glass rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/10"
                                >
                                    Fazer Outra Correção
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 opacity-40">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Baseado no Manual do Candidato</span>
                </div>
                <div className="flex items-center gap-2">
                    <Sparkles size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Correção via Gemini 1.5 Flash</span>
                </div>
            </div>
        </div>
    )
}

export default IaView;
