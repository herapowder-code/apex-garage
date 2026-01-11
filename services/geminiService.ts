
import { GoogleGenAI } from "@google/genai";

const getAIInstance = () => {
  const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || "";
  return new GoogleGenAI({ apiKey });
};

export const getCarAdvice = async (query: string): Promise<string> => {
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: query }] }],
      config: {
        systemInstruction: "Eres un asesor experto de Apex Detailing, un estudio boutique de detallado automotriz. Responde en español latino, con un tono sofisticado y técnico. Eres experto en corrección de pintura, sellados cerámicos (Graphene, Cerámicos 9H), limpieza de interiores y mantenimiento de motores. Tu objetivo es educar al cliente sobre el valor de los servicios premium.",
      },
    });
    return response.text || "Lo siento, no pude procesar tu consulta en este momento.";
  } catch (error) {
    console.error("Error fetching Gemini advice:", error);
    return "Ocurrió un error al conectar con el servidor de inteligencia artificial. Verifica tu conexión.";
  }
};
