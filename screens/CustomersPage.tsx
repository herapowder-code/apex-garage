import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Customer } from '../App.tsx';

interface CustomersProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const CustomersPage: React.FC<CustomersProps> = ({ customers }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-xl font-black italic uppercase tracking-tighter">Miembros VIP</h2>
        <button onClick={() => navigate('/')} className="material-symbols-outlined">close</button>
      </header>

      <div className="space-y-3">
        {customers.map(c => (
          <div key={c.id} className="bg-surface-dark p-5 rounded-2xl border border-white/5 flex justify-between items-center active:bg-primary/5 transition-all">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <h4 className="font-black uppercase italic tracking-tighter text-sm">{c.name}</h4>
                <p className="text-[9px] font-black text-accent-yellow uppercase tracking-widest">{c.car}</p>
              </div>
            </div>
            <button className="size-8 rounded bg-background-dark flex items-center justify-center text-slate-500">
              <span className="material-symbols-outlined text-lg">message</span>
            </button>
          </div>
        ))}
      </div>

      <button className="w-full py-4 bg-surface-dark border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500">
        Registrar Nuevo Cliente
      </button>
    </div>
  );
};

export default CustomersPage;