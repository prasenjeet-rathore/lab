import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Bot, User, Search, Loader2, ExternalLink } from 'lucide-react';
import { CaseData, GeminiMessage } from '../types';
import { analyzeCase } from '../services/geminiService';

interface GeminiCopilotProps {
  caseData: CaseData;
}

const GeminiCopilot: React.FC<GeminiCopilotProps> = ({ caseData }) => {
  const [messages, setMessages] = useState<GeminiMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial analysis on mount
  useEffect(() => {
    const initAnalysis = async () => {
      setIsLoading(true);
      const result = await analyzeCase(caseData);
      setMessages([
        { 
          role: 'model', 
          text: result.text, 
          timestamp: new Date(),
          sources: result.sources
        }
      ]);
      setIsLoading(false);
    };

    if (messages.length === 0) {
      initAnalysis();
    }
  }, [caseData]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: GeminiMessage = { role: 'user', text: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const result = await analyzeCase(caseData, inputValue);
    
    const botMsg: GeminiMessage = { 
      role: 'model', 
      text: result.text, 
      timestamp: new Date(),
      sources: result.sources
    };
    
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <Sparkles size={18} className="text-yellow-300" />
            <h3 className="font-bold tracking-wide">Validator Assistant</h3>
        </div>
        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">PRO-1.5</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 shadow-sm ${msg.role === 'user' ? 'bg-slate-200 ml-2' : 'bg-indigo-100 mr-2'}`}>
                    {msg.role === 'user' ? <User size={14} className="text-slate-600" /> : <Bot size={16} className="text-indigo-600" />}
                </div>
                <div className={`p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-slate-800 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
                   {/* Render Markdown-like simple bolding */}
                   <p className="whitespace-pre-wrap leading-relaxed">
                     {msg.text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                   </p>
                   
                   {/* Sources / Grounding */}
                   {msg.sources && msg.sources.length > 0 && (
                     <div className="mt-3 pt-3 border-t border-slate-100">
                       <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center">
                         <Search size={10} className="mr-1" />
                         Sources
                       </p>
                       <ul className="space-y-1">
                         {msg.sources.map((src, i) => (
                           <li key={i}>
                             <a href={src.uri} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs text-blue-600 hover:underline truncate">
                               <ExternalLink size={10} className="mr-1 flex-shrink-0" />
                               {src.title}
                             </a>
                           </li>
                         ))}
                       </ul>
                     </div>
                   )}
                </div>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2 ml-10">
                    <Loader2 size={16} className="animate-spin text-indigo-500" />
                    <span className="text-xs text-slate-400">Researching...</span>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-slate-200">
        <div className="relative flex items-center">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about this case..."
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
            />
            <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
                <Send size={16} />
            </button>
        </div>
        <div className="mt-2 flex justify-center space-x-3">
             <button className="text-[10px] text-slate-400 hover:text-indigo-600 border border-slate-100 rounded-full px-2 py-1 bg-slate-50 transition-colors">Compare peers</button>
             <button className="text-[10px] text-slate-400 hover:text-indigo-600 border border-slate-100 rounded-full px-2 py-1 bg-slate-50 transition-colors">Check adverse media</button>
        </div>
      </div>
    </div>
  );
};

export default GeminiCopilot;