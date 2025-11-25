import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Search, ArrowRight, Satellite } from 'lucide-react';
import { ChatMessage, Job, Talent, Company } from '../types';
import { chatWithAI } from '../services/geminiService';
import { JobCard } from '../components/JobCard';
import { TalentCard } from '../components/TalentCard';
import { CompanyCard } from '../components/CompanyCard';
import { Typewriter } from '../components/Typewriter';
import { DetailsModal } from '../components/DetailsModal';
import { Markdown } from '../components/Markdown';
import { Input, Button } from '../components/ui';

export const AISearchPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Job | Talent | Company | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (hasStarted) {
      scrollToBottom();
    }
  }, [messages, hasStarted, isLoading]);

  const handleSend = async (e: React.FormEvent, overrideText?: string) => {
    e?.preventDefault();
    const textToSend = overrideText || input;
    
    if (!textToSend.trim() || isLoading) return;

    if (!hasStarted) {
        setHasStarted(true);
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAI([...messages, userMsg], userMsg.text);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDataCards = (data: ChatMessage['data']) => {
    if (!data || data.items.length === 0) return null;

    // Wrappers to handle type narrowing
    const handleJobClick = (j: Job) => setSelectedItem(j);
    const handleTalentClick = (t: Talent) => setSelectedItem(t);
    const handleCompanyClick = (c: Company) => setSelectedItem(c);

    // Common grid classes
    const gridClasses = "grid grid-cols-1 xl:grid-cols-2 gap-4 mt-5 w-full";

    if (data.type === 'jobs') {
      return (
        <div className={gridClasses}>
          {(data.items as Job[]).map(job => (
            <div key={job.id} className="w-full">
                <JobCard job={job} onClick={handleJobClick} />
            </div>
          ))}
        </div>
      );
    }
    if (data.type === 'talents') {
        return (
          <div className={gridClasses}>
            {(data.items as Talent[]).map(talent => (
              <div key={talent.id} className="w-full h-full">
                  <TalentCard talent={talent} onClick={handleTalentClick} />
              </div>
            ))}
          </div>
        );
      }
      if (data.type === 'companies') {
        return (
          <div className={gridClasses}>
            {(data.items as Company[]).map(company => (
              <div key={company.id} className="w-full h-full">
                  <CompanyCard company={company} onClick={handleCompanyClick} />
              </div>
            ))}
          </div>
        );
      }
    return null;
  };

  // --- Initial Landing State ---
  if (!hasStarted) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] px-4 animate-fade-in">
              <div className="max-w-2xl w-full space-y-8 text-center">
                  <div className="space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl shadow-purple-200">
                          <Satellite size={32} />
                      </div>
                      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                          How can I help you today?
                      </h1>
                      <p className="text-lg text-slate-500 max-w-lg mx-auto">
                          I can help you find jobs, discover talent, or research companies using natural language.
                      </p>
                  </div>

                  <form onSubmit={(e) => handleSend(e)} className="relative max-w-xl mx-auto w-full group">
                      <Input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Ask me anything..."
                          className="py-4 text-lg shadow-sm"
                          icon={<Search size={20} />}
                          autoFocus
                      />
                      <div className="absolute right-2 top-2">
                        <Button 
                            type="submit" 
                            disabled={!input.trim()}
                            className="!p-2.5 rounded-lg"
                        >
                            <ArrowRight size={20} />
                        </Button>
                      </div>
                  </form>

                  <div className="pt-4">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Try asking</p>
                      <div className="flex flex-wrap justify-center gap-2">
                          {["Find me Senior React Developer jobs", "Show me designers with Figma skills", "List FinTech companies"].map((s, i) => (
                              <button 
                                key={i}
                                onClick={() => handleSend(null as any, s)}
                                className="px-4 py-2 bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-600 rounded-xl text-sm transition-all"
                              >
                                  {s}
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // --- Active Chat State ---
  return (
    <>
      <div className="flex flex-col h-[calc(100vh-8rem)] relative">
        <div className="flex-1 overflow-y-auto px-2 space-y-8 pb-32">
          {messages.map((msg, idx) => {
            const isLastMessage = idx === messages.length - 1;
            const isAI = msg.role === 'ai';
            const hasData = !!msg.data;
            
            return (
                <div 
                  key={msg.id} 
                  className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up w-full`}
                >
                  {isAI && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-md mt-1">
                      <Bot size={16} />
                    </div>
                  )}
                  
                  <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} ${hasData ? 'w-full max-w-full' : 'max-w-[90%] md:max-w-[80%]'}`}>
                      <div 
                          className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          msg.role === 'user' 
                              ? 'bg-white border border-slate-200 text-slate-800 rounded-tr-sm' 
                              : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm w-full'
                          }`}
                      >
                          {/* Animate text if it is the latest AI message */}
                          {isAI && isLastMessage && !msg.data ? (
                              <Typewriter text={msg.text} />
                          ) : (
                              <Markdown content={msg.text} />
                          )}
                      </div>
                      
                      {msg.data && (
                        <div className="w-full animate-fade-in">
                            {renderDataCards(msg.data)}
                        </div>
                      )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0 mt-1 border border-slate-300">
                      <UserIcon size={16} />
                    </div>
                  )}
                </div>
            );
          })}
          
          {isLoading && (
             <div className="flex gap-4 justify-start animate-pulse">
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                   <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
                   <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area - Floating at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
          <form onSubmit={(e) => handleSend(e)} className="relative max-w-4xl mx-auto shadow-xl shadow-slate-200/50 rounded-2xl">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your follow-up..."
              className="py-3.5 pr-14 border-slate-200/80 bg-white/90 backdrop-blur-sm focus:bg-white"
              disabled={isLoading}
              autoFocus
            />
            <div className="absolute right-2 top-2">
                <Button 
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    variant="default"
                    className="!p-2 rounded-lg w-9 h-9 flex items-center justify-center"
                >
                    <Send size={16} />
                </Button>
            </div>
          </form>
        </div>
      </div>

      <DetailsModal 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        item={selectedItem} 
      />
    </>
  );
};