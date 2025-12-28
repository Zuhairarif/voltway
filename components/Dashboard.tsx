
import React from 'react';
import { AppState } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  state: AppState;
  onAskHugo: () => void;
}

const Dashboard: React.FC<Props> = ({ state, onAskHugo }) => {
  const shortages = state.stock.filter(s => {
    const config = state.dispatch_parameters.find(p => p.part_id === s.part_id);
    return config ? s.quantity_available <= (config.config_data?.min_stock || 0) : false;
  });

  const chartData = state.stock.slice(0, 8).map(s => ({
    name: s.part_id,
    qty: s.quantity_available
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Critical Shortages" value={shortages.length.toString()} color="text-rose-500" trend="Action required" />
        <Card title="Open POs" value={state.material_orders.filter(o => o.status === 'ordered').length.toString()} color="text-blue-400" trend="Supply inbound" />
        <Card title="Sales Volume" value={state.sales_orders.reduce((a, b) => a + b.quantity, 0).toString()} color="text-emerald-500" trend="Active demand" />
        <Card title="Supplier Count" value={new Set(state.suppliers.map(s => s.supplier_id)).size.toString()} color="text-amber-500" trend="Network active" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">🤖</span>
              Operations Overview
            </h3>
            <div className="space-y-4">
              {shortages.length > 0 ? (
                shortages.map((s, i) => (
                  <div key={i} className="p-4 bg-slate-950/50 rounded-2xl border-l-4 border-l-rose-500 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-200">Stock Alert: {s.part_id}</div>
                      <p className="text-xs text-slate-500">Only {s.quantity_available} units remaining at {s.location}.</p>
                    </div>
                    <button onClick={onAskHugo} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold rounded-xl transition-colors">Resolve</button>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-emerald-500/5 rounded-2xl border-l-4 border-l-emerald-500 text-emerald-400/80 italic text-sm">
                  "No critical stock alerts detected. All warehouse levels are above minimum thresholds."
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                <Bar dataKey="qty" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h4 className="font-bold text-slate-300 mb-4 uppercase text-[10px] tracking-widest">Facility Uptime</h4>
              <div className="text-4xl font-black text-emerald-500 mb-1">99.8%</div>
              <p className="text-xs text-slate-500">All assembly lines operating within nominal parameters.</p>
           </div>
           <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 shadow-lg shadow-emerald-500/10 text-slate-950">
              <h4 className="font-bold mb-1">Procurement Sync</h4>
              <p className="text-xs font-medium opacity-80 mb-4">Cloud synchronization is active and mirroring to Supabase.</p>
              <button className="w-full py-3 bg-slate-950 text-emerald-400 text-xs font-bold rounded-xl hover:opacity-90 transition-opacity uppercase tracking-widest">System Healthy</button>
           </div>
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<{ title: string; value: string; color: string; trend: string }> = ({ title, value, color, trend }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{title}</div>
    <div className={`text-4xl font-black ${color} mb-1`}>{value}</div>
    <div className="text-[10px] text-slate-600 font-medium uppercase tracking-tighter">{trend}</div>
  </div>
);

export default Dashboard;
