
import React from 'react';
import { changeLog } from '../data/changeLogData';
import { Card, Badge, cn } from './ui';

const VersionHistory: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-black text-white tracking-tight mb-2">System Iterations</h2>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Version History & Release Track</p>
      </div>

      <div className="relative space-y-16">
        {/* The Timeline line */}
        <div className="absolute left-[23px] top-4 bottom-0 w-0.5 bg-slate-800"></div>

        {changeLog.map((entry, idx) => (
          <div key={entry.version} className="relative pl-16 group">
            {/* The Dot */}
            <div className={cn(
              "absolute left-0 top-1 w-12 h-12 rounded-2xl border-2 flex items-center justify-center bg-slate-950 transition-all z-10",
              idx === 0 ? "border-emerald-500 text-emerald-500 shadow-lg shadow-emerald-500/20" : "border-slate-800 text-slate-600"
            )}>
              <span className="text-[10px] font-black uppercase">{entry.version.split('.')[0]}.{entry.version.split('.')[1]}</span>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">{entry.title}</h3>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Released: {entry.date}</div>
                </div>
                <Badge variant={idx === 0 ? "success" : "default"}>v{entry.version}</Badge>
              </div>

              <Card className="p-6 border-slate-800 bg-slate-900/40 backdrop-blur-sm">
                <ul className="space-y-4">
                  {entry.changes.map((change, i) => (
                    <li key={i} className="flex gap-4">
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-1.5 shrink-0",
                        change.type === 'feature' && "bg-emerald-500",
                        change.type === 'fix' && "bg-rose-500",
                        change.type === 'infra' && "bg-blue-500",
                        change.type === 'security' && "bg-amber-500",
                      )}></div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-600 tracking-tighter mr-2">{change.type}</span>
                        <p className="text-sm text-slate-400 font-medium">{change.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VersionHistory;
