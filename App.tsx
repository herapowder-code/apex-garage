
import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import DashboardPage from './screens/DashboardPage.tsx';
import TrackingPage from './screens/TrackingPage.tsx';
import AdvisorPage from './screens/AdvisorPage.tsx';
import POSPage from './screens/POSPage.tsx';
import CustomersPage from './screens/CustomersPage.tsx';
import AccountingPage from './screens/AccountingPage.tsx';

// Added optional barcode property to support product inventory and scanning features
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  icon: string;
  type: 'servicio' | 'producto';
  barcode?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'ingreso' | 'egreso';
  category: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  car: string;
}

export interface JobStep {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  icon: string;
}

export interface Job {
  id: string;
  customerId: string;
  bay: string;
  steps: JobStep[];
}

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Juan Pérez', phone: '+56912345678', car: 'Porsche 911 GT3 RS' },
  { id: 'c2', name: 'Marta Gómez', phone: '+56987654321', car: 'Audi RS6 Avant' },
];

const INITIAL_JOBS: Job[] = [
  {
    id: 'j1',
    customerId: 'c1',
    bay: 'Bahía 1',
    steps: [
      { id: 's1', name: 'Lavado y Descontaminado', description: 'Clay bar profunda', completed: true, icon: 'water_drop' },
      { id: 's2', name: 'Corrección de Pintura', description: 'Eliminación de swirls', completed: false, icon: 'flare' },
      { id: 's3', name: 'Sellado Cerámico', description: 'Graphene 9H', completed: false, icon: 'shield' },
    ]
  }
];

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Cerámico Graphene 9H', price: 450000, category: 'Protección', icon: 'shield', type: 'servicio' },
  { id: '2', name: 'Corrección Pintura (Etapa 2)', price: 250000, category: 'Estética', icon: 'flare', type: 'servicio' },
  { id: '101', name: 'Shampoo pH Neutro', price: 15900, category: 'Insumos', icon: 'water_drop', type: 'producto' },
];

const App: React.FC = () => {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const location = useLocation();

  const addTransaction = (t: Transaction) => setTransactions(prev => [t, ...prev]);

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background-dark text-white shadow-2xl relative border-x border-white/5 pb-24">
      <Routes>
        <Route path="/" element={<DashboardPage customers={customers} jobs={jobs} />} />
        <Route path="/tracking/:jobId" element={<TrackingPage customers={customers} jobs={jobs} setJobs={setJobs} />} />
        <Route path="/advisor" element={<AdvisorPage />} />
        <Route path="/pos" element={<POSPage products={products} addTransaction={addTransaction} />} />
        <Route path="/customers" element={<CustomersPage customers={customers} setCustomers={setCustomers} />} />
        <Route path="/accounting" element={<AccountingPage transactions={transactions} addTransaction={addTransaction} />} />
      </Routes>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-background-dark/80 backdrop-blur-xl border-t border-white/5 px-6 py-4 z-50 flex justify-between items-center">
        <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-primary' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined text-[26px]">dashboard</span>
          <span className="text-[9px] font-bold uppercase tracking-widest">Inicio</span>
        </Link>
        <Link to="/accounting" className={`flex flex-col items-center gap-1 ${location.pathname === '/accounting' ? 'text-primary' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined text-[26px]">payments</span>
          <span className="text-[9px] font-bold uppercase tracking-widest">Caja</span>
        </Link>
        <Link to="/pos" className="relative -top-8 size-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/40 border-4 border-background-dark active:scale-95 transition-all">
          <span className="material-symbols-outlined text-3xl">add</span>
        </Link>
        <Link to="/customers" className={`flex flex-col items-center gap-1 ${location.pathname === '/customers' ? 'text-primary' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined text-[26px]">group</span>
          <span className="text-[9px] font-bold uppercase tracking-widest">Clientes</span>
        </Link>
        <Link to="/advisor" className={`flex flex-col items-center gap-1 ${location.pathname === '/advisor' ? 'text-primary' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined text-[26px]">auto_awesome</span>
          <span className="text-[9px] font-bold uppercase tracking-widest">Asesor</span>
        </Link>
      </nav>
    </div>
  );
};

export default App;
