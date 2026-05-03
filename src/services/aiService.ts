import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const correctEssay = async (text: string) => {
  if (!text.trim()) return "Ei, cadê o texto? Não dá pra corrigir o vácuo! 💨";

  const systemInstruction = `Você é a Malu, uma especialista em correção de redação do ENEM.
Seu estilo é ÚNICO: você é extremamente engraçada, descontraída, usa gírias modernas, mas na hora de corrigir, você é CIRÚRGICA e CORRETA.

Diretrizes:
1. Analise o texto com base nas 5 competências do ENEM.
2. Dê uma nota aproximada (0-1000).
3. Faça apontamentos sobre erros de gramática, tese fraca, falta de repertório ou conclusão incompleta.
4. Use um tom de "melhor amiga sincerona" ou "professora gente boa que não aguenta mais ver erro bobo".
5. Seja motivadora no final, mas não passe a mão na cabeça se o texto estiver ruim.

Formato da resposta:
- Comece com uma reação inicial engraçada ao texto.
- Use seções claras (mas com nomes divertidos) para cada competência.
- Termine com um "Veredito da Malu" (Nota e Plano de Ação).

Lembre-se: O foco é ajudar o aluno a chegar no 1000, mas fazendo ele rir (da própria desgraça ou do seu humor) durante o processo.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: text,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    return response.text || "Ih, deu branco na Malu aqui. Tenta mandar de novo!";
  } catch (error) {
    console.error("Erro na Malu IA:", error);
    return "Eita! O servidor da Malu deu um teto preto. Tenta daqui a pouco, deve ser o sinal da faculdade...";
  }
};
