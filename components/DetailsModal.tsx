import React, { useState } from 'react';
import { Job, Talent, Company } from '../types';
import { X, MapPin, Clock, DollarSign, Sparkles, Users, Globe, ExternalLink, Mail, ArrowRight } from 'lucide-react';
import { generateCoverLetter } from '../services/geminiService';
import { Markdown } from './Markdown';

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Job | Talent | Company | null;
}

export const DetailsModal: React.FC<DetailsModalProps> = ({ isOpen, onClose, item }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'ai'>('details');

  if (!isOpen || !item) return null;

  const isJob = 'title' in item;
  const isTalent = 'hourlyRate' in item;
  const isCompany = 'industry' in item && !('title' in item);

  const handleGenerateCoverLetter = async () => {
    if (!isJob) return;
    setIsGenerating(true);
    const letter = await generateCoverLetter(item as Job);
    setCoverLetter(letter);
    setIsGenerating(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {isJob ? 'Job Opportunity' : isTalent ? 'Talent Profile' : 'Company Profile'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
            
            {/* --- JOB VIEW --- */}
            {isJob && (
                <>
                    <div className="flex items-start gap-5 mb-8">
                        <img src={(item as Job).companyLogo} alt={(item as Job).company} className="w-16 h-16 rounded-xl bg-slate-50 object-cover border border-slate-100" />
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 leading-tight">{(item as Job).title}</h2>
                            <p className="text-lg text-slate-600 font-medium">{(item as Job).company}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-8">
                        <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold"><DollarSign size={15}/> {(item as Job).salary}</span>
                        <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold"><MapPin size={15}/> {(item as Job).location}</span>
                        <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm font-semibold"><Clock size={15}/> {(item as Job).postedAt}</span>
                    </div>

                    {/* Tabs for Job View */}
                    <div className="flex border-b border-slate-200 mb-6">
                        <button 
                            onClick={() => setActiveTab('details')}
                            className={`pb-3 px-4 text-sm font-semibold transition-colors relative ${activeTab === 'details' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Job Details
                            {activeTab === 'details' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900 rounded-t-full"></div>}
                        </button>
                        <button 
                            onClick={() => setActiveTab('ai')}
                            className={`pb-3 px-4 text-sm font-semibold transition-colors relative flex items-center gap-2 ${activeTab === 'ai' ? 'text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Sparkles size={14} /> AI Cover Letter
                            {activeTab === 'ai' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full"></div>}
                        </button>
                    </div>

                    {activeTab === 'details' ? (
                        <div className="space-y-6">
                            <Markdown content={(item as Job).description} />
                            
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Required Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(item as Job).tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-slate-100 rounded-lg text-slate-700 text-sm font-medium">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                                <h4 className="text-purple-900 font-bold mb-2 flex items-center gap-2">
                                    <Sparkles size={18} /> Smart Application Assistant
                                </h4>
                                <p className="text-purple-700 text-sm mb-4">
                                    Let Gemini AI analyze this job description and your profile to craft the perfect cover letter.
                                </p>
                                
                                {!coverLetter && !isGenerating && (
                                    <button 
                                        onClick={handleGenerateCoverLetter}
                                        className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                                    >
                                        Generate Draft
                                    </button>
                                )}
                                
                                {isGenerating && (
                                    <div className="flex flex-col items-center py-8 gap-3">
                                        <div className="w-6 h-6 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                                        <span className="text-sm font-medium text-purple-700">Writing your letter...</span>
                                    </div>
                                )}

                                {coverLetter && (
                                    <div className="animate-fade-in">
                                        <textarea 
                                            className="w-full h-64 p-4 rounded-xl border border-purple-200 text-sm text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white font-sans leading-relaxed"
                                            value={coverLetter}
                                            onChange={(e) => setCoverLetter(e.target.value)}
                                        ></textarea>
                                        <div className="flex justify-end mt-3">
                                            <button 
                                                onClick={() => navigator.clipboard.writeText(coverLetter)}
                                                className="text-xs font-semibold text-purple-700 hover:text-purple-900 uppercase tracking-wide"
                                            >
                                                Copy to clipboard
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* --- TALENT VIEW --- */}
            {isTalent && (
                <>
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative">
                            <img src={(item as Talent).avatar} alt={(item as Talent).name} className="w-28 h-28 rounded-full border-4 border-white shadow-lg mb-4 object-cover" />
                            <div className="absolute bottom-4 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-1">{(item as Talent).name}</h2>
                        <p className="text-xl text-primary-600 font-medium">{(item as Talent).role}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wide mb-1">Hourly Rate</p>
                            <p className="text-xl font-bold text-slate-900">{(item as Talent).hourlyRate}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wide mb-1">Availability</p>
                            <p className="text-xl font-bold text-slate-900">{(item as Talent).availability}</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">About</h3>
                            <Markdown content={(item as Talent).bio} />
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">Skills & Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {(item as Talent).skills.map(skill => (
                                    <span key={skill} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm font-medium shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* --- COMPANY VIEW --- */}
            {isCompany && (
                <>
                    <div className="flex items-center gap-5 mb-8">
                        <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 p-2 shadow-sm flex items-center justify-center">
                             <img src={(item as Company).logo} alt={(item as Company).name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-1">{(item as Company).name}</h2>
                            <p className="text-lg text-slate-500 font-medium">{(item as Company).industry}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                         <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="bg-white p-2 rounded-lg text-slate-700 shadow-sm"><Users size={20} /></div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Company Size</p>
                                <p className="font-semibold text-slate-900">{(item as Company).size} Employees</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="bg-white p-2 rounded-lg text-slate-700 shadow-sm"><Globe size={20} /></div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Website</p>
                                <a href={`https://${(item as Company).website}`} target="_blank" rel="noreferrer" className="font-semibold text-primary-600 hover:underline">
                                    {(item as Company).website}
                                </a>
                            </div>
                         </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">About the Company</h3>
                            <Markdown content={(item as Company).description} />
                        </div>
                        
                        <div className="p-5 bg-gradient-to-r from-primary-50 to-indigo-50 rounded-xl border border-primary-100 flex items-center justify-between">
                            <div>
                                <span className="block text-primary-900 font-bold text-lg">Hiring Now</span>
                                <span className="text-primary-700 text-sm">Active openings available</span>
                            </div>
                            <span className="bg-white text-primary-700 font-bold px-4 py-2 rounded-lg shadow-sm">
                                {(item as Company).openRoles} Open Roles
                            </span>
                        </div>
                    </div>
                </>
            )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 backdrop-blur flex gap-3 z-10">
            {isJob && (
                <>
                    <button onClick={onClose} className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                        Save for Later
                    </button>
                    <button className="flex-[2] py-3 px-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10">
                        Apply Now <ArrowRight size={18} />
                    </button>
                </>
            )}
            {isTalent && (
                <>
                    <button onClick={onClose} className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                    <button className="flex-[2] py-3 px-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10">
                        <Mail size={18} /> Contact Talent
                    </button>
                </>
            )}
            {isCompany && (
                <>
                    <button onClick={onClose} className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                        Close
                    </button>
                    <a 
                        href={`https://${(item as Company).website}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-[2] py-3 px-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
                    >
                        Visit Website <ExternalLink size={18} />
                    </a>
                </>
            )}
        </div>
      </div>
    </div>
  );
};