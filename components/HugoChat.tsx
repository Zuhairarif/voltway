
import React, { useState, useRef, useEffect } from 'react';
import { AppState } from '../types';
import { askHugo } from '../services/geminiService';

interface Message {
  role: 'user' | 'hugo';
  content: string;
}

const HugoChat: React.FC<{ state: AppState }> = ({ state }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'hugo', content: "Hello! I'm Hugo, your Voltway procurement agent. I've indexed your BOMs, Stock, and Emails. How can I help you optimize operations today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await askHugo(userMsg, state);
    
    setMessages(prev => [...prev, { role: 'hugo', content: response }]);
    setIsLoading(false);
  };

  const suggestions = [
    "How many S2 V2 scooters can we build next week?",
    "Which parts are running low, and what’s causing it?",
    "Analyze PO-001 delay risk.",
    "Show me a summary of supplier issues this week."
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-xl">🤖</div>
          <div>
            <div className="font-bold">Hugo v2.5</div>
            <div className="text-xs text-slate-400">Agentic Procurement Reasoning Engine</div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              msg.role === 'user' 
              ? 'bg-emerald-600 text-white rounded-br-none' 
              : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none prose prose-invert prose-sm max-w-none'
            }`}>
              {msg.role === 'hugo' ? (
                 <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-bl-none flex gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.map((s, i) => (
            <button 
              key={i} 
              onClick={() => setInput(s)}
              className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-full text-slate-400 transition-colors"
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
            placeholder="Ask Hugo about stock, production, or suppliers..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-900 font-bold px-8 rounded-xl transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default HugoChat;
