import React from 'react';
import { Company } from '../types';
import { Users, ArrowUpRight } from 'lucide-react';

interface CompanyCardProps {
  company: Company;
  onClick?: (company: Company) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company, onClick }) => {
  return (
    <div 
        onClick={() => onClick?.(company)}
        className={`bg-white rounded-2xl border border-slate-200 p-6 transition-all duration-300 animate-slide-up flex flex-col h-full group
        ${onClick ? 'cursor-pointer hover:shadow-xl hover:shadow-slate-200 hover:-translate-y-1 hover:border-slate-300' : ''}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <img 
            src={company.logo} 
            alt={company.name} 
            className="w-full h-full object-contain"
            />
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${company.openRoles > 0 ? 'bg-black text-white' : 'bg-slate-100 text-slate-500'}`}>
            {company.openRoles} Jobs
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">{company.name}</h3>
        <p className="text-sm text-slate-500 font-medium">{company.industry}</p>
      </div>
      
      <p className="text-sm text-slate-600 mb-6 line-clamp-2 leading-relaxed flex-1">
        {company.description}
      </p>
      
      <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-100 text-slate-500">
        <div className="flex items-center gap-2 font-medium">
            <Users size={16} />
            <span>{company.size}</span>
        </div>
        <ArrowUpRight size={18} className="text-slate-300 group-hover:text-primary-600 transition-colors" />
      </div>
    </div>
  );
};