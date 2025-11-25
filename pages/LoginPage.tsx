import React, { useState } from 'react';
import { User } from '../types';
import { Github, Mail, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleMockLogin = (type: 'github' | 'email') => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        onLogin({
            name: type === 'github' ? 'Alex Developer' : 'Jordan Designer',
            email: 'user@example.com',
            avatar: `https://picsum.photos/200/200?random=${type === 'github' ? 100 : 200}`
        });
        setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-slide-up">
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500">Sign in to apply for jobs and manage your profile.</p>
          </div>

          <div className="space-y-4">
            <button 
                onClick={() => handleMockLogin('github')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <>
                        <Github size={20} />
                        Continue with GitHub
                    </>
                )}
            </button>
            
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">Or continue with email</span>
                </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleMockLogin('email'); }} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Email address</label>
                    <input 
                        type="email" 
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        required 
                    />
                </div>
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                    Sign in with Email
                    <ArrowRight size={16} />
                </button>
            </form>
          </div>
        </div>
        <div className="bg-slate-50 p-6 text-center text-sm text-slate-500">
            Don't have an account? <a href="#" className="text-primary-600 font-semibold hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  );
};