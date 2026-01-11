
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, Transaction } from '../App.tsx';

const formatCLP = (val: number) => {
  return new Intl.NumberFormat('es-CL', { 
    style: 'currency', 
    currency: 'CLP',
    maximumFractionDigits: 0 
  }).format(val);
};

interface POSPageProps {
  products: Product[];
  addTransaction: (t: Transaction) => void;
}

interface VehicleData {
  type: string;
  plate: string;
  color: string;
  mileage: string;
  details: string;
}

// Fixed the component by adding a proper return statement and fulfilling the Transaction interface
const POSPage: React.FC<POSPageProps> = ({ products, addTransaction }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<{product: Product, qty: number}[]>([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    type: 'Auto',
    plate: '',
    color: '',
    mileage: '',
    details: ''
  });

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = activeCategory === 'Todos' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? {...item, qty: item.qty + 1} : item);
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const total = cart.reduce((acc, item) => acc + (item.product.price * item.qty), 0);

  const handleConfirmSale = () => {
    if (cart.length === 0) return;
    const hasServices = cart.some(item => item.product.type === 'servicio');
    if (hasServices) {
      setShowVehicleForm(true);
    } else {
      finalizeSale();
    }
  };

  const finalizeSale = () => {
    setIsProcessing(true);
    
    // Fix: completed the transaction object and used the correct properties
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      description: cart.map(item => `${item.qty}x ${item.product.name}`).join(', '),
      amount: total,
      type: 'ingreso',
      category: 'Ventas'
    };

    addTransaction(newTransaction);
    
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setCart([]);
      setTimeout(() => {
        setIsSuccess(false);
        setShowVehicleForm(false);
        navigate('/accounting');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark overflow-hidden">
      <header className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-background-light dark:bg-background-dark z-30">
        <div className="flex flex-col">
          <h1 className="text-slate-900 dark:text-white font-black italic text-xl uppercase tracking-tighter leading-none">Punto de Venta</h1>
          <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">Apex Detailer Console</p>
        </div>
        <button onClick={() => navigate(-1)} className="size-10 rounded-xl bg-slate-100 dark:bg-surface-dark flex items-center justify-center dark:text-white border border-white/5">
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex overflow-x-auto gap-2 p-4 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                activeCategory === cat 
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                  : 'bg-white dark:bg-surface-dark text-slate-500 border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map(p => (
                <button 
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-white/5 text-left flex flex-col gap-2 hover:border-primary/50 transition-colors shadow-sm active:scale-95"
                >
                  <div className={`size-10 rounded-xl flex items-center justify-center ${p.type === 'servicio' ? 'bg-primary/10 text-primary' : 'bg-accent-yellow/10 text-accent-yellow'}`}>
                    <span className="material-symbols-outlined">{p.icon}</span>
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-bold text-xs leading-tight line-clamp-2">{p.name}</p>
                    <p className="text-primary font-black italic text-sm mt-1">{formatCLP(p.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="h-2/5 md:h-full md:w-80 bg-slate-50 dark:bg-black/20 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 flex flex-col p-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Resumen de Venta</h3>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between items-center bg-white dark:bg-surface-dark p-3 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                  <div className="flex-1">
                    <p className="text-slate-900 dark:text-white font-bold text-[11px] leading-tight">{item.product.name}</p>
                    <p className="text-primary font-bold text-[10px]">{formatCLP(item.product.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.product.id, -1)} className="size-6 rounded-md bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500"><span className="material-symbols-outlined text-sm">remove</span></button>
                    <span className="text-xs font-black dark:text-white w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.product.id, 1)} className="size-6 rounded-md bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500"><span className="material-symbols-outlined text-sm">add</span></button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                  <span className="material-symbols-outlined text-4xl opacity-20 mb-2">shopping_cart</span>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Carrito Vacío</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-end mb-4">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total a Pagar</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter">{formatCLP(total)}</p>
              </div>
              <button 
                onClick={handleConfirmSale}
                disabled={cart.length === 0 || isProcessing}
                className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    Procesar Cobro
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showVehicleForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-background-dark rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-slate-900 dark:text-white font-black italic text-xl uppercase tracking-tighter">Ficha de Servicio</h2>
              <button onClick={() => setShowVehicleForm(false)} className="size-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center dark:text-white"><span className="material-symbols-outlined">close</span></button>
            </div>
            
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase px-1 tracking-widest">Patente</label>
                    <input 
                      className="w-full bg-slate-50 dark:bg-black/40 p-3 rounded-xl border-none text-sm dark:text-white font-black uppercase" 
                      placeholder="ABCD-12"
                      value={vehicleData.plate}
                      onChange={e => setVehicleData({...vehicleData, plate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase px-1 tracking-widest">Color</label>
                    <input 
                      className="w-full bg-slate-50 dark:bg-black/40 p-3 rounded-xl border-none text-sm dark:text-white" 
                      placeholder="Ej: Rojo"
                      value={vehicleData.color}
                      onChange={e => setVehicleData({...vehicleData, color: e.target.value})}
                    />
                  </div>
               </div>
               <button 
                onClick={finalizeSale}
                className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs mt-4 shadow-xl"
               >
                 Confirmar Venta y Orden
               </button>
            </div>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-primary p-8 text-center text-white animate-in fade-in duration-300">
           <div className="space-y-6">
              <span className="material-symbols-outlined text-8xl animate-bounce">verified</span>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Completado</h2>
              <p className="text-white/80 text-sm font-medium">Actualizando sistema financiero...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default POSPage;
