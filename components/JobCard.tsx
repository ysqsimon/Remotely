import React from 'react';
import { Job } from '../types';
import { MapPin, Clock, DollarSign, Sparkles } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onClick?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  const isFeatured = Math.random() > 0.8; // Simulated "Featured" status for visual variety

  return (
    <div 
      onClick={() => onClick?.(job)}
      className={`relative group bg-white/60 backdrop-blur-sm rounded-2xl border transition-all duration-300 animate-slide-up overflow-hidden
        ${onClick ? 'cursor-pointer hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1 hover:border-primary-200' : ''}
        ${isFeatured ? 'border-primary-100 bg-gradient-to-br from-white to-primary-50/30' : 'border-white/50 hover:bg-white/90'}
      `}
    >
      {/* Decorative gradient blob on hover */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"></div>

      <div className="p-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-slate-100 p-1 flex-shrink-0">
            <img 
              src={job.companyLogo} 
              alt={job.company} 
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors truncate pr-2">
                  {job.title}
                </h3>
                <p className="text-sm font-medium text-slate-500">{job.company}</p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                {isFeatured && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 border border-amber-200/50">
                    <Sparkles size={10} fill="currentColor" /> Featured
                  </span>
                )}
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                  job.type === 'Full-time' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                    : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                }`}>
                  {job.type}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-4 text-sm text-slate-500">
              <div className="flex items-center gap-1.5 bg-slate-50/80 px-2 py-1 rounded-md border border-slate-100">
                <DollarSign size={14} className="text-slate-400" />
                <span className="font-medium text-slate-700">{job.salary}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-slate-400" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" />
                <span>{job.postedAt}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {job.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 text-xs rounded-lg font-medium group-hover:border-primary-100 group-hover:text-primary-700 transition-colors"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 3 && (
            <span className="px-2 py-1 text-slate-400 text-xs">+ {job.tags.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
};