import React, { useState } from 'react';
import { X, Shield, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginDemoUser, setUser, showNotification } = useSecurity();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: `usr-${Date.now()}`,
      email: email || 'analyst@shieldx.ai',
      name: name || (email ? email.split('@')[0] : 'Security Officer')
    });
    setIsAuthModalOpen(false);
    showNotification('success', `Welcome back, ${name || email || 'User'}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel rounded-2xl border border-slate-800 w-full max-w-md p-6 shadow-2xl relative">
        
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-3 shadow-lg shadow-cyan-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">
            {isSignup ? 'Create ShieldX Account' : 'Sign in to ShieldX'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Privacy-First Digital Safety Agent Dashboard
          </p>
        </div>

        {/* Evaluator Demo Mode Shortcut */}
        <button
          onClick={loginDemoUser}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 mb-5 rounded-xl bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-700/50 text-cyan-300 text-xs font-semibold hover:border-cyan-500 shadow-md transition-all group"
        >
          <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span>Instant Evaluator Demo Access</span>
          <ArrowRight className="w-3.5 h-3.5 ml-auto text-cyan-400" />
        </button>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="shrink mx-3 text-[10px] font-mono uppercase text-slate-500">Or credentials</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignup && (
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Security Analyst"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Work Email</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@shieldx.ai"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-lg transition-colors mt-2"
          >
            {isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
          >
            {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

      </div>
    </div>
  );
};
