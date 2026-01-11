import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

const AdvisorPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([{ text: "Terminal Apex activa. ¿Qué consulta técnica tienes sobre detailing o performance?", sender: 'ai' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  const askGemini = async (query: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: query }] }],
        config: {
          systemInstruction: "Eres el Asesor Maestro de Apex Garage. Responde en español latino con un tono sofisticado y técnico. Eres experto en nanotecnología cerámica, corrección de pintura y mantenimiento boutique.",
        },
      });
      return response.text || "No hay respuesta disponible.";
    } catch (e) {
      return "Error en el núcleo de IA.";
    }
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { text: userText, sender: 'user' }]);
    setLoading(true);
    const res = await askGemini(userText);
    setMessages(prev => [...prev, { text: res, sender: 'ai' }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <header className="p-4 border-b border-white/5 flex items-center gap-4 bg-background-dark/80 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="material-symbols-outlined">arrow_back_ios</button>
        <h2 className="font-black italic uppercase tracking-tighter">Asesor Maestro</h2>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${m.sender === 'user' ? 'bg-primary text-white' : 'bg-surface-dark text-slate-200 border border-white/5'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="p-2 animate-pulse text-[10px] text-primary font-black uppercase">Procesando...</div>}
        <div ref={endRef} />
      </div>

      <div className="p-4 bg-background-dark border-t border-white/5 mb-20">
        <div className="flex gap-2 bg-surface-dark p-1.5 rounded-2xl border border-white/10">
          <input 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3"
            placeholder="Consulta técnica..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
          />
          <button onClick={send} className="size-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvisorPage;