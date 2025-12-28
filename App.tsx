
import React, { useState } from 'react';
import * as initialData from './data/mockData';
import Dashboard from './components/Dashboard';
import HugoChat from './components/HugoChat';
import DataTable from './components/DataTable';
import BOMManager from './components/BOMManager';
import { AppState } from './types';

type Tab = 'dashboard' | 'hugo' | 'parts' | 'inventory' | 'orders' | 'suppliers' | 'boms';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [state, setState] = useState<AppState>({
    parts: initialData.parts,
    strategy: initialData.strategy,
    purchaseOrders: initialData.purchaseOrders,
    salesOrders: initialData.salesOrders,
    inventory: initialData.inventory,
    movements: initialData.movements,
    suppliers: initialData.suppliers,
    boms: initialData.boms,
  });

  const updateState = (key: keyof AppState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'hugo', label: 'Ask Hugo AI', icon: '🤖' },
    { id: 'boms', label: 'Technical BOM', icon: '📋' },
    { id: 'parts', label: 'Parts Master', icon: '🔩' },
    { id: 'inventory', label: 'Inventory Control', icon: '📦' },
    { id: 'orders', label: 'Order Hub', icon: '📝' },
    { id: 'suppliers', label: 'Supplier Catalog', icon: '🏭' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <nav className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-6 shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-emerald-500/20">V</div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Voltway</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Industrial OS</p>
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-grow">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-800">
            <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">System Health</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Hugo Engine</span>
              <span className="text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Ready
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">/</span>
            <h2 className="text-sm font-semibold tracking-wide text-slate-300 uppercase">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="h-8 w-[1px] bg-slate-800"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-200">Ops Lead</p>
                <p className="text-[10px] text-slate-500">Facility WH-1</p>
              </div>
              <img src="https://picsum.photos/seed/ops/80/80" className="w-9 h-9 rounded-full ring-2 ring-slate-800 shadow-xl" alt="Profile" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'dashboard' && <Dashboard state={state} onAskHugo={() => setActiveTab('hugo')} />}
          {activeTab === 'hugo' && <HugoChat state={state} />}
          {activeTab === 'boms' && <BOMManager state={state} onUpdate={(newBoms) => updateState('boms', newBoms)} />}
          {activeTab === 'parts' && (
             <DataTable 
               title="Parts Master" 
               data={state.parts} 
               columns={[
                 { key: 'id', label: 'Part ID' },
                 { key: 'name', label: 'Description' },
                 { key: 'type', label: 'Type' },
                 { key: 'weight', label: 'KG' },
                 { key: 'successorParts', label: 'Successor' }
               ]}
             />
          )}
          {activeTab === 'inventory' && (
             <div className="space-y-8">
               <DataTable 
                 title="Current Stock Availability" 
                 data={state.inventory} 
                 columns={[
                   { key: 'partId', label: 'ID' },
                   { key: 'partName', label: 'Part' },
                   { key: 'location', label: 'Site' },
                   { key: 'quantityAvailable', label: 'Available Qty' }
                 ]}
               />
               <DataTable 
                 title="Inventory Strategy" 
                 data={state.strategy} 
                 columns={[
                   { key: 'partId', label: 'Part ID' },
                   { key: 'minStockLevel', label: 'Min Level' },
                   { key: 'reorderQuantity', label: 'Reorder Qty' },
                   { key: 'reorderIntervalDays', label: 'Interval (Days)' }
                 ]}
               />
             </div>
          )}
          {activeTab === 'orders' && (
            <div className="space-y-8">
               <DataTable 
                 title="Purchase Orders (Inbound)" 
                 data={state.purchaseOrders} 
                 columns={[
                   { key: 'id', label: 'PO ID' },
                   { key: 'partId', label: 'Part' },
                   { key: 'quantityOrdered', label: 'Qty' },
                   { key: 'expectedDeliveryDate', label: 'Due' },
                   { key: 'status', label: 'Status' }
                 ]}
               />
               <DataTable 
                 title="Sales Orders (Outbound)" 
                 data={state.salesOrders} 
                 columns={[
                   { key: 'id', label: 'SO ID' },
                   { key: 'model', label: 'Model' },
                   { key: 'version', label: 'Version' },
                   { key: 'quantity', label: 'Qty' },
                   { key: 'requestedDate', label: 'Requested' }
                 ]}
               />
            </div>
          )}
          {activeTab === 'suppliers' && (
            <DataTable 
              title="Supplier Pricing & Reliability" 
              data={state.suppliers} 
              columns={[
                { key: 'supplierId', label: 'Supplier' },
                { key: 'partId', label: 'Part' },
                { key: 'pricePerUnit', label: 'Price ($)' },
                { key: 'leadTimeDays', label: 'Lead Time' },
                { key: 'reliabilityRating', label: 'Reliability' }
              ]}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
