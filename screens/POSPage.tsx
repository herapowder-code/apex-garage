
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, Transaction } from '../App';

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

const POSPage: React.FC<POSPageProps> = ({ products, addTransaction }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<{product: Product, qty: number}[]>([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    type: 'Auto',
    plate: '',
    color: '',
    mileage: '',
    details: ''
  });

  // --- LÓGICA DE ESCÁNER DE PISTOLA (HID) ---
  useEffect(() => {
    let barcodeBuffer = "";
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      
      // Si el tiempo entre teclas es muy corto, es una pistola (HID)
      if (currentTime - lastKeyTime > 50) {
        barcodeBuffer = ""; // Reset si es escritura manual lenta
      }

      if (e.key === 'Enter') {
        if (barcodeBuffer.length > 2) {
          processBarcode(barcodeBuffer);
        }
        barcodeBuffer = "";
      } else if (e.key.length === 1) {
        barcodeBuffer += e.key;
      }
      lastKeyTime = currentTime;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const processBarcode = (code: string) => {
    const found = products.find(p => p.barcode === code);
    if (found) {
      addToCart(found);
      setLastScanned(found.name);
      setTimeout(() => setLastScanned(null), 2000);
    }
  };

  // --- LÓGICA DE ESCÁNER DE CÁMARA ---
  useEffect(() => {
    let interval: any;
    if (showScanner && 'BarcodeDetector' in window) {
      const barcodeDetector = new (window as any).BarcodeDetector({
        formats: ['ean_13', 'code_128', 'qr_code', 'upc_a']
      });

      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }

          interval = setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
              try {
                const barcodes = await barcodeDetector.detect(videoRef.current);
                if (barcodes.length > 0) {
                  const code = barcodes[0].rawValue;
                  processBarcode(code);
                  setShowScanner(false); // Detener tras detección exitosa
                  stopCamera(stream);
                }
              } catch (e) {
                console.error("Barcode detection error:", e);
              }
            }
          }, 300);
        });
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showScanner]);

  const stopCamera = (stream: MediaStream) => {
    stream.getTracks().forEach(track => track.stop());
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? {...item, qty: item.qty + 1} : item);
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.qty), 0);
  const total = subtotal;

  const handleIssueReceipt = () => {
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
    setShowVehicleForm(false);
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      description: `Venta Apex Garage - ${vehicleData.plate || 'General'}`,
      amount: total,
      type: 'ingreso',
      category: 'Ventas'
    };
    
    setTimeout(() => {
      addTransaction(newTransaction);
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setCart([]);
        navigate('/');
      }, 3000);
    }, 2000);
  };

  const filteredProducts = activeCategory === 'Todos' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  if (isSuccess) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background-dark p-6 text-center">
        <div className="mb-6 flex flex-col items-center">
           <h2 className="text-white text-3xl font-black italic uppercase tracking-tighter">Apex Garage</h2>
           <p className="text-[10px] text-accent-yellow font-black uppercase tracking-widest mt-1">Performance and Detailing</p>
        </div>
        <div className="size-16 bg-primary rounded-full flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
          <span className="material-symbols-outlined text-white text-3xl">verified</span>
        </div>
        <h2 className="text-white text-3xl font-black italic uppercase tracking-tighter mb-2">Venta Exitosa</h2>
        <p className="text-slate-400 mb-8 font-medium italic">Registrado en el sistema central.</p>
        <div className="w-full max-w-xs carbon-pattern p-1 rounded-3xl">
          <div className="bg-surface-dark p-6 rounded-[22px] border border-white/5 text-left">
             <div className="flex justify-between mb-2">
               <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Nº Operación</span>
               <span className="text-white text-[10px] font-mono">#AG-{(Math.random() * 99999).toFixed(0)}</span>
             </div>
             <div className="flex justify-between mb-4">
               <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Vehículo</span>
               <span className="text-accent-yellow text-[10px] font-black uppercase">{vehicleData.plate || 'Venta Rápida'}</span>
             </div>
             <div className="border-t border-white/10 pt-3 flex justify-between items-end">
               <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Cobrado</span>
               <span className="text-primary text-xl font-black italic">{formatCLP(total)}</span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background-dark overflow-hidden">
      <header className="p-4 border-b border-white/5 flex justify-between items-center bg-background-dark z-20 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h1 className="text-white font-black italic text-xl uppercase tracking-tighter leading-none">Apex Garage</h1>
            <p className="text-[8px] text-accent-yellow font-black uppercase tracking-[0.2em] mt-1">Terminal de Ventas</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowScanner(!showScanner)}
            className={`size-10 rounded-xl flex items-center justify-center transition-all ${showScanner ? 'bg-primary text-white' : 'bg-surface-dark border border-white/5 text-slate-400'}`}
          >
            <span className="material-symbols-outlined">barcode_scanner</span>
          </button>
          <button onClick={() => navigate(-1)} className="size-10 rounded-xl bg-surface-dark border border-white/5 flex items-center justify-center text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </header>

      {/* Notificación de escaneo exitoso */}
      {lastScanned && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[100] bg-primary text-white px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl animate-bounce">
          + {lastScanned}
        </div>
      )}

      {/* Visor de Cámara */}
      {showScanner && (
        <div className="relative w-full h-48 bg-black overflow-hidden border-b border-primary/30">
          <video ref={videoRef} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-3/4 h-1/2 border-2 border-primary/50 rounded-lg relative overflow-hidden">
              <div className="absolute w-full h-[2px] bg-primary shadow-[0_0_15px_#1a8e3f] animate-[scan_2s_infinite]"></div>
            </div>
          </div>
          <p className="absolute bottom-2 w-full text-center text-[9px] text-primary font-black uppercase tracking-widest">Apunta al código de barras</p>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto p-4 snap-x custom-scrollbar bg-black/20">
        {['Todos', 'Estética', 'Protección', 'Interior', 'Insumos', 'Merch'].map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-surface-dark text-slate-500 border border-white/5'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pb-72 custom-scrollbar p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map(product => (
            <button 
              key={product.id}
              onClick={() => addToCart(product)}
              className="flex flex-col items-start p-4 bg-surface-dark rounded-2xl border border-white/5 active:scale-95 transition-all text-left relative overflow-hidden group shadow-md"
            >
              <div className={`absolute top-0 right-0 p-1.5 text-[8px] font-black uppercase ${product.type === 'servicio' ? 'bg-primary/20 text-primary' : 'bg-accent-yellow/20 text-accent-yellow'}`}>
                {product.type === 'servicio' ? 'Svc' : 'Inv'}
              </div>
              <span className="material-symbols-outlined text-primary mb-3 group-hover:scale-110 transition-transform">{product.icon}</span>
              <p className="text-white text-[11px] font-black uppercase tracking-tighter leading-tight mb-1 h-8 overflow-hidden">{product.name}</p>
              <div className="flex flex-col">
                <p className="text-accent-yellow text-sm font-black italic">{formatCLP(product.price)}</p>
                {product.barcode && <p className="text-[8px] text-slate-600 font-mono mt-0.5">{product.barcode}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {showVehicleForm && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-end justify-center p-4">
          <div className="w-full max-w-sm bg-surface-dark border border-primary/20 rounded-t-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-500">
             <div className="flex justify-between items-center mb-8">
                <div>
                   <h3 className="text-white font-black italic uppercase tracking-tighter text-2xl">Ficha de Ingreso</h3>
                   <p className="text-[10px] text-primary font-black uppercase tracking-widest">Apex Garage Registry</p>
                </div>
                <button onClick={() => setShowVehicleForm(false)} className="text-slate-500 bg-black/20 p-2 rounded-full"><span className="material-symbols-outlined">close</span></button>
             </div>
             
             <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                   <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase px-1 tracking-widest">Patente</label>
                      <input 
                        placeholder="AAAA-00"
                        className="bg-black/40 border border-white/5 rounded-xl text-white text-sm p-4 uppercase font-black tracking-widest focus:ring-1 focus:ring-primary focus:outline-none"
                        value={vehicleData.plate} onChange={e => setVehicleData({...vehicleData, plate: e.target.value.toUpperCase()})}
                      />
                   </div>
                   <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase px-1 tracking-widest">KM Actual</label>
                      <input 
                        type="number" placeholder="00000"
                        className="bg-black/40 border border-white/5 rounded-xl text-white text-sm p-4 font-black focus:ring-1 focus:ring-primary focus:outline-none"
                        value={vehicleData.mileage} onChange={e => setVehicleData({...vehicleData, mileage: e.target.value})}
                      />
                   </div>
                </div>

                <div className="flex flex-col gap-1.5">
                   <label className="text-[10px] font-black text-slate-500 uppercase px-1 tracking-widest">Notas Técnicas</label>
                   <textarea 
                     placeholder="Estado de la pintura, abolladuras, requerimientos..."
                     className="bg-black/40 border border-white/5 rounded-xl text-white text-xs p-4 h-24 resize-none font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                     value={vehicleData.details} onChange={e => setVehicleData({...vehicleData, details: e.target.value})}
                   />
                </div>

                <button 
                  onClick={finalizeSale}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs mt-4 shadow-xl shadow-primary/30 active:scale-95 transition-all"
                >
                  Finalizar e Ingresar
                </button>
             </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-surface-dark border-t border-white/5 rounded-t-[32px] shadow-2xl z-50 p-6 pb-24">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-black uppercase text-[10px] tracking-[0.2em]">Resumen de Órden</h3>
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[9px] font-black">{cart.length} ITEMS</span>
        </div>

        <div className="max-h-24 overflow-y-auto mb-4 space-y-2 custom-scrollbar">
          {cart.map(item => (
            <div key={item.product.id} className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
              <div className="flex flex-col truncate max-w-[150px]">
                <p className="text-white text-[11px] font-black uppercase tracking-tighter truncate">{item.product.name}</p>
                <p className="text-[9px] text-slate-500 font-black">CANT: {item.qty}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-accent-yellow text-xs font-black italic">{formatCLP(item.product.price * item.qty)}</p>
                <button onClick={() => removeFromCart(item.product.id)} className="text-red-500/40 hover:text-red-500 material-symbols-outlined text-base transition-colors">delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-end border-t border-white/5 pt-5 mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-2">Total CLP</span>
            <span className="text-3xl text-primary font-black italic tracking-tighter">{formatCLP(total)}</span>
          </div>
          <button 
            onClick={handleIssueReceipt}
            disabled={cart.length === 0 || isProcessing}
            className="bg-primary disabled:opacity-50 text-white px-10 py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-lg shadow-primary/30 transition-all flex items-center gap-2"
          >
            {isProcessing ? <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Confirmar Venta'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default POSPage;
