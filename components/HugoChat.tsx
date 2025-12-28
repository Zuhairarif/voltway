
import React, { useState, useRef, useEffect } from 'react';
import { AppState } from '../types';
import { askHugo } from '../services/geminiService';
import { Card, Button, Input, Badge, cn } from './ui';

interface Message {
  role: 'user' | 'hugo';
  content: string;
  timestamp: Date;
}

const HugoChat: React.FC<{ state: AppState }> = ({ state }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'hugo', 
      content: "System Initialized. I am **Hugo**. I've audited the global Supply Chain for **Voltway**. Current build potentials are calculated. How can I optimize your assembly operations today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async (customMsg?: string) => {
    const userMsg = customMsg || input.trim();
    if (!userMsg || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg, timestamp: new Date() }]);
    setIsLoading(true);

    const response = await askHugo(userMsg, state);
    
    setMessages(prev => [...prev, { role: 'hugo', content: response, timestamp: new Date() }]);
    setIsLoading(false);
  };

  const operationalShortcuts = [
    { label: "Build Potential", query: "Calculate build potential for all scooter models based on current warehouse stock." },
    { label: "Lead Time Risk", query: "Which material orders are most at risk due to supplier lead time volatility?" },
    { label: "ECO Check", query: "Analyze Engineering Change impact: Which legacy parts should be returned in favor of successors?" },
    { label: "Dispatch Tune", query: "Recommend new reorder points for P300 and P301 based on current demand trends." }
  ];

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-160px)] grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 flex flex-col bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="bg-slate-900/60 backdrop-blur-xl px-8 py-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-emerald-500/20 text-slate-950 font-black">H</div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-slate-900 rounded-full animate-pulse"></div>
            </div>
            <div>
              <div className="font-black text-white text-lg tracking-tight leading-none mb-1">HUGO INDUSTRIAL ENGINE</div>
              <div className="flex items-center gap-2">
                 <Badge variant="success" className="h-4 px-1.5 text-[8px]">Core Online</Badge>
                 <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Model: Gemini 3 Pro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Feed */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 scroll-smooth custom-scrollbar bg-slate-950/10">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex group animate-in fade-in slide-in-from-bottom-4 duration-500", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn("max-w-[80%]", msg.role === 'user' ? 'text-right' : 'text-left')}>
                <div className="text-[10px] mb-2 font-black uppercase tracking-widest text-slate-600 px-1">
                  {msg.role === 'hugo' ? 'Hugo Core Intelligence' : 'Ops Lead Command'}
                </div>
                <div className={cn(
                  "p-6 rounded-[2rem] shadow-2xl text-sm leading-relaxed",
                  msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none prose prose-invert prose-emerald max-w-none'
                )}>
                  {msg.role === 'hugo' ? (
                     <div className="whitespace-pre-wrap font-medium" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<b class="text-emerald-400 font-black">$1</b>').replace(/\n/g, '<br/>') }} />
                  ) : (
                    <span className="font-black tracking-tight text-lg">{msg.content}</span>
                  )}
                </div>
                <div className="mt-2 text-[8px] font-bold text-slate-700 uppercase px-4">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-slate-900/50 border border-slate-800 px-8 py-5 rounded-[2rem] rounded-tl-none flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.5s]"></div>
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hugo is auditing records...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-8 border-t border-slate-800 bg-slate-900/40 backdrop-blur-xl">
          <div className="relative group">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Hugo to audit BOM, optimize reorder points, or analyze supplier risk..."
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-3xl px-8 py-6 pr-40 focus:outline-none focus:border-emerald-500/50 text-slate-100 shadow-2xl placeholder:text-slate-700 font-bold transition-all text-lg"
            />
            <button 
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="absolute right-3 top-3 bottom-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:grayscale text-slate-950 font-black px-10 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 uppercase tracking-widest text-xs"
            >
              Command
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Shortcuts */}
      <div className="space-y-6">
         <Card className="p-6 border-slate-800 bg-slate-900/50">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 px-1">Tactical Shortcuts</h4>
            <div className="space-y-3">
              {operationalShortcuts.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(s.query)}
                  className="w-full group text-left p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all active:scale-95"
                >
                   <div className="text-[10px] font-black text-emerald-400 uppercase mb-1">{s.label}</div>
                   <div className="text-[11px] text-slate-400 font-medium leading-tight group-hover:text-slate-200">{s.query}</div>
                </button>
              ))}
            </div>
         </Card>

         <Card className="p-6 border-slate-800 bg-slate-950/50">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Core Telemetry</h4>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-600 uppercase">Latency</span>
                  <span className="text-[10px] font-black text-emerald-500">240ms</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-600 uppercase">Context Depth</span>
                  <span className="text-[10px] font-black text-white">8,412 Tokens</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-600 uppercase">Reasoning Path</span>
                  <span className="text-[10px] font-black text-blue-400">Agentic v3.1</span>
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
};

export default HugoChat;
