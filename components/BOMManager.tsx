
import React, { useState } from 'react';
import { AppState, Product, BOMEntry } from '../types';

const BOMManager: React.FC<{ state: AppState }> = ({ state }) => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(state.products[0]?.product_id || null);

  const activeProduct = state.products.find(p => p.product_id === selectedProductId);
  const activeBOM = state.bom.filter(b => b.product_id === selectedProductId);

  const getPartName = (id: string) => state.materials.find(m => m.part_id === id)?.part_name || id;

  const calculateBuildPotential = (productId: string) => {
    const components = state.bom.filter(b => b.product_id === productId);
    if (components.length === 0) return 0;
    
    let minBuild = Infinity;
    components.forEach(comp => {
      const stock = state.stock.find(s => s.part_id === comp.part_id)?.quantity_available || 0;
      const buildable = Math.floor(stock / comp.quantity);
      if (buildable < minBuild) minBuild = buildable;
    });
    return minBuild === Infinity ? 0 : minBuild;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Production Models</h3>
        {state.products.map(product => (
          <button
            key={product.product_id}
            onClick={() => setSelectedProductId(product.product_id)}
            className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all ${
              selectedProductId === product.product_id 
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
              : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <div className="font-black">{product.model}</div>
            <div className="text-[10px] opacity-60">{product.version} - {product.product_name}</div>
          </button>
        ))}
      </div>

      <div className="lg:col-span-3 space-y-6">
        {activeProduct ? (
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="px-10 py-10 border-b border-slate-800 bg-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h2 className="text-4xl font-black text-white">{activeProduct.product_name}</h2>
                <p className="text-slate-500 text-sm mt-2 font-medium">BOM ID: {activeProduct.product_id}</p>
              </div>
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 min-w-[180px]">
                <div className="text-[10px] text-slate-600 uppercase font-black tracking-widest mb-1">Max Build</div>
                <div className="text-4xl font-black text-white">{calculateBuildPotential(activeProduct.product_id)} <span className="text-xs text-slate-500 uppercase">Units</span></div>
              </div>
            </div>

            <table className="w-full text-left">
              <thead className="bg-slate-800/30 text-slate-500 text-[10px] uppercase tracking-widest font-black">
                <tr>
                  <th className="px-10 py-5">Part ID</th>
                  <th className="px-10 py-5">Description</th>
                  <th className="px-10 py-5 text-right">Required</th>
                  <th className="px-10 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {activeBOM.map((comp, i) => {
                  const stock = state.stock.find(s => s.part_id === comp.part_id)?.quantity_available || 0;
                  const isShort = stock < comp.quantity;
                  return (
                    <tr key={i} className="hover:bg-slate-800/20 group">
                      <td className="px-10 py-6 font-mono text-xs text-emerald-500/60 font-bold">{comp.part_id}</td>
                      <td className="px-10 py-6 text-sm font-bold text-slate-200">{getPartName(comp.part_id)}</td>
                      <td className="px-10 py-6 text-right font-black text-white text-lg">{comp.quantity}</td>
                      <td className="px-10 py-6">
                        <span className={`text-[10px] font-black uppercase ${isShort ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {isShort ? '⚠️ Shortage' : `${stock} Available`}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 uppercase font-bold tracking-widest">
            Select Model to view BOM
          </div>
        )}
      </div>
    </div>
  );
};

export default BOMManager;
