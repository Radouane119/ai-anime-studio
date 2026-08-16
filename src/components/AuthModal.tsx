import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { X, ShieldCheck, Sparkles, Key, Building2, User, Mail, Lock, LogIn, UserPlus, CheckCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, signIn, signUp, isLoading, user, session, signOut } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'session'>('signin');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('CREATOR');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signin') {
      if (!email) return;
      await signIn(email);
    } else if (mode === 'signup') {
      if (!email || !name) return;
      await signUp(email, name, role);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-indigo-500/30 bg-slate-950 p-6 text-slate-100 shadow-2xl">
        {/* Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Clerk & Enterprise JWT Authentication
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            {user ? 'Enterprise Security Session' : mode === 'signin' ? 'Sign In to Studio' : 'Create Studio Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {user ? 'Authenticated with Clerk SSO & PostgreSQL RBAC' : 'Access AI Generation Pipelines & Collaborative Workspaces'}
          </p>
        </div>

        {/* Mode Switcher if not signed in */}
        {!user && (
          <div className="flex rounded-xl bg-slate-900/80 p-1 border border-slate-800 mb-6">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                mode === 'signin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 inline mr-1.5" />
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                mode === 'signup' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 inline mr-1.5" />
              Sign Up
            </button>
          </div>
        )}

        {/* User Session Info if already signed in */}
        {user ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full border border-indigo-500/40" />
                <div>
                  <h3 className="font-semibold text-sm text-white">{user.name}</h3>
                  <p className="text-xs text-slate-400">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Role: {user.role}
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-1.5 pt-2 border-t border-slate-800 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Clerk User ID:</span>
                  <span className="font-mono text-slate-300">{user.clerkId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Organization:</span>
                  <span className="text-indigo-400 font-medium">{user.organizationName || 'Default Studio'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">JWT Token Valid:</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Active
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={signOut}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-all"
              >
                Sign Out Current Session
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name / Creator Handle</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Makoto Shinkai"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Studio Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@studio-ai.anime"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  defaultValue="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Studio Role Authorization</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['CREATOR', 'ADMIN', 'MEMBER'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-1.5 text-[11px] font-semibold rounded-lg border transition-all ${
                        role === r
                          ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {mode === 'signin' ? 'Sign In via Clerk SSO' : 'Register Enterprise Creator'}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
