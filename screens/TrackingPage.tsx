
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Customer, Job } from '../App';

interface TrackingPageProps {
  customers: Customer[];
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
}

const TrackingPage: React.FC<TrackingPageProps> = ({ customers, jobs, setJobs }) => {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const job = jobs.find(j => j.id === jobId);
  const customer = customers.find(c => c.id === job?.customerId);

  if (!job || !customer) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background-dark p-8 text-center">
        <span className="material-symbols-outlined text-6xl text-slate-700 mb-4">search_off</span>
        <h2 className="text-white font-black italic text-xl uppercase tracking-tighter">Orden no encontrada</h2>
        <button onClick={() => navigate('/')} className="mt-6 text-primary font-black uppercase text-xs tracking-widest">Volver al Inicio</button>
      </div>
    );
  }

  const toggleStep = (stepId: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          steps: j.steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s)
        };
      }
      return j;
    }));
  };

  const completedCount = job.steps.filter(s => s.completed).length;
  const progress = Math.round((completedCount / job.steps.length) * 100);
  const isFinished = progress === 100;

  const sendWhatsAppNotification = () => {
    const cleanPhone = customer.phone.replace(/\D/g, '');
    const message = `¡Hola ${customer.name}! Te hablamos de *Apex Garage*. 🏁\n\nTe informamos que tu *${customer.car}* ya se encuentra ${isFinished ? '*listo y en condiciones impecables*' : `en un *${progress}%* de avance`}. ✨\n\n¡Seguimos trabajando para la perfección!`;
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between z-10 sticky top-0 border-b border-slate-200 dark:border-slate-800/50">
        <div onClick={() => navigate(-1)} className="text-slate-800 dark:text-white flex size-12 shrink-0 items-center justify-start cursor-pointer">
          <span className="material-symbols-outlined">chevron_left</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <h2 className="text-slate-900 dark:text-white text-lg font-black italic uppercase tracking-tighter leading-tight">{customer.car}</h2>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{job.bay}</span>
        </div>
        <div className="flex w-12 items-center justify-end">
          <button onClick={() => navigate('/advisor')} className="flex cursor-pointer items-center justify-center rounded-full h-10 w-10 bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white">
            <span className="material-symbols-outlined text-[20px]">auto_fix_high</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pb-48 custom-scrollbar">
        <div className="px-4 pt-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <p className="text-primary text-xs font-black uppercase tracking-widest">Ficha Técnica de Avance</p>
          </div>
          <h2 className="text-slate-900 dark:text-white tracking-tight text-3xl font-extrabold leading-tight">Estado del Servicio</h2>
          
          <div className="mt-6 bg-surface-dark border border-white/5 rounded-3xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 size-24 bg-primary/5 blur-2xl rounded-full"></div>
            <div className="flex justify-between items-end mb-3">
               <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Progreso Certificado</span>
               <span className="text-primary font-black italic text-xl">{progress}%</span>
            </div>
            <div className="w-full bg-black/40 h-3 rounded-full p-0.5 border border-white/5 overflow-hidden">
               <div className="bg-gradient-to-r from-primary to-accent-yellow h-full transition-all duration-700 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="mt-8 px-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 px-1">Checklist Técnico</h3>
          <div className="space-y-3">
            {job.steps.map((step, idx) => (
              <button 
                key={step.id} 
                onClick={() => toggleStep(step.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left ${step.completed ? 'bg-primary/10 border-primary/30' : 'bg-surface-dark border-white/5 opacity-60'}`}
              >
                <div className={`size-11 rounded-xl flex items-center justify-center transition-colors ${step.completed ? 'bg-primary text-white' : 'bg-black/20 text-slate-500'}`}>
                  <span className="material-symbols-outlined">{step.completed ? 'check_circle' : step.icon}</span>
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-black uppercase italic tracking-tighter ${step.completed ? 'text-primary' : 'text-white'}`}>{step.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{step.description}</p>
                </div>
                {step.completed && (
                  <span className="material-symbols-outlined text-primary text-xl">verified</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 px-4 pb-10">
           <div className="bg-surface-dark border border-white/5 rounded-3xl p-6 shadow-xl text-center">
              <div className={`size-14 rounded-full flex items-center justify-center mx-auto mb-4 ${isFinished ? 'bg-primary/10 text-primary' : 'bg-accent-yellow/10 text-accent-yellow'}`}>
                 <span className="material-symbols-outlined text-3xl font-bold">{isFinished ? 'task_alt' : 'hourglass_top'}</span>
              </div>
              <h3 className="text-white font-black italic uppercase tracking-tighter text-lg">{isFinished ? 'Vehículo Finalizado' : 'Notificar Avance'}</h3>
              <p className="text-slate-500 text-xs mt-2 mb-6">Mantén informado a {customer.name} sobre el estado de su {customer.car}.</p>
              
              <button 
                onClick={sendWhatsAppNotification}
                className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all ${isFinished ? 'bg-[#25D366] text-white' : 'bg-white text-black'}`}
              >
                <svg viewBox="0 0 24 24" className="size-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.435 5.624 1.435h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {isFinished ? 'Confirmar Listo' : 'Enviar Avance'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
