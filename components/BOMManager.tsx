
import React, { useState } from 'react';
import { AppState, Product, BOMEntry, Material } from '../types';
import { Card, Badge, Button, cn } from './ui';

const BOMManager: React.FC<{ state: AppState }> = ({ state }) => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(state.products[0]?.product_id || null);

  const activeProduct = state.products.find(p => p.product_id === selectedProductId);
  const activeBOM = state.bom.filter(b => b.product_id === selectedProductId);

  const getPart = (id: string) => state.materials.find(m => m.part_id === id);

  const calculateBuildPotential = (productId: string) => {
    const components = state.bom.filter(b => b.product_id === productId);
    if (components.length === 0) return 0;
    
    let minBuild = Infinity;
    components.forEach(comp => {
      const stock = state.stock.find(s => s.part_id === comp.part_id)?.quantity_available || 0;
      // Also consider successor stock for build potential if primary is low
      const part = getPart(comp.part_id);
      let totalStock = stock;
      if (part?.successor_parts) {
        part.successor_parts.forEach(succId => {
          totalStock += state.stock.find(s => s.part_id === succId)?.quantity_available || 0;
        });
      }

      const buildable = Math.floor(totalStock / comp.quantity);
      if (buildable < minBuild) minBuild = buildable;
    });
    return minBuild === Infinity ? 0 : minBuild;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Engineering Registry</h3>
        <div className="space-y-2">
          {state.products.map(product => (
            <button
              key={product.product_id}
              onClick={() => setSelectedProductId(product.product_id)}
              className={cn(
                "w-full text-left px-5 py-4 rounded-2xl border-2 transition-all group",
                selectedProductId === product.product_id 
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              )}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-black text-sm">{product.model}</span>
                <Badge variant={selectedProductId === product.product_id ? 'success' : 'default'} className="text-[8px]">
                  {product.version}
                </Badge>
              </div>
              <div className="text-[10px] opacity-60 font-medium truncate">{product.product_name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        {activeProduct ? (
          <Card className="p-0 overflow-hidden border-slate-800 bg-slate-900/40 backdrop-blur-xl">
            <div className="px-8 py-8 border-b border-slate-800 bg-slate-900/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-black text-white tracking-tight">{activeProduct.product_name}</h2>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span>ID: {activeProduct.product_id}</span>
                  <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                  <span>Rev: {activeProduct.version}</span>
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex-1 md:flex-none md:min-w-[140px] text-center">
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Build Potential</div>
                  <div className="text-3xl font-black text-emerald-500">{calculateBuildPotential(activeProduct.product_id)}</div>
                </div>
              </div>
            </div>

            <div className="p-0">
              <table className="w-full text-left">
                <thead className="bg-slate-950/40 text-slate-500 text-[9px] uppercase tracking-[0.2em] font-black border-b border-slate-800">
                  <tr>
                    <th className="px-8 py-4">Component Ref</th>
                    <th className="px-8 py-4">Engineering Specs</th>
                    <th className="px-8 py-4 text-center">Required</th>
                    <th className="px-8 py-4 text-right">Inventory Logic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {activeBOM.map((comp, i) => {
                    const part = getPart(comp.part_id);
                    const stock = state.stock.find(s => s.part_id === comp.part_id)?.quantity_available || 0;
                    const isShort = stock < comp.quantity;
                    
                    // Engineering change awareness
                    const successors = part?.successor_parts || [];
                    const successorStock = successors.reduce((acc, id) => acc + (state.stock.find(s => s.part_id === id)?.quantity_available || 0), 0);

                    return (
                      <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-8 py-5">
                          <div className="font-mono text-xs text-emerald-500/80 font-bold mb-1">{comp.part_id}</div>
                          {successors.length > 0 && (
                            <div className="flex items-center gap-1.5 mt-1">
                               <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                               <span className="text-[9px] font-bold text-amber-500/80 uppercase">Successor: {successors[0]}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-5">
                          <div className="text-sm font-bold text-slate-100">{part?.part_name}</div>
                          <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">{part?.part_type} • {part?.weight}kg</div>
                        </td>
                        <td className="px-8 py-5 text-center">
                           <div className="text-xl font-black text-white">{comp.quantity}</div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex flex-col items-end gap-1.5">
                            <Badge variant={isShort ? 'destructive' : 'success'}>
                              {isShort ? `${stock} (Critical)` : `${stock} Units`}
                            </Badge>
                            {isShort && successorStock > 0 && (
                              <div className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                ECO ALERT: Use {successors[0]} ({successorStock} avail)
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-[2.5rem] text-slate-600 bg-slate-900/10">
            <span className="text-4xl mb-4">🔧</span>
            <span className="text-xs uppercase font-black tracking-widest">Select an Active Configuration</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BOMManager;
