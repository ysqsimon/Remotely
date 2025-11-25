
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Search, Sparkles, SlidersHorizontal, ArrowDownWideNarrow } from 'lucide-react';
import { Job } from '../types';
import { fetchJobs } from '../services/geminiService';
import { JobCard } from '../components/JobCard';
import { DetailsModal } from '../components/DetailsModal';
import { Button, Input, Select, Dialog } from '../components/ui';

const FILTERS_TYPE = ['All Types', 'Full-time', 'Contract', 'Part-time'];

export const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  // -- Filters State --
  const [activeType, setActiveType] = useState('All Types');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'salary_high' | 'salary_low'
  
  // -- Advanced Filters State --
  const [showFilters, setShowFilters] = useState(false);
  const [expLevelFilter, setExpLevelFilter] = useState('Any');
  const [minSalaryFilter, setMinSalaryFilter] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadJobs = useCallback(async (query: string) => {
    setLoading(true);
    const data = await fetchJobs(query);
    setJobs(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadJobs(debouncedQuery);
  }, [debouncedQuery, loadJobs]);

  // Client-side Filtering & Sorting
  const filteredAndSortedJobs = useMemo(() => {
    let result = [...jobs];

    // 1. Type Filter
    if (activeType !== 'All Types') {
        result = result.filter(j => j.type === activeType);
    }

    // 2. Experience Level Filter
    if (expLevelFilter !== 'Any') {
        result = result.filter(j => j.experienceLevel === expLevelFilter);
    }

    // 3. Min Salary Filter
    if (minSalaryFilter) {
        const minVal = parseInt(minSalaryFilter);
        if (!isNaN(minVal)) {
            result = result.filter(j => j.salaryMax >= minVal);
        }
    }

    // 4. Sorting
    result.sort((a, b) => {
        if (sortOrder === 'salary_high') return b.salaryMax - a.salaryMax;
        if (sortOrder === 'salary_low') return a.salaryMin - b.salaryMin;
        // Default to 'newest' (mock logic: treating higher ID or position as newer roughly)
        return 0; 
    });

    return result;
  }, [jobs, activeType, sortOrder, expLevelFilter, minSalaryFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setActiveType('All Types');
    setExpLevelFilter('Any');
    setMinSalaryFilter('');
    setSortOrder('newest');
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Hero Section - Unified Design */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-100/50 to-purple-100/50 rounded-full blur-[100px] opacity-60 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-[80px] opacity-60 pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">remote adventure</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
                Curated remote-first opportunities from the world's most innovative companies. 
                AI-powered matching to save you time.
            </p>

            <div className="max-w-xl mx-auto pt-4 flex gap-2">
                <Input 
                    placeholder="Search by role, tech stack, or company..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search size={20} />}
                    className="py-3 shadow-sm"
                />
            </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="sticky top-20 z-30 max-w-7xl mx-auto">
          <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-glass rounded-2xl p-3 flex flex-col lg:flex-row items-center justify-between gap-4">
              
              {/* Type Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl overflow-x-auto w-full lg:w-auto no-scrollbar">
                  {FILTERS_TYPE.map(type => (
                      <button
                        key={type}
                        onClick={() => setActiveType(type)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                            activeType === type 
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                        }`}
                      >
                          {type}
                      </button>
                  ))}
              </div>

              {/* Filters & Sort */}
              <div className="flex items-center gap-2 w-full lg:w-auto justify-end px-1">
                  <div className="hidden sm:block text-sm font-medium text-slate-500 mr-2">
                      <span className="text-slate-900 font-bold">{filteredAndSortedJobs.length}</span> jobs
                  </div>
                  
                  <div className="w-[180px]">
                    <Select 
                        value={sortOrder}
                        onChange={setSortOrder}
                        options={[
                            { value: 'newest', label: 'Newest First' },
                            { value: 'salary_high', label: 'Salary: High to Low' },
                            { value: 'salary_low', label: 'Salary: Low to High' },
                        ]}
                    />
                  </div>
                  
                  <Button variant="outline" onClick={() => setShowFilters(true)}>
                      <SlidersHorizontal size={16} className="mr-2" /> Filters
                  </Button>
              </div>
          </div>
      </div>

      {/* Job Grid */}
      <div className="max-w-7xl mx-auto px-1">
        {loading ? (
             <div className="grid gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse h-32"></div>
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAndSortedJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onClick={(j) => setSelectedJob(j)} 
                />
              ))}
              
              {filteredAndSortedJobs.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white/50 rounded-3xl border border-dashed border-slate-300">
                    <p className="text-slate-500 font-medium text-lg">No jobs found matching your criteria.</p>
                    <Button variant="ghost" onClick={clearFilters} className="mt-4 text-primary-600">
                        Clear all filters
                    </Button>
                </div>
              )}
            </div>
          )}
      </div>
      
      {/* More Filters Dialog */}
      <Dialog 
        isOpen={showFilters} 
        onClose={() => setShowFilters(false)} 
        title="Filter Jobs"
        footer={
            <>
                <Button variant="ghost" onClick={() => { setExpLevelFilter('Any'); setMinSalaryFilter(''); }}>Reset</Button>
                <Button onClick={() => setShowFilters(false)}>Show Results</Button>
            </>
        }
      >
        <div className="space-y-6">
            <Select 
                label="Experience Level"
                value={expLevelFilter}
                onChange={setExpLevelFilter}
                options={[
                    { value: 'Any', label: 'Any Level' },
                    { value: 'Entry', label: 'Entry Level' },
                    { value: 'Mid', label: 'Mid Level' },
                    { value: 'Senior', label: 'Senior Level' },
                    { value: 'Lead', label: 'Lead / Manager' },
                ]}
            />
            
            <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Minimum Salary (USD)</label>
                <Input 
                    type="number"
                    placeholder="e.g. 100000"
                    value={minSalaryFilter}
                    onChange={(e) => setMinSalaryFilter(e.target.value)}
                    icon={<span className="text-slate-400 font-bold">$</span>}
                />
                <p className="text-xs text-slate-400 ml-1">Filter jobs paying at least this amount per year.</p>
            </div>
        </div>
      </Dialog>

      <DetailsModal 
        isOpen={!!selectedJob} 
        onClose={() => setSelectedJob(null)} 
        item={selectedJob} 
      />
    </div>
  );
};
