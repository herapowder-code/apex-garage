import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Transaction } from '../App.tsx';

interface AccountingProps {
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
}

const AccountingPage: React.FC<AccountingProps> = ({ transactions }) => {
  const navigate = useNavigate();
  const balance = transactions.filter(t => t.type === 'ingreso').reduce((a, b) => a + b.amount, 0);

  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-xl font-black italic uppercase tracking-tighter">Caja Terminal</h2>
        <button onClick={() => navigate('/')} className="material-symbols-outlined">close</button>
      </header>

      <div className="carbon-pattern p-8 rounded-[32px] border border-primary/20 text-center relative overflow-hidden shadow-inner">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-yellow mb-2">Ingresos Hoy</p>
        <p className="text-4xl font-black italic">${balance.toLocaleString('es-CL')}</p>
        <div className="absolute -right-4 -bottom-4 opacity-5">
           <span className="material-symbols-outlined text-8xl">payments</span>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Movimientos</h3>
        {transactions.map(t => (
          <div key={t.id} className="bg-surface-dark p-4 rounded-2xl border border-white/5 flex justify-between items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-tighter mb-1">{t.description}</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{t.date}</p>
            </div>
            <p className="font-black italic text-primary">+${t.amount.toLocaleString('es-CL')}</p>
          </div>
        ))}
        {transactions.length === 0 && <p className="text-center text-slate-500 text-[10px] py-20 font-black uppercase tracking-[0.2em]">Sin Operaciones</p>}
      </div>
    </div>
  );
};

export default AccountingPage;