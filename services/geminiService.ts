import { GoogleGenAI } from "@google/genai";

export const getCarAdvice = async (query: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: query }] }],
      config: {
        systemInstruction: "Eres el Asesor Maestro de Apex Garage. Responde en español latino con un tono sofisticado, técnico y profesional. Eres experto en corrección de pintura, nanotecnología cerámica, PPF y mantenimiento de motores de alto desempeño.",
      },
    });
    return response.text || "No pude procesar tu consulta. Intenta nuevamente.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error de conexión con el núcleo de IA.";
  }
};