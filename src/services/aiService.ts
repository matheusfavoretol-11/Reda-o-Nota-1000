export const correctEssay = async (text: string) => {
  if (!text.trim()) return "Ei, cadê o texto? Não dá pra corrigir o vácuo! 💨";

  try {
    const res = await fetch("/api/correct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) throw new Error("Erro na resposta do servidor");

    const data = await res.json();
    return data.feedback || "Ih, deu branco na Malu aqui. Tenta mandar de novo!";
  } catch (error) {
    console.error("Erro na Malu IA:", error);
    return "Eita! O servidor da Malu deu um teto preto. Tenta daqui a pouco, deve ser o sinal da faculdade...";
  }
};
