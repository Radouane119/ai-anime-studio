import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Lock, ShieldAlert, Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, openAuthModal, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs">Verifying Enterprise JWT & Clerk Session...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Protected Studio Canvas</h3>
        <p className="text-xs text-slate-400 max-w-md mb-5">
          Sign in or create an Enterprise Creator account to generate anime Keyframes, Light Novel Chapters, and Neural Dubs.
        </p>
        <button
          onClick={openAuthModal}
          className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Authenticate with Clerk
        </button>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center rounded-2xl bg-slate-900/40 border border-rose-900/30">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Role Authorization Required</h3>
        <p className="text-xs text-slate-400 max-w-md mb-2">
          Your current role (<span className="text-indigo-400 font-semibold">{user.role}</span>) does not have access to this pipeline.
        </p>
        <p className="text-[11px] text-slate-500 mb-4">
          Allowed Roles: {allowedRoles.join(', ')}
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
