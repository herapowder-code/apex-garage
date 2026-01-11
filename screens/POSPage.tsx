import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, Transaction } from '../App.tsx';

interface POSProps {
  products: Product[];
  addTransaction: (t: Transaction) => void;
}

const POSPage: React.FC<POSProps> = ({ products, addTransaction }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<{ p: Product; q: number }[]>([]);

  const total = cart.reduce((acc, item) => acc + (item.p.price * item.q), 0);

  const toggleProduct = (p: Product) => {
    setCart(prev => {
      const exists = prev.find(i => i.p.id === p.id);
      if (exists) return prev.filter(i => i.p.id !== p.id);
      return [...prev, { p, q: 1 }];
    });
  };

  const finish = () => {
    if (cart.length === 0) return;
    addTransaction({
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString(),
      description: `Terminal Apex: ${cart.map(i => i.p.name).join(', ')}`,
      amount: total,
      type: 'ingreso',
      category: 'Ventas'
    });
    navigate('/accounting');
  };

  return (
    <div className="p-4 flex flex-col h-screen">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black italic uppercase tracking-tighter">Nueva Venta</h2>
        <button onClick={() => navigate(-1)} className="material-symbols-outlined">close</button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
        {products.map(p => {
          const inCart = cart.some(i => i.p.id === p.id);
          return (
            <button 
              key={p.id} 
              onClick={() => toggleProduct(p)} 
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${inCart ? 'bg-primary/10 border-primary/50' : 'bg-surface-dark border-white/5'}`}
            >
              <div className={`size-12 rounded-xl flex items-center justify-center ${inCart ? 'bg-primary text-white' : 'bg-black/20 text-slate-500'}`}>
                <span className="material-symbols-outlined">{p.icon}</span>
              </div>
              <div className="text-left flex-1">
                <p className="text-xs font-black uppercase tracking-tighter">{p.name}</p>
                <p className="text-primary font-black italic mt-1 text-sm">${p.price.toLocaleString('es-CL')}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-surface-dark p-6 rounded-3xl border border-white/10 mt-4 mb-20 space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Terminal</span>
          <span className="text-2xl font-black italic">${total.toLocaleString('es-CL')}</span>
        </div>
        <button onClick={finish} disabled={cart.length === 0} className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 disabled:opacity-50">
          Procesar Pago
        </button>
      </div>
    </div>
  );
};

export default POSPage;