
import React from 'react';
import { AppState } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
// Added missing Button import to resolve "Cannot find name 'Button'" errors
import { Card, Badge, cn, Button } from './ui';

interface Props {
  state: AppState;
  onAskHugo: () => void;
}

const Dashboard: React.FC<Props> = ({ state, onAskHugo }) => {
  // Analytical Logic
  const shortages = state.stock.filter(s => {
    const config = state.dispatch_parameters.find(p => p.part_id === s.part_id);
    return config ? s.quantity_available <= (config.config_data?.min_stock || 0) : false;
  });

  const revenueAtRisk = state.sales_orders
    .filter(so => so.status === 'confirmed')
    .reduce((acc, so) => {
      // Find components for this product
      const components = state.bom.filter(b => b.product_id === so.product_id);
      const isDelayed = components.some(comp => {
        const stock = state.stock.find(s => s.part_id === comp.part_id)?.quantity_available || 0;
        return stock < comp.quantity * so.quantity;
      });
      // Mock price calculation for "at risk"
      return isDelayed ? acc + (so.quantity * 1200) : acc; 
    }, 0);

  const chartData = state.stock.slice(0, 10).map(s => ({
    name: s.part_id,
    qty: s.quantity_available,
    min: state.dispatch_parameters.find(p => p.part_id === s.part_id)?.config_data?.min_stock || 0
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Production Risks" value={shortages.length.toString()} sub="Critical Shortages" color="rose" />
        <MetricCard title="Supply Chain" value={state.material_orders.filter(o => o.status === 'ordered').length.toString()} sub="Open POs" color="blue" />
        <MetricCard title="Revenue at Risk" value={`$${(revenueAtRisk / 1000).toFixed(1)}k`} sub="Delayed Shipments" color="amber" />
        <MetricCard title="Service Level" value="94.2%" sub="On-time fulfillment" color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Operational Feed */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 border-slate-800 bg-slate-900/40">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-3">
                  <span className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">🤖</span>
                  Agentic Risk Alerts
                </h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Live from Hugo Core</p>
              </div>
              <Button variant="outline" size="sm" onClick={onAskHugo} className="text-[10px] uppercase font-black tracking-widest">Run Global Check</Button>
            </div>
            
            <div className="space-y-4">
              {shortages.length > 0 ? (
                shortages.map((s, i) => {
                  const impactedSO = state.sales_orders.filter(so => 
                    state.bom.some(b => b.product_id === so.product_id && b.part_id === s.part_id)
                  ).length;
                  
                  return (
                    <div key={i} className="group p-5 bg-slate-950/40 hover:bg-slate-900/60 rounded-[2rem] border border-slate-800/50 transition-all flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 font-black text-xs">
                          !
                        </div>
                        <div>
                          <div className="font-black text-slate-200 text-sm">{s.part_id} Stock Depleted</div>
                          <p className="text-xs text-slate-500 font-medium">Available: {s.quantity_available} | Impact: {impactedSO} Orders</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="destructive" className="h-8 flex items-center">High Priority</Badge>
                        <Button variant="secondary" size="sm" onClick={onAskHugo} className="text-[10px] h-8 font-black uppercase">Mitigate</Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-10 text-center border-2 border-dashed border-slate-800 rounded-[2rem]">
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">No critical failures detected in current manufacturing loop.</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-8 border-slate-800 h-[400px]">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Inventory Dynamics vs Reorder Thresholds</h3>
                <div className="flex gap-4 text-[9px] uppercase font-bold tracking-widest">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Available</div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 bg-slate-700 rounded-full"></span> Safety Stock</div>
                </div>
             </div>
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: '#1e293b'}}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '12px' }} 
                  />
                  <Bar dataKey="qty" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                  <Bar dataKey="min" fill="#334155" radius={[4, 4, 0, 0]} barSize={8} />
                </BarChart>
             </ResponsiveContainer>
          </Card>
        </div>

        {/* Tactical Overview Sidebar */}
        <div className="space-y-6">
           <Card className="p-6 border-slate-800 bg-slate-900/50">
              <h4 className="font-black text-slate-500 mb-6 uppercase text-[9px] tracking-widest">Facility Utilization</h4>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wide">
                       <span>Warehouse Capacity</span>
                       <span>72%</span>
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                       <div className="h-full bg-blue-500 w-[72%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wide">
                       <span>WIP Throughput</span>
                       <span>88%</span>
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                       <div className="h-full bg-emerald-500 w-[88%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    </div>
                 </div>
              </div>
           </Card>

           <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 shadow-2xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl transition-transform group-hover:scale-110">⚡</div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-2">Lead Time Volatility</h4>
              <p className="text-xs font-medium opacity-80 leading-relaxed mb-6">Motors (Cat: P3xx) are experiencing +4 day shifts in global transit. Safety stock levels should be recalibrated.</p>
              <Button onClick={onAskHugo} className="w-full h-12 bg-white text-indigo-700 hover:bg-slate-100 border-none font-black text-xs uppercase tracking-widest shadow-xl">Tune Dispatch</Button>
           </div>

           <Card className="p-6 border-slate-800 bg-slate-950/50 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
                ⭐
              </div>
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Supplier Rating</h4>
              <div className="text-2xl font-black text-emerald-500 mb-1">A+</div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Supply Network Robust</p>
           </Card>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ title: string; value: string; sub: string; color: 'rose' | 'emerald' | 'blue' | 'amber' }> = ({ title, value, sub, color }) => {
  const colors = {
    rose: 'text-rose-500 bg-rose-500/5 border-rose-500/20 shadow-rose-500/5',
    emerald: 'text-emerald-500 bg-emerald-500/5 border-emerald-500/20 shadow-emerald-500/5',
    blue: 'text-blue-500 bg-blue-500/5 border-blue-500/20 shadow-blue-500/5',
    amber: 'text-amber-500 bg-amber-500/5 border-amber-500/20 shadow-amber-500/5',
  };
  
  return (
    <Card className={cn("p-6 border-slate-800 transition-all hover:scale-[1.02]", colors[color])}>
      <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">{title}</div>
      <div className={cn("text-4xl font-black mb-1 tracking-tight", colors[color].split(' ')[0])}>{value}</div>
      <div className="text-[10px] text-slate-600 font-bold uppercase tracking-tight">{sub}</div>
    </Card>
  );
};

export default Dashboard;
