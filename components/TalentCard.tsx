import React from 'react';
import { Talent } from '../types';
import { Clock, Star, MapPin } from 'lucide-react';

interface TalentCardProps {
  talent: Talent;
  onClick?: (talent: Talent) => void;
}

export const TalentCard: React.FC<TalentCardProps> = ({ talent, onClick }) => {
  return (
    <div 
        onClick={() => onClick?.(talent)}
        className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 animate-slide-up flex flex-col h-full group
        ${onClick ? 'cursor-pointer hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-100' : ''}`}
    >
      {/* Header Background */}
      <div className="h-24 bg-gradient-to-r from-slate-50 to-indigo-50/50 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full -mr-10 -mt-10 blur-2xl"></div>
      </div>

      <div className="px-6 flex flex-col items-center -mt-12 pb-6 border-b border-slate-50">
        <div className="relative">
          <img 
            src={talent.avatar} 
            alt={talent.name} 
            className="w-24 h-24 rounded-full object-cover border-[4px] border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" title={talent.availability}></div>
        </div>
        
        <div className="mt-3 text-center">
            <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{talent.name}</h3>
            <p className="text-sm text-indigo-600/80 font-medium mt-0.5">{talent.role}</p>
        </div>
        
        <div className="mt-4 flex items-center justify-center gap-3 w-full">
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center min-w-[80px]">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rate</span>
                <span className="text-sm font-bold text-slate-700">{talent.hourlyRate}</span>
            </div>
             <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center min-w-[80px]">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Exp</span>
                <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    4.9 <Star size={10} fill="currentColor" className="text-amber-400" />
                </span>
            </div>
        </div>
      </div>
      
      <div className="p-6 flex-1 bg-white/40">
        <div className="flex flex-wrap gap-2 justify-center content-start">
            {talent.skills.slice(0, 4).map(skill => (
                <span key={skill} className="text-xs px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-600 font-medium shadow-sm">
                    {skill}
                </span>
            ))}
             {talent.skills.length > 4 && (
                <span className="text-xs px-2 py-1 text-slate-400">+ {talent.skills.length - 4}</span>
            )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
             <span className="flex items-center gap-1">
                <Clock size={12} /> {talent.availability}
             </span>
             <span className="text-indigo-600 group-hover:translate-x-1 transition-transform">View Profile →</span>
        </div>
      </div>
    </div>
  );
};