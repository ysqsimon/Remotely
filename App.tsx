import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Briefcase, Users, Building2, LogIn, Menu, X, Sparkles, Search, Satellite } from 'lucide-react';
import { JobsPage } from './pages/JobsPage';
import { TalentsPage } from './pages/TalentsPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { LoginPage } from './pages/LoginPage';
import { AISearchPage } from './pages/AISearchPage';
import { User } from './types';

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string; activeClassName?: string }> = ({ to, icon, label, activeClassName }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium";
  const defaultActive = "bg-primary-50 text-primary-700";
  const defaultInactive = "text-slate-600 hover:bg-slate-50 hover:text-slate-900";

  return (
    <Link 
      to={to} 
      className={`${baseClasses} ${isActive ? (activeClassName || defaultActive) : defaultInactive}`}
    >
      {React.cloneElement(icon as React.ReactElement<any>, { size: 18, className: isActive ? 'text-current' : 'text-slate-500' })}
      {label}
    </Link>
  );
};

const Layout: React.FC<{ children: React.ReactNode; user: User; onLogout: () => void }> = ({ children, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
                <Satellite size={18} />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">Remotely</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink 
                to="/ai-search" 
                icon={<Sparkles />} 
                label="AI Search" 
                activeClassName="bg-purple-50 text-purple-700"
              />
              <div className="w-px h-5 bg-slate-200 mx-2"></div>
              <NavLink to="/" icon={<Briefcase />} label="Jobs" />
              <NavLink to="/talents" icon={<Users />} label="Talents" />
              <NavLink to="/companies" icon={<Building2 />} label="Companies" />
            </div>

            {/* Auth Button / User Profile */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">Job Seeker</p>
                  </div>
                  <button onClick={onLogout} className="relative group">
                     <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full border-2 border-slate-100" />
                     <div className="absolute inset-0 bg-black/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                >
                  <LogIn size={18} />
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white animate-fade-in absolute w-full shadow-xl">
            <div className="px-4 py-4 space-y-2">
              <NavLink to="/ai-search" icon={<Sparkles />} label="AI Search" activeClassName="bg-purple-50 text-purple-700" />
              <div className="h-px bg-slate-100 my-2"></div>
              <NavLink to="/" icon={<Briefcase />} label="Jobs" />
              <NavLink to="/talents" icon={<Users />} label="Talents" />
              <NavLink to="/companies" icon={<Building2 />} label="Companies" />
              <div className="h-px bg-slate-100 my-2"></div>
              {user ? (
                <button onClick={onLogout} className="flex items-center gap-2 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg font-medium">
                  Log Out
                </button>
              ) : (
                <Link to="/login" className="flex items-center gap-2 px-4 py-3 bg-primary-50 text-primary-700 rounded-lg font-medium">
                  <LogIn size={18} /> Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center text-white">
                        <Satellite size={12} />
                    </div>
                    <span className="font-bold text-slate-900">Remotely</span>
                </div>
                <p className="text-slate-500 text-sm">© 2024 Remotely Inc. All rights reserved.</p>
                <div className="flex gap-6 text-slate-400">
                    <a href="#" className="hover:text-slate-900">Terms</a>
                    <a href="#" className="hover:text-slate-900">Privacy</a>
                    <a href="#" className="hover:text-slate-900">Cookies</a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User>(null);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<JobsPage />} />
          <Route path="/talents" element={<TalentsPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/ai-search" element={<AISearchPage />} />
          <Route path="/login" element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}