
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCarAdvice } from '../services/geminiService';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

const AdvisorPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hola, soy tu Asesor Virtual de Apex Garage. ¿En qué puedo ayudarte hoy con tu Porsche?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setIsLoading(true);

    const aiResponse = await getCarAdvice(userMsg);
    setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden">
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between z-10 sticky top-0 border-b border-slate-200 dark:border-slate-800">
        <div onClick={() => navigate(-1)} className="text-slate-800 dark:text-white flex size-12 shrink-0 items-center justify-start cursor-pointer">
          <span className="material-symbols-outlined">chevron_left</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Asesor Virtual</h2>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
            <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Potenciado por Gemini
          </span>
        </div>
        <div className="w-12"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              m.sender === 'user' 
                ? 'bg-primary text-white rounded-tr-none shadow-lg' 
                : 'bg-white dark:bg-surface-dark text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-tl-none shadow-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-surface-dark p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-800">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white/50 dark:bg-background-dark/50 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 mb-20">
        <div className="flex items-center gap-2 bg-white dark:bg-surface-dark rounded-full p-1.5 border border-slate-200 dark:border-slate-800 shadow-inner">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pregunta sobre mantenimiento..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 dark:text-white"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="flex size-10 items-center justify-center rounded-full bg-primary text-white disabled:opacity-50 transition-opacity"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
        <p className="text-[9px] text-center text-slate-500 mt-2 uppercase tracking-tighter">Consejos basados en IA • Consulta a un técnico para decisiones críticas</p>
      </div>
    </div>
  );
};

export default AdvisorPage;
