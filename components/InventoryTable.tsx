
import React, { useState } from 'react';
// Fix: Use correct types Material and Stock from types.ts
import { AppState, Material, Stock } from '../types';

const InventoryTable: React.FC<{ state: AppState }> = ({ state }) => {
  const [filter, setFilter] = useState('');

  // Fix: Map materials and stock correctly using part_id and correct AppState properties
  const rows = state.materials.map(p => {
    const s = state.stock.find(st => st.part_id === p.part_id);
    const strat = state.dispatch_parameters.find(st => st.part_id === p.part_id);
    const supplier = state.suppliers.find(sup => sup.part_id === p.part_id);
    return { part: p, stock: s, strategy: strat, supplier };
  }).filter(r => 
    r.part.part_name.toLowerCase().includes(filter.toLowerCase()) || 
    r.part.part_type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <input 
          type="text" 
          placeholder="Filter parts..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm w-80 focus:ring-1 focus:ring-emerald-500 outline-none"
        />
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500 rounded-full"></span> Healthy</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-amber-500 rounded-full"></span> Warning</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Critical</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Part ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-right">Stock</th>
              <th className="px-6 py-4 text-right">Min Level</th>
              <th className="px-6 py-4 text-right">Lead Time (d)</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.map(({ part, stock, strategy, supplier }) => {
              // Fix: Logic updated to use quantity_available and min_stock from config_data
              const minStock = strategy?.config_data?.min_stock || 0;
              const isCritical = stock && strategy && stock.quantity_available < minStock;
              const isWarning = stock && strategy && stock.quantity_available <= minStock * 1.2 && !isCritical;
              
              return (
                <tr key={part.part_id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{part.part_id}</td>
                  <td className="px-6 py-4 font-medium">{part.part_name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-[10px] text-slate-400">
                      {part.part_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold">{stock?.quantity_available || 0}</td>
                  <td className="px-6 py-4 text-right text-slate-400">{minStock}</td>
                  <td className="px-6 py-4 text-right text-slate-400">{supplier?.lead_time_days || '-'}</td>
                  <td className="px-6 py-4">
                    {isCritical ? (
                      <span className="text-red-400 text-xs font-bold px-2 py-1 bg-red-400/10 rounded-full">CRITICAL</span>
                    ) : isWarning ? (
                      <span className="text-amber-400 text-xs font-bold px-2 py-1 bg-amber-400/10 rounded-full">LOW STOCK</span>
                    ) : (
                      <span className="text-emerald-400 text-xs font-bold px-2 py-1 bg-emerald-400/10 rounded-full">HEALTHY</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
