import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Sparkles, X, UserCheck, Building2, ArrowRight, KeyRound, Mail, User, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('individual');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          full_name: fullName,
          role,
          company_name: role === 'company' ? companyName : undefined,
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Instant one-click demo login helpers
  const handleQuickDemo = async (demoEmail: string, demoPass: string) => {
    setError(null);
    setLoading(true);
    try {
      await login(demoEmail, demoPass);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 mb-3 shadow-lg shadow-purple-500/25">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {tab === 'login' ? 'Welcome Back' : 'Create TalentLoop Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {tab === 'login'
              ? 'Access your resume matching and career intelligence'
              : 'Join the next-generation AI recruitment ecosystem'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl mb-6 border border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'login'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'register'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <>
              {/* Role Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  I am registering as:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('individual')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      role === 'individual'
                        ? 'border-purple-500 bg-purple-500/15 text-purple-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    Candidate / Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('company')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      role === 'company'
                        ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    Company / Recruiter
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full pl-9 pr-3 text-sm"
                  />
                </div>
              </div>

              {role === 'company' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. TechLoop Systems"
                      className="w-full pl-9 pr-3 text-sm"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-9 pr-3 text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glow-btn w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{tab === 'login' ? 'Sign In to Account' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Accounts Quick-Fill Section */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
            Instant Demo Access (No typing needed)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('alex@talentloop.ai', 'TalentLoop2026!')}
              disabled={loading}
              className="px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-800/40 hover:border-purple-500 text-purple-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Demo Candidate
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('recruiter@techloop.io', 'TalentLoop2026!')}
              disabled={loading}
              className="px-3 py-2 rounded-xl bg-cyan-950/40 border border-cyan-800/40 hover:border-cyan-500 text-cyan-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
            >
              <Building2 className="w-3.5 h-3.5" />
              Demo Recruiter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
