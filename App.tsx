import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

// --- TIPOS ---
// Added description field as it is used in TrackingPage
export interface JobStep { id: string; name: string; completed: boolean; icon: string; description?: string; }
// Added customerId as it is used to map customers in DashboardPage
export interface Job { id: string; customer: string; car: string; bay: string; steps: JobStep[]; customerId?: string; }
// Expanded Product with category, type and barcode for ServiceManagementPage
export interface Product { 
  id: string; 
  name: string; 
  price: number; 
  icon: string; 
  category?: string;
  type?: 'servicio' | 'producto';
  barcode?: string;
}
// Exported missing Customer interface used in multiple screens
export interface Customer { id: string; name: string; car: string; }
// Exported missing Transaction interface used in AccountingPage and POSPage
export interface Transaction { id: string; date: string; description: string; amount: number; type: string; category: string; }

// --- DATOS INICIALES ---
const INITIAL_JOBS: Job[] = [
  {
    id: 'j1', customer: 'Carlos Slim', car: 'Ferrari 488 Pista', bay: 'Bahía 01',
    steps: [
      { id: '1', name: 'Lavado Detallado', completed: true, icon: 'water_drop' },
      { id: '2', name: 'Descontaminado Clay', completed: true, icon: 'texture' },
      { id: '3', name: 'Corrección de Pintura', completed: false, icon: 'flare' },
      { id: '4', name: 'Sellado Cerámico', completed: false, icon: 'shield' }
    ]
  }
];

const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Cerámico 9H', price: 350000, icon: 'shield' },
  { id: 'p2', name: 'Pulido Espejo', price: 180000, icon: 'flare' },
  { id: 'p3', name: 'Interior Leather', price: 85000, icon: 'airline_seat_recline_extra' }
];

// --- COMPONENTES DE PANTALLA ---

