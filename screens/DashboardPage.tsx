import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Customer, Job } from '../App.tsx';

interface DashboardProps {
  customers: Customer[];
  jobs: Job[];
}

const DashboardPage: React.FC<DashboardProps> = ({ customers, jobs }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center py-2">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Apex Garage</h1>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Performance Terminal</p>
        </div>
        <div className="size-10 rounded-full bg-surface-dark border border-white/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">settings</span>
        </div>
      </header>

      <div className="space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">En Servicio</h2>
        {jobs.map(job => {
          const customer = customers.find(c => c.id === job.customerId);
          const progress = Math.round((job.steps.filter(s => s.completed).length / job.steps.length) * 100);
          return (
            <div key={job.id} onClick={() => navigate(`/tracking/${job.id}`)} className="carbon-pattern rounded-3xl p-5 border border-white/5 active:scale-[0.98] transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-accent-yellow text-[9px] font-black uppercase tracking-widest">{job.bay}</p>
                  <h3 className="text-lg font-black italic uppercase tracking-tighter mt-1">{customer?.car}</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{customer?.name}</p>
                </div>
                <div className="bg-primary/20 text-primary text-[8px] font-black px-2 py-1 rounded border border-primary/30 uppercase">Activo</div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="text-slate-500">Progreso Técnico</span>
                  <span className="text-primary">{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-dark p-4 rounded-2xl border border-white/5">
          <span className="material-symbols-outlined text-primary text-xl mb-2">trending_up</span>
          <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Eficiencia</p>
          <p className="text-lg font-black italic mt-1">94%</p>
        </div>
        <div className="bg-surface-dark p-4 rounded-2xl border border-white/5">
          <span className="material-symbols-outlined text-accent-yellow text-xl mb-2">star</span>
          <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Satisfacción</p>
          <p className="text-lg font-black italic mt-1">4.9</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;