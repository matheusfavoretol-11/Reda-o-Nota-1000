/**
 * Service to handle Gemini AI operations via the backend proxy.
 */

export async function correctEssay(text: string): Promise<string> {
    try {
        const response = await fetch('/api/correct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Falha na comunicação com a Malu.');
        }

        const data = await response.json();
        return data.feedback;
    } catch (error: any) {
        console.error("Gemini Service Error:", error);
        throw error;
    }
}
