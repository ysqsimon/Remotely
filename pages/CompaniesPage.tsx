
import React, { useEffect, useState } from 'react';
import { Company } from '../types';
import { fetchCompanies } from '../services/geminiService';
import { CompanyCard } from '../components/CompanyCard';
import { DetailsModal } from '../components/DetailsModal';

export const CompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    fetchCompanies().then(data => {
        setCompanies(data);
        setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8 pb-20">
       {/* Hero Section - Light Theme */}
       <div className="bg-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/50 to-cyan-100/50 rounded-full blur-[100px] opacity-60 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-[80px] opacity-60 pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Remote-First <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Companies</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
                  Discover companies that don't just "allow" remote work, but are built around it.
                  Culture, benefits, and async workflows designed for freedom.
            </p>
        </div>
      </div>

       {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[1, 2, 3].map(i => (
                   <div key={i} className="bg-white rounded-xl h-64 animate-pulse shadow-sm border border-slate-200 p-6">
                       <div className="flex justify-between mb-6">
                           <div className="w-14 h-14 bg-slate-200 rounded-xl"></div>
                           <div className="w-16 h-6 bg-slate-200 rounded-full"></div>
                       </div>
                       <div className="w-32 h-5 bg-slate-200 rounded mb-3"></div>
                       <div className="w-full h-16 bg-slate-100 rounded"></div>
                   </div>
               ))}
           </div>
       ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {companies.map(company => (
                   <CompanyCard 
                     key={company.id} 
                     company={company} 
                     onClick={(c) => setSelectedCompany(c)}
                   />
               ))}
           </div>
       )}

      <DetailsModal 
        isOpen={!!selectedCompany} 
        onClose={() => setSelectedCompany(null)} 
        item={selectedCompany} 
      />
    </div>
  );
};
