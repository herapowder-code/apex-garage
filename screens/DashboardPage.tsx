import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Customer, Job } from '../App.tsx';

interface DashboardPageProps {
  customers: Customer[];
  jobs: Job[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ customers, jobs }) => {
  const navigate = useNavigate();

  const getJobProgress = (job: Job) => {
    const completed = job.steps.filter(s => s.completed).length;
    return Math.round((completed / job.steps.length) * 100);
  };

  const getCustomerForJob = (job: Job) => {
    return customers.find(c => c.id === job.customerId);
  };

  const handleQuickWhatsApp = (job: Job) => {
    const customer = getCustomerForJob(job);
    if (!customer) return;
    
    const cleanPhone = customer.phone.replace(/\D/g, '');
    const progress = getJobProgress(job);
    const message = `¡Hola ${customer.name}! Te contactamos de *Apex Garage*. Te informamos que tu *${customer.car}* ya lleva un *${progress}%* de avance en su servicio actual. 🏁`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="pb-8">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center p-4 pb-3 justify-between">
          <div className="flex items-center gap-1">
            <div className="flex flex-col">
              <h2 className="text-white text-2xl font-black leading-tight tracking-tighter uppercase italic">Apex Garage</h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent-yellow font-black">Performance and Detailing</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="relative flex items-center justify-center rounded-xl h-10 w-10 bg-surface-dark border border-white/5 text-white shadow-md">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-accent-yellow rounded-full border-2 border-surface-dark"></span>
            </button>
          </div>
        </div>
      </header>

      <section className="px-4 py-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 px-1">Acciones Rápidas</h3>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => navigate('/accounting')} className="flex flex-col items-center justify-center gap-2 p-4 bg-surface-dark rounded-2xl border border-white/5 shadow-xl active:scale-95 transition-all">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined">payments</span></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Finanzas</span>
          </button>
          <button onClick={() => navigate('/customers')} className="flex flex-col items-center justify-center gap-2 p-4 bg-surface-dark rounded-2xl border border-white/5 shadow-xl active:scale-95 transition-all">
            <div className="size-10 rounded-full bg-accent-yellow/10 flex items-center justify-center text-accent-yellow"><span className="material-symbols-outlined">group</span></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Clientes</span>
          </button>
          <button onClick={() => navigate('/admin-services')} className="flex flex-col items-center justify-center gap-2 p-4 bg-surface-dark rounded-2xl border border-white/5 shadow-xl active:scale-95 transition-all">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined">garage</span></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Servicios</span>
          </button>
        </div>
      </section>

      <section className="px-4 py-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 px-1">Bahías de Trabajo</h3>
        <div className="space-y-4">
          {jobs.map(job => {
            const customer = getCustomerForJob(job);
            const progress = getJobProgress(job);
            return (
              <div key={job.id} className="carbon-pattern rounded-3xl p-6 shadow-2xl border border-primary/10 relative overflow-hidden group">
                <div className="absolute -right-10 -bottom-10 size-40 bg-primary/5 blur-3xl rounded-full"></div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <p className="text-accent-yellow text-[10px] font-black uppercase tracking-widest mb-1">{job.bay}</p>
                    <h4 className="text-white font-black italic text-xl leading-tight uppercase tracking-tighter">{customer?.car || 'Sin Vehículo'}</h4>
                    <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest mt-0.5">{customer?.name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="bg-primary text-white text-[9px] font-black px-3 py-1 rounded-full mb-1 uppercase tracking-tighter shadow-lg shadow-primary/40">En Proceso</span>
                    <button 
                      onClick={() => handleQuickWhatsApp(job)}
                      className="bg-[#25D366]/20 text-[#25D366] size-8 rounded-lg flex items-center justify-center hover:bg-[#25D366]/30 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="size-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.435 5.624 1.435h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-3 relative z-10">
                  <div className="flex justify-between items-end">
                    <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Progreso Global</span>
                    <span className="text-accent-yellow font-black italic text-sm">{progress}%</span>
                  </div>
                  <div className="w-full bg-black/40 h-3 rounded-full p-1 border border-white/5">
                    <div className="bg-gradient-to-r from-primary to-accent-yellow h-full transition-all duration-700 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/tracking/${job.id}`)} 
                  className="w-full mt-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                >
                  Gestionar Avance
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-6">
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-white text-lg font-black italic uppercase tracking-tighter">Historial Reciente</h2>
          <span className="text-[9px] font-black text-primary uppercase tracking-widest cursor-pointer" onClick={() => navigate('/logbook')}>Ver Bitácora</span>
        </div>
        <div className="bg-surface-dark rounded-2xl p-5 border border-white/5 flex items-center gap-4 shadow-xl">
          <div className="size-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent-yellow/10 flex items-center justify-center text-accent-yellow shrink-0 border border-white/5">
             <span className="material-symbols-outlined text-3xl font-light">verified</span>
          </div>
          <div className="flex-1">
             <p className="text-white font-black text-sm uppercase tracking-tight italic">Certificado Apex Garage</p>
             <p className="text-slate-500 text-[11px] font-medium leading-tight">Garantía activa chasis #PX-992.</p>
          </div>
          <button onClick={() => navigate('/logbook')} className="size-10 rounded-xl bg-background-dark flex items-center justify-center text-primary border border-white/5">
             <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;