import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowLeft, Key, AlertCircle, RefreshCw } from 'lucide-react';
import { setAdminLoggedIn, verifyAdminCredentials } from '../data/dataStore';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToSite,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFillInitialCredentials = () => {
    setUsername('umar');
    setPassword('Sho2026@');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Please enter both admin username and password.');
      return;
    }

    setIsAuthenticating(true);

    try {
      const isValid = await verifyAdminCredentials(username, password);
      setIsAuthenticating(false);

      if (isValid) {
        setAdminLoggedIn(true);
        onLoginSuccess();
      } else {
        setError('Invalid administrator credentials. Please check your username and password.');
      }
    } catch (err) {
      setIsAuthenticating(false);
      setError('An error occurred during authentication. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-8 text-center space-y-3 relative">
          <button
            onClick={onBackToSite}
            className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer flex items-center text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Website
          </button>

          <div className="w-14 h-14 bg-blue-600/20 border border-blue-400/30 rounded-2xl flex items-center justify-center mx-auto text-blue-400 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-md border border-blue-400/20">
              Authorized Personnel Only
            </span>
            <h1 className="text-2xl font-black text-white mt-2 tracking-tight">
              JobsHub Admin Portal
            </h1>
            <p className="text-xs text-blue-200/80 mt-1">
              Government & Corporate Recruitment Management System
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-semibold flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Admin Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. umar"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isAuthenticating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span>Login to Admin Dashboard</span>
              </>
            )}
          </button>

          <div className="pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleFillInitialCredentials}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center space-x-1.5"
            >
              <Key className="w-3.5 h-3.5 text-blue-600" />
              <span>Auto-Fill Initial Credentials (umar / Sho2026@)</span>
            </button>
          </div>

        </form>

        <div className="bg-slate-50 px-8 py-3 border-t border-slate-100 text-center text-[11px] text-slate-400 font-medium">
          Protected by JobsHub Security Protocol v2.4 • Pakistan National Jobs Portal
        </div>

      </div>
    </div>
  );
};