const Dashboard = ({ jobs }: { jobs: Job[] }) => {
  const navigate = useNavigate();
  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center py-2">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Apex Garage</h1>
          <span className="text-[9px] font-black uppercase text-primary tracking-[0.3em]">Performance Terminal</span>
        </div>
        <div className="size-10 bg-surface-dark border border-white/5 rounded-full flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">settings</span>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Bahías Activas</h2>
        {jobs.map(job => (
          <div key={job.id} onClick={() => navigate(`/tracking/${job.id}`)} className="carbon-pattern rounded-3xl p-5 border border-white/5 active:scale-95 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-accent-yellow text-[9px] font-black uppercase">{job.bay}</p>
                <h3 className="text-lg font-black italic uppercase tracking-tighter">{job.car}</h3>
                <p className="text-slate-400 text-[10px] font-bold">{job.customer}</p>
              </div>
              <span className="bg-primary/20 text-primary text-[8px] font-black px-2 py-1 rounded border border-primary/30 uppercase">En Proceso</span>
            </div>
            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-1000" style={{ width: '45%' }}></div>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-dark p-5 rounded-3xl border border-white/5">
          <span className="material-symbols-outlined text-primary mb-2">trending_up</span>
          <p className="text-[9px] font-black uppercase text-slate-500">Ventas Hoy</p>
          <p className="text-lg font-black italic">$1.2M</p>
        </div>
        <div className="bg-surface-dark p-5 rounded-3xl border border-white/5">
          <span className="material-symbols-outlined text-accent-yellow mb-2">star</span>
          <p className="text-[9px] font-black uppercase text-slate-500">Rating</p>
          <p className="text-lg font-black italic">4.9/5</p>
        </div>
      </div>
    </div>
  );
};

const POS = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const total = cart.reduce((acc, p) => acc + p.price, 0);

  return (
    <div className="p-4 flex flex-col h-[calc(100vh-80px)]">
      <h2 className="text-xl font-black italic uppercase tracking-tighter mb-6">Nueva Venta</h2>
      <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
        {PRODUCTS.map(p => {
          const inCart = cart.some(i => i.id === p.id);
          return (
            <button key={p.id} onClick={() => inCart ? setCart(cart.filter(i=>i.id!==p.id)) : setCart([...cart, p])}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${inCart ? 'bg-primary/10 border-primary/50' : 'bg-surface-dark border-white/5'}`}>
              <span className={`material-symbols-outlined p-2 rounded-xl ${inCart ? 'bg-primary text-white' : 'bg-black/20 text-slate-500'}`}>{p.icon}</span>
              <div className="text-left flex-1">
                <p className="text-xs font-black uppercase">{p.name}</p>
                <p className="text-primary font-black italic">${p.price.toLocaleString('es-CL')}</p>
              </div>
            </button>
          );
        })}
      </div>
      <div className="bg-surface-dark p-6 rounded-3xl border border-white/10 mt-4 space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black uppercase text-slate-500">Subtotal</span>
          <span className="text-2xl font-black italic">${total.toLocaleString('es-CL')}</span>
        </div>
        <button className="w-full bg-primary py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20">Procesar Pago</button>
      </div>
    </div>
  );
};

const Tracking = ({ jobs, setJobs }: { jobs: Job[], setJobs: any }) => {
  const { jobId } = useParams();
  const job = jobs.find(j => j.id === jobId);
  if (!job) return <div className="p-10 text-center">No encontrado</div>;

  const toggle = (stepId: string) => {
    setJobs(jobs.map(j => j.id === jobId ? { ...j, steps: j.steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s) } : j));
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-black italic uppercase tracking-tighter">{job.car}</h2>
      <div className="space-y-3">
        {job.steps.map(s => (
          <button key={s.id} onClick={() => toggle(s.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${s.completed ? 'bg-primary/10 border-primary/30 opacity-100' : 'bg-surface-dark border-white/5 opacity-50'}`}>
            <span className="material-symbols-outlined">{s.completed ? 'check_circle' : s.icon}</span>
            <span className="text-xs font-black uppercase">{s.name}</span>
          </button>
        ))}
      </div>
      <div className="p-4 bg-surface-dark rounded-2xl border border-white/5 text-center">
        <button className="bg-[#25D366] text-white w-full py-3 rounded-xl font-black uppercase text-[10px]">Notificar por WhatsApp</button>
      </div>
    </div>
  );
};

const Advisor = () => {
  const [messages, setMessages] = useState([{ text: "Terminal Apex activa. ¿Duda técnica?", sender: 'ai' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const text = input;
    setInput('');
    setMessages([...messages, { text, sender: 'user' }]);
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text }] }],
        config: { systemInstruction: "Eres el experto en detailing de Apex Garage. Responde breve y técnico." }
      });
      setMessages(prev => [...prev, { text: res.text || "Error", sender: 'ai' }]);
    } catch {
      setMessages(prev => [...prev, { text: "Error de IA", sender: 'ai' }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${m.sender === 'user' ? 'bg-primary' : 'bg-surface-dark border border-white/5'}`}>{m.text}</div>
          </div>
        ))}
      </div>
      <div className="p-4 flex gap-2">
        <input className="flex-1 bg-surface-dark border border-white/10 rounded-xl px-4 text-sm focus:ring-1 focus:ring-primary outline-none" 
               placeholder="Consulta técnica..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} />
        <button onClick={send} className="size-10 bg-primary rounded-xl flex items-center justify-center"><span className="material-symbols-outlined">send</span></button>
      </div>
    </div>
  );
};

// --- APP MAIN ---

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background-dark max-w-md mx-auto relative pb-20 shadow-2xl border-x border-white/5">
      <Routes>
        <Route path="/" element={<Dashboard jobs={jobs} />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/tracking/:jobId" element={<Tracking jobs={jobs} setJobs={setJobs} />} />
        <Route path="/advisor" element={<Advisor />} />
      </Routes>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-background-dark/90 backdrop-blur-lg border-t border-white/5 p-4 flex justify-around items-center z-50">
        <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname==='/'?'text-primary':'text-slate-500'}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[8px] font-black uppercase">Inicio</span>
        </Link>
        <Link to="/pos" className={`flex flex-col items-center gap-1 ${location.pathname==='/pos'?'text-primary':'text-slate-500'}`}>
          <span className="material-symbols-outlined">payments</span>
          <span className="text-[8px] font-black uppercase">Ventas</span>
        </Link>
        <Link to="/advisor" className={`flex flex-col items-center gap-1 ${location.pathname==='/advisor'?'text-primary':'text-slate-500'}`}>
          <span className="material-symbols-outlined">auto_awesome</span>
          <span className="text-[8px] font-black uppercase">Asesor</span>
        </Link>
      </nav>
    </div>
  );
};

export default App;