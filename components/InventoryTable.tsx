
import React, { useState } from 'react';
// Fix: Changed Material to Part and StockLevel to StockItem as per types.ts
import { AppState, Part, StockItem } from '../types';

const InventoryTable: React.FC<{ state: AppState }> = ({ state }) => {
  const [filter, setFilter] = useState('');

  // Fix: Map parts and inventory correctly using partId/id
  const rows = state.parts.map(p => {
    const s = state.inventory.find(st => st.partId === p.id);
    const strat = state.strategy.find(st => st.partId === p.id);
    const supplier = state.suppliers.find(sup => sup.partId === p.id);
    return { part: p, stock: s, strategy: strat, supplier };
  }).filter(r => 
    r.part.name.toLowerCase().includes(filter.toLowerCase()) || 
    r.part.type.toLowerCase().includes(filter.toLowerCase())
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
              // Fix: Logic updated to use quantityAvailable and minStockLevel
              const isCritical = stock && strategy && stock.quantityAvailable < strategy.minStockLevel;
              const isWarning = stock && strategy && stock.quantityAvailable <= strategy.minStockLevel * 1.2 && !isCritical;
              
              return (
                <tr key={part.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{part.id}</td>
                  <td className="px-6 py-4 font-medium">{part.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-[10px] text-slate-400">
                      {part.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold">{stock?.quantityAvailable || 0}</td>
                  <td className="px-6 py-4 text-right text-slate-400">{strategy?.minStockLevel || 0}</td>
                  <td className="px-6 py-4 text-right text-slate-400">{supplier?.leadTimeDays || '-'}</td>
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
