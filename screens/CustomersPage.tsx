
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Customer } from '../App';

interface CustomersPageProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const CustomersPage: React.FC<CustomersPageProps> = ({ customers, setCustomers }) => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newCust, setNewCust] = useState({ name: '', phone: '', car: '' });
  
  // Estados para edición
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Customer | null>(null);

  const addCustomer = () => {
    if (!newCust.name) return;
    setCustomers([...customers, { ...newCust, id: Date.now().toString() }]);
    setNewCust({ name: '', phone: '', car: '' });
    setShowForm(false);
  };

  const startEdit = (c: Customer) => {
    setEditingId(c.id);
    setEditForm({ ...c });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = () => {
    if (!editForm || !editingId) return;
    setCustomers(prev => prev.map(c => c.id === editingId ? editForm : c));
    setEditingId(null);
    setEditForm(null);
  };

  const deleteCustomer = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente de Apex Garage?')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleWhatsApp = (phone: string, name: string) => {
    // Limpiar el número: solo dejar números
    const cleanPhone = phone.replace(/\D/g, '');
    const message = `¡Hola ${name}! Te contactamos de *Apex Garage*.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark pb-24">
      <header className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-background-light dark:bg-background-dark sticky top-0 z-30">
        <div className="flex flex-col">
          <h1 className="text-slate-900 dark:text-white font-black italic text-xl uppercase tracking-tighter leading-none">Clientes</h1>
          <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">Directorio VIP</p>
        </div>
        <button onClick={() => navigate(-1)} className="size-10 rounded-xl bg-slate-100 dark:bg-surface-dark flex items-center justify-center dark:text-white border border-white/5">
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <div className="p-4 flex-1">
        {!showForm && !editingId && (
          <button 
            onClick={() => setShowForm(true)}
            className="w-full mb-6 bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">person_add</span>
            Nuevo Cliente
          </button>
        )}

        {showForm && (
          <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-primary/30 mb-6 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-300">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2">Ficha de Registro</h3>
            <div className="space-y-3">
              <input 
                type="text" placeholder="Nombre Completo"
                className="w-full bg-slate-50 dark:bg-black/40 p-4 rounded-xl border-none focus:ring-1 focus:ring-primary text-sm dark:text-white"
                value={newCust.name} onChange={e => setNewCust({...newCust, name: e.target.value})}
              />
              <input 
                type="text" placeholder="Teléfono (ej: +56912345678)"
                className="w-full bg-slate-50 dark:bg-black/40 p-4 rounded-xl border-none focus:ring-1 focus:ring-primary text-sm dark:text-white"
                value={newCust.phone} onChange={e => setNewCust({...newCust, phone: e.target.value})}
              />
              <input 
                type="text" placeholder="Vehículo / Modelo"
                className="w-full bg-slate-50 dark:bg-black/40 p-4 rounded-xl border-none focus:ring-1 focus:ring-primary text-sm dark:text-white"
                value={newCust.car} onChange={e => setNewCust({...newCust, car: e.target.value})}
              />
            </div>
            <div className="flex gap-2 pt-2">
               <button onClick={addCustomer} className="flex-1 bg-primary text-white py-3 rounded-xl font-black uppercase text-[11px] tracking-widest">Guardar Cliente</button>
               <button onClick={() => setShowForm(false)} className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white py-3 rounded-xl font-black uppercase text-[11px] tracking-widest">Cancelar</button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1 mb-2">Base de Datos Activa</h2>
          {customers.map(c => (
            <div key={c.id} className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col shadow-sm">
               {editingId === c.id && editForm ? (
                 <div className="space-y-3">
                    <input 
                      className="w-full bg-slate-50 dark:bg-black/20 p-3 rounded-lg text-sm dark:text-white border border-primary/20"
                      value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                      placeholder="Nombre"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        className="w-full bg-slate-50 dark:bg-black/20 p-3 rounded-lg text-sm dark:text-white border border-primary/20"
                        value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})}
                        placeholder="Teléfono"
                      />
                      <input 
                        className="w-full bg-slate-50 dark:bg-black/20 p-3 rounded-lg text-sm dark:text-white border border-primary/20"
                        value={editForm.car} onChange={e => setEditForm({...editForm, car: e.target.value})}
                        placeholder="Vehículo"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                       <button onClick={saveEdit} className="flex-1 bg-primary text-white py-2 rounded-lg font-black uppercase text-[10px]">Actualizar</button>
                       <button onClick={cancelEdit} className="flex-1 bg-slate-700 text-white py-2 rounded-lg font-black uppercase text-[10px]">Cancelar</button>
                    </div>
                 </div>
               ) : (
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 flex-1">
                       <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                          <span className="material-symbols-outlined text-2xl font-light">person</span>
                       </div>
                       <div>
                          <h4 className="text-slate-900 dark:text-white font-black uppercase tracking-tight italic">{c.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-accent-yellow text-[10px] font-black uppercase">{c.car}</span>
                            <span className="text-slate-400 text-[10px]">•</span>
                            <span className="text-slate-500 text-[10px] font-medium">{c.phone}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                       <button 
                        onClick={() => handleWhatsApp(c.phone, c.name)}
                        className="size-10 rounded-lg bg-[#25D366]/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/20 transition-all"
                        title="Enviar WhatsApp"
                       >
                          <svg viewBox="0 0 24 24" className="size-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.435 5.624 1.435h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                       </button>
                       <button 
                        onClick={() => startEdit(c)}
                        className="size-10 rounded-lg bg-slate-50 dark:bg-background-dark flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                       >
                          <span className="material-symbols-outlined text-xl">edit</span>
                       </button>
                       <button 
                        onClick={() => deleteCustomer(c.id)}
                        className="size-10 rounded-lg bg-slate-50 dark:bg-background-dark flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                       >
                          <span className="material-symbols-outlined text-xl">delete</span>
                       </button>
                    </div>
                 </div>
               )}
            </div>
          ))}
          
          {customers.length === 0 && (
            <div className="py-20 text-center">
              <span className="material-symbols-outlined text-slate-600 text-5xl mb-4">group_off</span>
              <p className="text-slate-500 text-sm font-medium">No hay clientes registrados aún.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
