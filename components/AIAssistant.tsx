
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2, Sparkles, User } from 'lucide-react';
import { getShoppingRecommendation } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'สวัสดีครับ! ผม "น้อง BEC" ผู้ช่วย AI ยินดีต้อนรับสู่ BEC Market Shop ครับ มีอะไรให้ผมช่วยแนะนำสินค้าหรือคำนวณราคาไหมครับ?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userMsg }];
    
    setInput('');
    setMessages(newMessages);
    setIsLoading(true);

    const response = await getShoppingRecommendation(newMessages);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  // Helper function to render text with basic bolding support
  const formatText = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-black text-[#3674B5]">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-[90vw] sm:w-96 h-[550px] rounded-3xl shadow-2xl border border-[#3674B5]/20 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
          {/* Header */}
          <div className="bg-[#3674B5] p-5 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="bg-[#FADA7A] p-2 rounded-xl shadow-lg animate-bounce">
                <Sparkles className="w-5 h-5 text-[#3674B5]" />
              </div>
              <div>
                <h3 className="font-black text-sm">น้อง BEC (AI Assistant)</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Online Now</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Chat Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9FBFF]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-[#FADA7A] text-[#3674B5]' : 'bg-[#3674B5] text-white'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-[#3674B5] text-white rounded-br-none' 
                    : 'bg-white border border-[#3674B5]/10 text-gray-800 rounded-bl-none'
                }`}>
                  {formatText(msg.text)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-[#3674B5] text-white flex items-center justify-center shrink-0">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white border border-[#3674B5]/10 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#3674B5]/40 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[#3674B5]/40 rounded-full animate-bounce delay-150"></span>
                    <span className="w-1.5 h-1.5 bg-[#3674B5]/40 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2 bg-gray-50 p-1 rounded-2xl border border-gray-100 focus-within:border-[#3674B5]/50 transition-colors"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ถามน้อง BEC ได้เลย..."
                className="flex-1 bg-transparent border-none px-4 py-2 text-sm focus:outline-none"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-[#3674B5] hover:bg-[#2a5a8a] text-white p-2.5 rounded-xl transition-all shadow-md disabled:bg-gray-300 disabled:shadow-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[9px] text-center text-gray-400 mt-2 font-bold uppercase tracking-widest">
              Powered by Gemini 3 Flash
            </p>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#3674B5] hover:scale-110 active:scale-95 text-white p-4 rounded-2xl shadow-2xl shadow-[#3674B5]/30 transition-all flex items-center justify-center group"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 text-[#FADA7A]" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-[#3674B5] rounded-full"></span>
          </div>
          <span className="ml-3 hidden sm:inline font-black tracking-tight text-sm">คุยกับน้อง BEC</span>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
