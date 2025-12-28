
import React, { useState } from 'react';
import { AppState, BOM, BOMComponent } from '../types';

interface Props {
  state: AppState;
  onUpdate: (boms: BOM[]) => void;
}

const BOMManager: React.FC<Props> = ({ state, onUpdate }) => {
  const [selectedBomId, setSelectedBomId] = useState<string | null>(state.boms[0]?.id || null);

  const activeBom = state.boms.find(b => b.id === selectedBomId);

  const getPartName = (id: string) => state.parts.find(p => p.id === id)?.name || id;

  const calculateTotalCost = (bom: BOM) => {
    return bom.components.reduce((acc, comp) => {
      const offer = state.suppliers.find(s => s.partId === comp.partId);
      return acc + (offer?.pricePerUnit || 0) * comp.quantity;
    }, 0).toFixed(2);
  };

  const checkBuildability = (bom: BOM) => {
    let minBuild = Infinity;
    bom.components.forEach(comp => {
      const stock = state.inventory.find(i => i.partId === comp.partId)?.quantityAvailable || 0;
      const buildable = Math.floor(stock / comp.quantity);
      if (buildable < minBuild) minBuild = buildable;
    });
    return minBuild === Infinity ? 0 : minBuild;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar - BOM Selection */}
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Voltway Models</h3>
        <div className="space-y-2">
          {state.boms.map(bom => (
            <button
              key={bom.id}
              onClick={() => setSelectedBomId(bom.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all border ${
                selectedBomId === bom.id 
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="font-bold text-sm">{bom.model}</div>
              <div className="text-[10px] opacity-70 uppercase tracking-tighter">{bom.version}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Panel - Technical Specs */}
      <div className="lg:col-span-3 space-y-6">
        {activeBom ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">{activeBom.model} <span className="text-emerald-500">{activeBom.version}</span></h2>
                <div className="flex gap-4 mt-2">
                  <span className="text-xs text-slate-500">Components: <b className="text-slate-300">{activeBom.components.length}</b></span>
                  <span className="text-xs text-slate-500">Unit Build Cost: <b className="text-emerald-400">${calculateTotalCost(activeBom)}</b></span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Max Build Potential</div>
                <div className="text-3xl font-bold text-white">{checkBuildability(activeBom)} <span className="text-sm text-slate-500">units</span></div>
              </div>
            </div>

            <div className="p-0">
              <table className="w-full text-left">
                <thead className="bg-slate-800/30 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-8 py-4">Part ID</th>
                    <th className="px-8 py-4">Description</th>
                    <th className="px-8 py-4 text-right">Qty</th>
                    <th className="px-8 py-4">Stock Context</th>
                    <th className="px-8 py-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {activeBom.components.map((comp, i) => {
                    const stock = state.inventory.find(inv => inv.partId === comp.partId)?.quantityAvailable || 0;
                    const isShort = stock < comp.quantity;
                    return (
                      <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-8 py-4 font-mono text-xs text-emerald-500/80">{comp.partId}</td>
                        <td className="px-8 py-4 text-sm font-medium">{getPartName(comp.partId)}</td>
                        <td className="px-8 py-4 text-right font-bold text-white">{comp.quantity}</td>
                        <td className="px-8 py-4">
                          <div className={`text-[10px] font-bold ${isShort ? 'text-red-400' : 'text-slate-500'}`}>
                            {stock} in WH
                          </div>
                          <div className="w-16 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                            <div 
                              className={`h-full ${isShort ? 'bg-red-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${Math.min((stock / (comp.quantity * 2)) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-xs text-slate-500 italic">{comp.notes || '-'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {activeBom.assemblyRequirements && (
              <div className="p-8 border-t border-slate-800 bg-slate-900/50">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Assembly Requirements</h4>
                <ul className="space-y-2">
                  {activeBom.assemblyRequirements.map((req, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-400">
                      <span className="text-emerald-500">•</span> {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-600">
            <span className="text-4xl mb-4">📋</span>
            <p className="font-medium text-sm">Select a technical model to view specifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BOMManager;
