
import React, { useEffect, useState, useMemo } from 'react';
import { Talent } from '../types';
import { fetchTalents } from '../services/geminiService';
import { TalentCard } from '../components/TalentCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import { DetailsModal } from '../components/DetailsModal';
import { Button, Input, Select, Dialog } from '../components/ui';

const ROLES_FILTER_OPTIONS = ['All Roles', 'Frontend', 'Backend', 'Full Stack', 'Designer', 'Manager'];

export const TalentsPage: React.FC = () => {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);

  // -- Filters State --
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [availabilityFilter, setAvailabilityFilter] = useState('Any');
  const [sortOrder, setSortOrder] = useState('rating'); // 'rating' | 'rate_low' | 'rate_high'

  // -- Advanced Filters --
  const [showFilters, setShowFilters] = useState(false);
  const [minRateFilter, setMinRateFilter] = useState('');

  // Load Data
  useEffect(() => {
    const load = async () => {
        setLoading(true);
        const data = await fetchTalents(searchQuery);
        setTalents(data);
        setLoading(false);
    }
    const timer = setTimeout(load, 600);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Derived filtered & sorted data
  const filteredTalents = useMemo(() => {
    let result = [...talents];

    // Filter by Role
    if (roleFilter !== 'All Roles') {
        result = result.filter(t => t.role.includes(roleFilter) || t.role === roleFilter);
    }

    // Filter by Availability
    if (availabilityFilter !== 'Any') {
        result = result.filter(t => t.availability === availabilityFilter);
    }

    // Filter by Min Rate
    if (minRateFilter) {
        const min = parseInt(minRateFilter);
        if (!isNaN(min)) {
            result = result.filter(t => t.hourlyRateValue >= min);
        }
    }

    // Sorting
    result.sort((a, b) => {
        if (sortOrder === 'rate_high') return b.hourlyRateValue - a.hourlyRateValue;
        if (sortOrder === 'rate_low') return a.hourlyRateValue - b.hourlyRateValue;
        // Default 'rating'
        return b.rating - a.rating;
    });

    return result;
  }, [talents, roleFilter, availabilityFilter, minRateFilter, sortOrder]);

  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('All Roles');
    setAvailabilityFilter('Any');
    setMinRateFilter('');
    setSortOrder('rating');
  };

  return (
    <div className="space-y-8 pb-20">
      
       {/* Hero Section - Light Theme */}
       <div className="bg-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full blur-[100px] opacity-60 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/50 rounded-full blur-[80px] opacity-60 pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Hire world-class <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">remote talent</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
                Connect with top-tier developers, designers, and creative professionals ready to work asynchronously.
            </p>

            <div className="max-w-xl mx-auto pt-4 flex gap-2">
                <Input 
                    placeholder="Search by role or skills (e.g., 'React', 'Product Designer')..." 
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
              
              {/* Role Filters */}
              <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl overflow-x-auto w-full lg:w-auto no-scrollbar">
                  {ROLES_FILTER_OPTIONS.map(role => (
                      <button
                        key={role}
                        onClick={() => setRoleFilter(role)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                            roleFilter === role 
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                        }`}
                      >
                          {role}
                      </button>
                  ))}
              </div>

              {/* Sort & Advanced */}
              <div className="flex items-center gap-2 w-full lg:w-auto justify-end px-1">
                  <div className="hidden sm:block text-sm font-medium text-slate-500 mr-2">
                      <span className="text-slate-900 font-bold">{filteredTalents.length}</span> talents
                  </div>
                  
                  <div className="w-[180px]">
                    <Select 
                        value={sortOrder}
                        onChange={setSortOrder}
                        options={[
                            { value: 'rating', label: 'Highest Rated' },
                            { value: 'rate_low', label: 'Rate: Low to High' },
                            { value: 'rate_high', label: 'Rate: High to Low' },
                        ]}
                    />
                  </div>
                  
                  <Button variant="outline" onClick={() => setShowFilters(true)}>
                      <SlidersHorizontal size={16} className="mr-2" /> Filters
                  </Button>
              </div>
          </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-1">
         {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse h-80"></div>
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTalents.map((talent) => (
                <TalentCard 
                  key={talent.id} 
                  talent={talent} 
                  onClick={(t) => setSelectedTalent(t)} 
                />
              ))}

              {filteredTalents.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white/50 rounded-3xl border border-dashed border-slate-300">
                    <p className="text-slate-500 font-medium text-lg">No talents found matching your criteria.</p>
                    <Button variant="ghost" onClick={clearFilters} className="mt-4 text-indigo-600">
                        Clear all filters
                    </Button>
                </div>
              )}
            </div>
          )}
      </div>

      {/* Filter Dialog */}
      <Dialog 
        isOpen={showFilters} 
        onClose={() => setShowFilters(false)} 
        title="Filter Talent"
        footer={
            <>
                <Button variant="ghost" onClick={() => { setAvailabilityFilter('Any'); setMinRateFilter(''); }}>Reset</Button>
                <Button onClick={() => setShowFilters(false)}>Show Results</Button>
            </>
        }
      >
        <div className="space-y-6">
            <Select 
                label="Availability"
                value={availabilityFilter}
                onChange={setAvailabilityFilter}
                options={[
                    { value: 'Any', label: 'Any Availability' },
                    { value: 'Available now', label: 'Available Now' },
                    { value: 'Available in 2 weeks', label: 'In 2 Weeks' },
                ]}
            />
            
            <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Min Hourly Rate ($)</label>
                <Input 
                    type="number"
                    placeholder="e.g. 50"
                    value={minRateFilter}
                    onChange={(e) => setMinRateFilter(e.target.value)}
                    icon={<span className="text-slate-400 font-bold">$</span>}
                />
            </div>
        </div>
      </Dialog>

      <DetailsModal 
        isOpen={!!selectedTalent} 
        onClose={() => setSelectedTalent(null)} 
        item={selectedTalent} 
      />
    </div>
  );
};
