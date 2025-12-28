
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import HugoChat from './components/HugoChat';
import DataTable from './components/DataTable';
import BOMManager from './components/BOMManager';
import { Badge, cn } from './components/ui';
import { useQuery } from '@tanstack/react-query';
import { supabase } from './lib/supabase';
import { AppState } from './types';

type Tab = 'dashboard' | 'hugo' | 'materials' | 'products' | 'customers' | 'inventory' | 'orders' | 'suppliers' | 'boms';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  // We fetch the full state for Dashboard/Hugo, but DataTables handle their own internal queries
  const { data: fullState, isLoading } = useQuery<AppState>({
    queryKey: ['full_state'],
    queryFn: async () => {
      // Parallel fetch for overview
      const tables = ['materials', 'products', 'customers', 'bom', 'warehouses', 'stock', 'sales_orders', 'suppliers', 'material_orders', 'dispatch_parameters'];
      const results = await Promise.all(tables.map(t => supabase.from(t).select('*')));
      
      const state: any = {};
      tables.forEach((t, i) => {
        state[t] = results[i].data || [];
      });
      return state as AppState;
    },
    refetchInterval: 30000 // Refresh state every 30s
  });

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'hugo', label: 'Hugo AI', icon: '🤖' },
    { id: 'boms', label: 'Production BOM', icon: '📋' },
    { id: 'materials', label: 'Material Master', icon: '🔩' },
    { id: 'products', label: 'Product Catalog', icon: '🛵' },
    { id: 'customers', label: 'Client Base', icon: '👥' },
    { id: 'inventory', label: 'Stock Levels', icon: '📦' },
    { id: 'orders', label: 'Purchasing', icon: '📝' },
    { id: 'suppliers', label: 'Vendor Registry', icon: '🏭' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-6 shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-emerald-500/20">V</div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Voltway</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Industrial OS</p>
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-grow overflow-y-auto custom-scrollbar">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                activeTab === item.id 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800">
           <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Sync</span>
              </div>
              <Badge variant="success">Online</Badge>
           </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-xs font-black tracking-[0.2em] text-slate-500 uppercase">{activeTab}</h2>
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Env: Prod-Main
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {!fullState && isLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 font-medium tracking-widest uppercase">Initializing Core State...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <Dashboard state={fullState!} onAskHugo={() => setActiveTab('hugo')} />}
              {activeTab === 'hugo' && <HugoChat state={fullState!} />}
              {activeTab === 'boms' && <BOMManager state={fullState!} />}
              
              {activeTab === 'materials' && (
                <DataTable 
                  tableName="materials" 
                  title="Material" 
                  primaryKey="part_id"
                  columns={[
                    { key: 'part_id', label: 'Part ID' },
                    { key: 'part_name', label: 'Description' },
                    { key: 'part_type', label: 'Type' },
                    { key: 'weight', label: 'Weight (KG)' }
                  ]}
                />
              )}

              {activeTab === 'products' && (
                <DataTable 
                  tableName="products" 
                  title="Product" 
                  primaryKey="product_id"
                  columns={[
                    { key: 'product_id', label: 'Product ID' },
                    { key: 'model', label: 'Model' },
                    { key: 'version', label: 'Version' },
                    { key: 'product_name', label: 'Marketing Name' }
                  ]}
                />
              )}

              {activeTab === 'customers' && (
                <DataTable 
                  tableName="customers" 
                  title="Customer" 
                  primaryKey="customer_id"
                  columns={[
                    { key: 'customer_id', label: 'Client ID' },
                    { key: 'name', label: 'Organization' },
                    { key: 'type', label: 'Segment' }
                  ]}
                />
              )}

              {activeTab === 'inventory' && (
                <DataTable 
                  tableName="stock" 
                  title="Stock Level" 
                  primaryKey="part_id"
                  columns={[
                    { key: 'part_id', label: 'Material Ref' },
                    { key: 'location', label: 'Warehouse' },
                    { key: 'quantity_available', label: 'In Stock' }
                  ]}
                />
              )}

              {activeTab === 'orders' && (
                <DataTable 
                  tableName="material_orders" 
                  title="Material Order" 
                  primaryKey="order_id"
                  columns={[
                    { key: 'order_id', label: 'PO ID' },
                    { key: 'part_id', label: 'Part' },
                    { key: 'quantity_ordered', label: 'Qty' },
                    { key: 'status', label: 'Status' }
                  ]}
                />
              )}

              {activeTab === 'suppliers' && (
                <DataTable 
                  tableName="suppliers" 
                  title="Supplier" 
                  primaryKey="supplier_id"
                  columns={[
                    { key: 'supplier_id', label: 'Vendor ID' },
                    { key: 'part_id', label: 'Supplies Part' },
                    { key: 'price_per_unit', label: 'Unit Cost' },
                    { key: 'lead_time_days', label: 'Lead (Days)' }
                  ]}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
