
import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import DashboardPage from './screens/DashboardPage.tsx';
import TrackingPage from './screens/TrackingPage.tsx';
import LogbookPage from './screens/LogbookPage.tsx';
import AdvisorPage from './screens/AdvisorPage.tsx';
import POSPage from './screens/POSPage.tsx';
import CustomersPage from './screens/CustomersPage.tsx';
import ServiceManagementPage from './screens/ServiceManagementPage.tsx';
import AccountingPage from './screens/AccountingPage.tsx';

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
      { id: 's1', name: 'Lavado y Descontaminado', description: 'Clay bar y limpieza profunda', completed: true, icon: 'water_drop' },
      { id: 's2', name: 'Corrección de Pintura', description: 'Eliminación de micro-swirls', completed: false, icon: 'flare' },
      { id: 's3', name: 'Sellado Cerámico', description: 'Protección Graphene 9H', completed: false, icon: 'shield' },
      { id: 's4', name: 'Detallado Interior', description: 'Limpieza de cueros y alcántara', completed: false, icon: 'airline_seat_recline_extra' },
    ]
  },
  {
    id: 'j2',
    customerId: 'c2',
    bay: 'Bahía 2',
    steps: [
      { id: 's1', name: 'Lavado y Descontaminado', description: 'Limpieza técnica', completed: true, icon: 'water_drop' },
      { id: 's2', name: 'Corrección de Pintura', description: 'Pulido etapa 1', completed: true, icon: 'flare' },
      { id: 's3', name: 'Sellado Cerámico', description: 'Protección Básica', completed: false, icon: 'shield' },
    ]
  }
];

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Cerámico Graphene 9H', price: 450000, category: 'Protección', icon: 'shield', type: 'servicio', barcode: 'SVC001' },
  { id: '2', name: 'Corrección Pintura (Etapa 2)', price: 250000, category: 'Estética', icon: 'flare', type: 'servicio', barcode: 'SVC002' },
  { id: '3', name: 'Detallado Interior Full', price: 85000, category: 'Interior', icon: 'airline_seat_recline_extra', type: 'servicio', barcode: 'SVC003' },
  { id: '101', name: 'Shampoo pH Neutro (500ml)', price: 15900, category: 'Insumos', icon: 'water_drop', type: 'producto', barcode: '78000000001' },
  { id: '102', name: 'Polera Apex "Black Edition"', price: 18900, category: 'Merch', icon: 'apparel', type: 'producto', barcode: '78000000002' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2024-05-20', description: 'Venta Cerámico Porsche', amount: 450000, type: 'ingreso', category: 'Ventas' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  const getActiveTab = () => {
    if (path === '/') return 'home';
    if (path === '/accounting') return 'accounting';
    if (path.includes('/tracking')) return 'tracking';
    if (path === '/advisor') return 'advisor';
    if (path === '/pos') return 'pos';
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <div className="relative min-h-screen max-w-md mx-auto shadow-2xl bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-x-hidden font-display antialiased pb-24 border-x border-white/5">
      {children}
      
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-4 pb-6 pt-3 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-2">
          <Link to="/" className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-primary' : 'text-slate-400 dark:text-slate-600'}`}>
            <span className={`material-symbols-outlined text-[26px] ${activeTab === 'home' ? 'fill-1' : ''}`}>dashboard</span>
            <span className="text-[9px] font-bold uppercase tracking-tighter">Inicio</span>
          </Link>
          <Link to="/accounting" className={`flex flex-col items-center gap-1 ${activeTab === 'accounting' ? 'text-primary' : 'text-slate-400 dark:text-slate-600'}`}>
            <span className={`material-symbols-outlined text-[26px] ${activeTab === 'accounting' ? 'fill-1' : ''}`}>payments</span>
            <span className="text-[9px] font-bold uppercase tracking-tighter">Finanzas</span>
          </Link>
          <div className="relative -top-8">
            <Link to="/pos" className={`flex items-center justify-center size-14 rounded-full ${activeTab === 'pos' ? 'bg-accent-orange' : 'bg-primary'} text-white shadow-lg shadow-primary/40 border-4 border-background-light dark:border-background-dark active:scale-95 transition-all`}>
              <span className="material-symbols-outlined text-[32px]">point_of_sale</span>
            </Link>
          </div>
          <Link to="/tracking/j1" className={`flex flex-col items-center gap-1 ${activeTab === 'tracking' ? 'text-primary' : 'text-slate-400 dark:text-slate-600'}`}>
            <span className={`material-symbols-outlined text-[26px] ${activeTab === 'tracking' ? 'fill-1' : ''}`}>receipt_long</span>
            <span className="text-[9px] font-bold uppercase tracking-tighter">Servicio</span>
          </Link>
          <Link to="/advisor" className={`flex flex-col items-center gap-1 ${activeTab === 'advisor' ? 'text-primary' : 'text-slate-400 dark:text-slate-600'}`}>
            <span className={`material-symbols-outlined text-[26px] ${activeTab === 'advisor' ? 'fill-1' : ''}`}>smart_toy</span>
            <span className="text-[9px] font-bold uppercase tracking-tighter">Asesor</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
  };

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage customers={customers} jobs={jobs} />} />
        <Route path="/tracking/:jobId" element={<TrackingPage customers={customers} jobs={jobs} setJobs={setJobs} />} />
        <Route path="/logbook" element={<LogbookPage />} />
        <Route path="/advisor" element={<AdvisorPage />} />
        <Route path="/pos" element={<POSPage products={products} addTransaction={addTransaction} />} />
        <Route path="/customers" element={<CustomersPage customers={customers} setCustomers={setCustomers} />} />
        <Route path="/admin-services" element={<ServiceManagementPage products={products} setProducts={setProducts} />} />
        <Route path="/accounting" element={<AccountingPage transactions={transactions} addTransaction={addTransaction} />} />
      </Routes>
    </Layout>
  );
};

export default App;
