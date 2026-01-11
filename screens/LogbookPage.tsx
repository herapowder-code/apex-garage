
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceHistoryItem } from '../types';

const LogbookPage: React.FC = () => {
  const navigate = useNavigate();

  const history: ServiceHistoryItem[] = [
    { title: "Tratamiento Cerámico 9H", sub: "Recubrimiento Nanotecnológico", date: "12 Dic, 2024", miles: "12,400", icon: "shield", verified: true },
    { title: "Detallado de Interiores", sub: "Desinfección y Nutrición de Cuero", date: "05 Oct, 2024", miles: "11,200", icon: "airline_seat_recline_extra", verified: true },
    { title: "Corrección de Pintura", sub: "Restauración de Brillo Espejo", date: "20 Jul, 2024", miles: "9,500", icon: "flare", verified: true },
    { title: "Instalación de PPF", sub: "Paint Protection Film - Frontal", date: "10 May, 2024", miles: "5,200", icon: "layers", verified: true }
  ];

  return (
    <div className="flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark pb-24">
      <div className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-slate-200 dark:border-slate-800">
        <div onClick={() => navigate(-1)} className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Porsche 911 GT3 RS</h2>
          <p className="text-xs text-slate-500 dark:text-[#90a4cb] font-medium uppercase tracking-widest">Historial Estético</p>
        </div>
        <div className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer">
          <span className="material-symbols-outlined">more_horiz</span>
        </div>
      </div>

      <div className="flex flex-col pb-10">
        <div className="p-4">
          <div className="flex flex-col items-stretch justify-start rounded-xl shadow-lg bg-[#182234] border border-primary/20 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 size-32 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-5 px-5 relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-sm">stars</span>
                <p className="text-[#90a4cb] text-xs font-semibold uppercase tracking-wider">Membresía Apex Platinum</p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-white text-3xl font-bold leading-tight tracking-tight">VIP</p>
                <p className="text-primary text-sm font-bold uppercase">Miembro</p>
              </div>
              <div className="flex items-center gap-3 justify-between mt-4 pt-4 border-t border-white/5">
                <p className="text-[#90a4cb] text-sm font-normal leading-normal">Mantenimientos estéticos ilimitados</p>
                <button className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-semibold leading-normal hover:bg-primary/90 transition-colors">
                  <span className="truncate">Ver Beneficios</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pt-6 pb-2">
          <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">Servicios Realizados</h2>
        </div>

        <div className="flex flex-col space-y-px">
          {history.map((item, idx) => (
            <div key={idx} className="flex flex-col bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-slate-800/50">
              <div className="flex gap-4 px-4 py-5 justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className={`flex items-center justify-center rounded-xl shrink-0 size-12 shadow-inner bg-primary/10 text-primary`}>
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-slate-900 dark:text-white text-base font-bold leading-normal">{item.title}</p>
                    </div>
                    <p className="text-slate-500 dark:text-[#90a4cb] text-xs font-medium uppercase tracking-tight">{item.sub}</p>
                    <p className="text-slate-400 dark:text-[#90a4cb]/60 text-sm font-normal mt-1 leading-normal">{item.date}</p>
                  </div>
                </div>
                <div className="shrink-0">
                  <button className="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-[#222f49] text-slate-900 dark:text-white">
                    <span className="material-symbols-outlined text-xl">verified</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 mt-4 flex flex-col items-center justify-center text-center">
          <div className="size-16 carbon-pattern rounded-full flex items-center justify-center mb-3 shadow-xl border border-white/10">
            <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
          </div>
          <h3 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-widest">Estado de Preservación</h3>
          <p className="text-green-500 text-xs mt-1 font-bold uppercase">Excelente (98/100)</p>
          <p className="text-slate-500 dark:text-[#90a4cb] text-xs mt-2 px-10">Tu vehículo mantiene un acabado de concurso gracias a los cuidados en Apex Detailing.</p>
        </div>
      </div>
    </div>
  );
};

export default LogbookPage;
