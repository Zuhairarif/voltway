
import React, { useState, useRef, useEffect } from 'react';
import { AppState } from '../types';
import { askHugo } from '../services/geminiService';

interface Message {
  role: 'user' | 'hugo';
  content: string;
  timestamp: Date;
}

const HugoChat: React.FC<{ state: AppState }> = ({ state }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'hugo', 
      content: "System Initialized. I am Hugo. I've analyzed your industrial state and am ready to optimize your procurement and BOM configurations. What is your objective?",
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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg, timestamp: new Date() }]);
    setIsLoading(true);

    const response = await askHugo(userMsg, state);
    
    setMessages(prev => [...prev, { role: 'hugo', content: response, timestamp: new Date() }]);
    setIsLoading(false);
  };

  const suggestions = [
    "Identify top 3 production bottlenecks.",
    "Draft a reorder plan for S1 motors.",
    "Calculate S2-V2 build potential.",
    "How does SupA's reliability impact us?"
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-180px)] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900/80 backdrop-blur-md px-8 py-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">🤖</div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse"></div>
          </div>
          <div>
            <div className="font-black text-slate-100 tracking-tight">HUGO INDUSTRIAL CORE</div>
            <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active Reasoning Engine</div>
          </div>
        </div>
        <div className="flex gap-2">
           <div className="w-2 h-2 rounded-full bg-slate-700"></div>
           <div className="w-2 h-2 rounded-full bg-slate-700"></div>
           <div className="w-2 h-2 rounded-full bg-slate-700"></div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] group`}>
              <div className={`text-[10px] mb-2 font-bold uppercase tracking-tighter text-slate-500 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.role === 'hugo' ? 'HUGO CORE' : 'OPS COMMAND'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className={`p-5 rounded-2xl shadow-lg leading-relaxed ${
                msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none prose prose-invert prose-sm max-w-none'
              }`}>
                {msg.role === 'hugo' ? (
                   <div className="whitespace-pre-wrap font-medium text-sm" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<b class="text-emerald-400">$1</b>').replace(/\n/g, '<br/>') }} />
                ) : (
                  <span className="font-semibold text-sm">{msg.content}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-800 border border-slate-700 px-6 py-4 rounded-2xl rounded-tl-none flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hugo is thinking</span>
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-slate-800 bg-slate-900/50">
        <div className="flex flex-wrap gap-2 mb-6">
          {suggestions.map((s, i) => (
            <button 
              key={i} 
              onClick={() => setInput(s)}
              className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-xl text-slate-400 transition-all hover:border-emerald-500/30"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-4">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Command Hugo: e.g. 'Generate PO for P312 motors'..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-200 shadow-inner placeholder:text-slate-700 font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:grayscale text-slate-950 font-black px-10 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-xs"
          >
            Execute
          </button>
        </div>
      </div>
    </div>
  );
};

export default HugoChat;
