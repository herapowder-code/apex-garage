
import { GoogleGenAI } from "@google/genai";

// El shim en index.html asegura que process.env.API_KEY exista como string vacío si no está configurado
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getCarAdvice = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: "Eres un asesor experto de Apex Detailing, un estudio boutique de detallado automotriz especializado en corrección de pintura, recubrimientos cerámicos y protección de autos de lujo. Responde en español latino, con un tono sofisticado, técnico y enfocado en la perfección estética y preservación del valor del vehículo.",
      },
    });
    return response.text || "Lo siento, no pude procesar tu consulta en este momento.";
  } catch (error) {
    console.error("Error fetching Gemini advice:", error);
    return "Error al conectar con el Asesor Virtual. Por favor, intenta más tarde.";
  }
};
