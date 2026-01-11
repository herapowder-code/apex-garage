import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Job, Customer } from '../App.tsx';

interface TrackingProps {
  jobs: Job[];
  customers: Customer[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
}

const TrackingPage: React.FC<TrackingProps> = ({ jobs, customers, setJobs }) => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const job = jobs.find(j => j.id === jobId);
  const customer = customers.find(c => c.id === job?.customerId);

  if (!job) return <div className="p-10 text-center">Orden no encontrada</div>;

  const toggle = (stepId: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return { ...j, steps: j.steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s) };
      }
      return j;
    }));
  };

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="material-symbols-outlined">arrow_back_ios</button>
        <div>
          <h2 className="text-xl font-black italic uppercase tracking-tighter">{customer?.car}</h2>
          <p className="text-accent-yellow text-[9px] font-black uppercase tracking-widest">{job.bay}</p>
        </div>
      </header>

      <div className="space-y-4">
        {job.steps.map(step => (
          <button 
            key={step.id} 
            onClick={() => toggle(step.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${step.completed ? 'bg-primary/10 border-primary/30' : 'bg-surface-dark border-white/5 opacity-60'}`}
          >
            <div className={`size-10 rounded-xl flex items-center justify-center ${step.completed ? 'bg-primary text-white' : 'bg-black/20 text-slate-500'}`}>
              <span className="material-symbols-outlined">{step.completed ? 'check' : step.icon}</span>
            </div>
            <div>
              <p className={`text-xs font-black uppercase tracking-tighter ${step.completed ? 'text-primary' : 'text-white'}`}>{step.name}</p>
              <p className="text-[10px] text-slate-500 font-medium">{step.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="p-6 bg-surface-dark rounded-3xl border border-white/5 text-center">
        <button className="bg-[#25D366] text-white w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
          Enviar Update por WhatsApp
        </button>
      </div>
    </div>
  );
};

export default TrackingPage;