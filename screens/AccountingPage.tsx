
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Transaction } from '../App';

const formatCLP = (val: number) => {
  return new Intl.NumberFormat('es-CL', { 
    style: 'currency', 
    currency: 'CLP',
    maximumFractionDigits: 0 
  }).format(val);
};

interface AccountingPageProps {
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
}

const AccountingPage: React.FC<AccountingPageProps> = ({ transactions, addTransaction }) => {
  const navigate = useNavigate();
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newExpense, setNewExpense] = useState({ desc: '', amount: '', cat: 'Insumos' });

  const totalIncome = transactions
    .filter(t => t.type === 'ingreso')
    .reduce((acc, t) => acc + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'egreso')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const handleAddExpense = () => {
    if (!newExpense.desc || !newExpense.amount) return;
    addTransaction({
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      description: newExpense.desc,
      amount: Number(newExpense.amount),
      type: 'egreso',
      category: newExpense.cat
    });
    setNewExpense({ desc: '', amount: '', cat: 'Insumos' });
    setShowExpenseForm(false);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-dark pb-24">
      <header className="p-4 border-b border-white/5 flex justify-between items-center sticky top-0 bg-background-dark z-30 shadow-lg">
        <div className="flex flex-col">
          <h1 className="text-white font-black italic text-xl uppercase tracking-tighter">Finanzas</h1>
          <p className="text-[10px] text-primary font-black uppercase tracking-widest">Caja Apex Garage</p>
        </div>
        <button onClick={() => navigate(-1)} className="size-10 rounded-xl bg-surface-dark border border-white/5 flex items-center justify-center text-white">
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
        {/* Resumen */}
        <div className="grid grid-cols-2 gap-3">
           <div className="bg-surface-dark p-4 rounded-2xl border border-white/5 shadow-md">
              <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Ingresos</p>
              <p className="text-lg font-black text-white italic">{formatCLP(totalIncome)}</p>
           </div>
           <div className="bg-surface-dark p-4 rounded-2xl border border-white/5 shadow-md">
              <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">Egresos</p>
              <p className="text-lg font-black text-white italic">{formatCLP(totalExpenses)}</p>
           </div>
           <div className="col-span-2 carbon-pattern p-6 rounded-[28px] border border-primary/20 flex justify-between items-center shadow-2xl relative overflow-hidden">
              <div className="absolute right-0 bottom-0 p-2 opacity-10">
                 <span className="material-symbols-outlined text-6xl text-white">shield</span>
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-accent-yellow uppercase tracking-[0.2em] mb-1">Balance de Caja</p>
                <p className="text-3xl font-black text-white italic tracking-tighter">{formatCLP(balance)}</p>
              </div>
              <div className="size-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-lg relative z-10">
                <span className="material-symbols-outlined text-3xl font-bold">query_stats</span>
              </div>
           </div>
        </div>

        {/* Botón de Registro */}
        {!showExpenseForm ? (
          <button 
            onClick={() => setShowExpenseForm(true)}
            className="w-full py-4 bg-white text-black rounded-xl font-black uppercase text-[11px] tracking-[0.3em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined font-black">add_circle</span> Registrar Gasto
          </button>
        ) : (
          <div className="bg-surface-dark p-6 rounded-3xl border border-red-500/20 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300 shadow-2xl">
            <h3 className="text-white font-black text-xs uppercase tracking-widest">Nuevo Egreso Técnico</h3>
            <input 
              placeholder="Descripción (ej: Insumos Graphene)" 
              className="w-full bg-black/40 border border-white/5 rounded-xl text-white text-sm p-4 focus:ring-1 focus:ring-red-500 focus:outline-none"
              value={newExpense.desc} onChange={e => setNewExpense({...newExpense, desc: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="number" placeholder="Monto CLP" 
                className="w-full bg-black/40 border border-white/5 rounded-xl text-white text-sm p-4 font-black focus:ring-1 focus:ring-red-500 focus:outline-none"
                value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
              />
              <select 
                className="w-full bg-black/40 border border-white/5 rounded-xl text-white text-[11px] font-black uppercase p-4 focus:ring-1 focus:ring-red-500 focus:outline-none"
                value={newExpense.cat} onChange={e => setNewExpense({...newExpense, cat: e.target.value})}
              >
                <option>Insumos</option>
                <option>Fijos</option>
                <option>Marketing</option>
                <option>Sueldos</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
               <button onClick={handleAddExpense} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-black text-[11px] uppercase shadow-lg shadow-red-600/20">Guardar</button>
               <button onClick={() => setShowExpenseForm(false)} className="flex-1 bg-surface-dark text-slate-400 py-3 rounded-xl font-black text-[11px] uppercase border border-white/5">Cerrar</button>
            </div>
          </div>
        )}

        {/* Listado */}
        <div className="pt-6">
          <div className="flex justify-between items-center mb-5 px-1">
             <h2 className="text-white text-lg font-black italic uppercase tracking-tighter">Historial Financiero</h2>
             <span className="material-symbols-outlined text-primary">history</span>
          </div>
          <div className="space-y-3">
            {transactions.map(t => (
              <div key={t.id} className="bg-surface-dark p-4 rounded-2xl border border-white/5 flex justify-between items-center shadow-md">
                 <div className="flex items-center gap-4">
                    <div className={`size-11 rounded-xl flex items-center justify-center ${t.type === 'ingreso' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                       <span className="material-symbols-outlined font-black">{t.type === 'ingreso' ? 'trending_up' : 'trending_down'}</span>
                    </div>
                    <div>
                       <p className="text-white font-black text-xs uppercase tracking-tighter leading-none mb-1">{t.description}</p>
                       <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest">{t.date} • {t.category}</p>
                    </div>
                 </div>
                 <p className={`font-black italic text-sm tracking-tighter ${t.type === 'ingreso' ? 'text-primary' : 'text-red-500'}`}>
                    {t.type === 'ingreso' ? '+' : '-'}{formatCLP(t.amount)}
                 </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingPage;
