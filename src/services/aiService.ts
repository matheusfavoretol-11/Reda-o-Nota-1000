export const correctEssay = async (text: string) => {
  if (!text.trim()) return "Ei, cadê o texto? Não dá pra corrigir o vácuo! 💨";
  
  try {
    const res = await fetch("/api/correct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Erro na resposta do servidor");
    }

    const data = await res.json();
    return data.feedback || "Ih, deu branco na Malu aqui. Tenta mandar de novo!";
  } catch (error: any) {
    console.error("Erro na Malu IA:", error);
    
    if (error.message?.includes("API key not valid") || error.message?.includes("400")) {
      return "Eita! A chave de API no servidor parece inválida. Dá uma olhada nas configurações!";
    }
    
    return "Eita! O servidor da Malu deu um teto preto. Tenta daqui a pouco. Erro: " + (error.message || "Desconhecido");
  }
};
