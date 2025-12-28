
import React, { useState } from 'react';

interface Column {
  key: string;
  label: string;
}

interface Props {
  title: string;
  data: any[];
  columns: Column[];
}

const DataTable: React.FC<Props> = ({ title, data, columns }) => {
  const [search, setSearch] = useState('');

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <div>
          <h3 className="text-lg font-bold text-slate-100">{title}</h3>
          <p className="text-xs text-slate-500 mt-1">{filteredData.length} records found</p>
        </div>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Quick search..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-emerald-500 outline-none w-64 placeholder:text-slate-600"
          />
          <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg transition-colors">
            + Add New
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-800/30 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-6 py-4">{col.label}</th>
              ))}
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredData.map((row, i) => (
              <tr key={i} className="hover:bg-slate-800/20 transition-colors group">
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4 text-sm text-slate-300">
                    {col.key === 'status' ? (
                       <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                         row[col.key] === 'delivered' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                       }`}>
                         {row[col.key]}
                       </span>
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-slate-500 hover:text-emerald-400 mr-3 text-xs">Edit</button>
                  <button className="text-slate-500 hover:text-red-400 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
