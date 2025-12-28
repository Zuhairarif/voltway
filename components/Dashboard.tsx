
import React from 'react';
import { AppState } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  state: AppState;
  onAskHugo: () => void;
}

const Dashboard: React.FC<Props> = ({ state, onAskHugo }) => {
  // Fix: Map inventory to health alerts by cross-referencing with strategy reorder points
  const stockAlerts = state.inventory.filter(item => {
    const strat = state.strategy.find(s => s.partId === item.partId);
    return strat ? item.quantityAvailable <= strat.minStockLevel : false;
  });

  // Fix: Map chart data from inventory and parts collections
  const chartData = state.inventory.slice(0, 6).map(item => {
    const strat = state.strategy.find(s => s.partId === item.partId);
    return {
      name: item.partName.split(' ')[0],
      qty: item.quantityAvailable,
      reorder: strat?.minStockLevel || 0
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Critical Stockouts" value={stockAlerts.length.toString()} color="text-red-400" />
        {/* Fix: use purchaseOrders instead of materialOrders */}
        <Card title="Pending Deliveries" value={state.purchaseOrders.filter(po => po.status === 'ordered').length.toString()} color="text-blue-400" />
        <Card title="Open Orders (Units)" value={state.salesOrders.reduce((acc, curr) => acc + curr.quantity, 0).toString()} color="text-amber-400" />
        {/* Fix: Calculate unique suppliers from catalog */}
        <Card title="Active Suppliers" value={Array.from(new Set(state.suppliers.map(s => s.supplierId))).length.toString()} color="text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts & Insights */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="text-emerald-400">⚡</span> Hugo's Smart Alerts
            </h3>
            <div className="space-y-4">
              {/* Fix: Removed emails mapping as it doesn't exist in AppState; replacing with dynamic alerts */}
              <div className="p-4 bg-slate-800/50 rounded-xl border-l-4 border-amber-500">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-slate-200">Inventory Health Review</span>
                  <span className="text-xs text-slate-500">System Notification</span>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                  Hugo detected {stockAlerts.length} components falling below safety stock. Production planning suggests immediate rebalancing.
                </p>
                <button onClick={onAskHugo} className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider">
                  Solve with Hugo →
                </button>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-xl border-l-4 border-red-500">
                <div className="font-semibold text-slate-200">Stock Alert: {stockAlerts[0]?.partName || 'Critical Components'}</div>
                <p className="text-sm text-slate-400 mb-3">Current inventory ({stockAlerts[0]?.quantityAvailable || 0} units) is below reorder point. Lead times are projected to increase.</p>
                <button onClick={onAskHugo} className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider">
                  Generate Reorder Plan →
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6">Inventory Utilization (Top 6)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#f1f5f9' }}
                  />
                  <Bar dataKey="qty" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.qty < entry.reorder ? '#f87171' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Build Forecast */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-bold mb-6">Build Potential</h3>
          <p className="text-xs text-slate-400 mb-6">Calculated based on current warehouse stock & BOM requirements.</p>
          
          <div className="space-y-6 flex-grow">
            {/* Fix: Calculation based on mock parts and stock */}
            <BuildMeter label="S1-V1 (Base)" count={Math.min(state.inventory.find(i => i.partId === 'P300')?.quantityAvailable || 0, state.inventory.find(i => i.partId === 'P301')?.quantityAvailable || 0)} max={100} color="bg-emerald-500" />
            <BuildMeter label="S2-V2 (Adv)" count={Math.min(state.inventory.find(i => i.partId === 'P312')?.quantityAvailable || 0, 15)} max={100} color="bg-blue-500" />
            <BuildMeter label="Pro-Fleet" count={0} max={100} color="bg-red-500" />
          </div>

          <div className="mt-8 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
            <div className="text-sm font-semibold text-emerald-400 mb-1">Hugo's Tip:</div>
            <p className="text-xs text-slate-400 italic">"P312 Brushless Motor is currently flagged with quality blockers. Resolve technical debt to unlock Pro-Fleet assembly."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
    <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">{title}</div>
    <div className={`text-3xl font-bold ${color}`}>{value}</div>
  </div>
);

const BuildMeter: React.FC<{ label: string; count: number; max: number; color: string }> = ({ label, count, max, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-slate-300">{label}</span>
      <span className="font-bold text-white">{count} units</span>
    </div>
    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${(count / max) * 100}%` }}></div>
    </div>
  </div>
);

export default Dashboard;
