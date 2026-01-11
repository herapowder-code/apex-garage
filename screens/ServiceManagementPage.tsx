import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Standardized import path to include .tsx extension
import { Product } from '../App.tsx';

interface ServiceManagementPageProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ServiceManagementPage: React.FC<ServiceManagementPageProps> = ({ products, setProducts }) => {
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditForm(p);
  };

  const saveEdit = () => {
    if (!editingId) return;
    setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...editForm } as Product : p));
    setEditingId(null);
  };

  const deleteService = (id: string) => {
    if (confirm('¿Seguro que quieres eliminar este ítem?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const addService = () => {
    // barcode is now correctly recognized as a valid property of Product
    const newService: Product = {
      id: Date.now().toString(),
      name: 'Nuevo Ítem',
      price: 0,
      category: 'Insumos',
      icon: 'add_circle',
      type: 'producto',
      barcode: ''
    };
    setProducts([...products, newService]);
    startEdit(newService);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark pb-20">
      <header className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-background-light dark:bg-background-dark z-30">
        <h1 className="text-slate-900 dark:text-white font-black italic text-xl uppercase tracking-tighter">Inventario</h1>
        <button onClick={() => navigate(-1)} className="size-10 rounded-xl bg-slate-100 dark:bg-surface-dark flex items-center justify-center border border-white/5">
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <div className="p-4">
        <button 
          onClick={addService}
          className="w-full mb-6 bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined">add_box</span>
          Agregar Insumo o Servicio
        </button>

        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-all">
               {editingId === p.id ? (
                 <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                       <label className="text-[10px] font-bold text-slate-500 uppercase px-1 tracking-widest">Nombre del Ítem</label>
                       <input 
                        className="w-full bg-slate-50 dark:bg-background-dark p-3 rounded-lg text-sm text-white border-none focus:ring-1 focus:ring-primary"
                        value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                       <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase px-1 tracking-widest">Precio CLP</label>
                          <input 
                            type="number"
                            className="w-full bg-slate-50 dark:bg-background-dark p-3 rounded-lg text-sm text-white border-none"
                            value={editForm.price} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})}
                          />
                       </div>
                       <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase px-1 tracking-widest">Código Barras</label>
                          <input 
                            className="w-full bg-slate-50 dark:bg-background-dark p-3 rounded-lg text-sm text-white border-none font-mono"
                            value={editForm.barcode} onChange={e => setEditForm({...editForm, barcode: e.target.value})}
                            placeholder="EAN-13 / UPC"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase px-1 tracking-widest">Categoría</label>
                          <select 
                            className="w-full bg-slate-50 dark:bg-background-dark p-3 rounded-lg text-sm text-white border-none"
                            value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}
                          >
                            <option>Estética</option>
                            <option>Protección</option>
                            <option>Interior</option>
                            <option>Insumos</option>
                            <option>Merch</option>
                          </select>
                       </div>
                       <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase px-1 tracking-widest">Tipo</label>
                          <select 
                            className="w-full bg-slate-50 dark:bg-background-dark p-3 rounded-lg text-sm text-white border-none"
                            value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value as 'servicio' | 'producto'})}
                          >
                            <option value="servicio">Servicio</option>
                            <option value="producto">Producto/Stock</option>
                          </select>
                       </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                       <button onClick={saveEdit} className="flex-1 bg-primary text-white py-3 rounded-lg font-black uppercase text-xs tracking-widest">Guardar</button>
                       <button onClick={() => setEditingId(null)} className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-black uppercase text-xs tracking-widest">Cancelar</button>
                    </div>
                 </div>
               ) : (
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <div className={`p-2 rounded-lg ${p.type === 'servicio' ? 'bg-primary/10 text-primary' : 'bg-accent-yellow/10 text-accent-yellow'}`}>
                          <span className="material-symbols-outlined">{p.icon}</span>
                       </div>
                       <div>
                          <div className="flex items-center gap-2">
                            <p className="text-slate-900 dark:text-white font-bold text-sm leading-none">{p.name}</p>
                            <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-slate-700 text-slate-500">{p.category}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-primary font-black italic text-xs">{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(p.price)}</p>
                            {p.barcode && <p className="text-[9px] text-slate-500 font-mono">[{p.barcode}]</p>}
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-3">
                       <button onClick={() => startEdit(p)} className="text-slate-500 hover:text-primary transition-colors"><span className="material-symbols-outlined text-xl">edit_note</span></button>
                       <button onClick={() => deleteService(p.id)} className="text-red-500/30 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>
                    </div>
                 </div>
               )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceManagementPage;