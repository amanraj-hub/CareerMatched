import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: { email: string; password: string; full_name: string; role: UserRole; company_name?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('talentloop_token'));
  const [loading, setLoading] = useState<boolean>(true);

  // Restore an existing session once when the provider mounts. Login and
  // registration validate their newly issued token before committing it below.
  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        if (token) {
          const currentUser = await api.getCurrentUser(token);
          if (!cancelled) setUser(currentUser);
        }
      } catch (err) {
        console.error('Session expired or invalid', err);
        if (!cancelled) {
          localStorage.removeItem('talentloop_token');
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadUser();
    return () => { cancelled = true; };
    // This is intentionally a mount-only session restoration. Token changes
    // during login/register are handled by those functions, avoiding duplicate
    // /auth/me requests and races between the effect and the submit handler.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.login({ email: email.trim(), password: pass });
    const currentUser = await api.getCurrentUser(res.access_token);
    localStorage.setItem('talentloop_token', res.access_token);
    setToken(res.access_token);
    setUser(currentUser);
  };

  const register = async (data: { email: string; password: string; full_name: string; role: UserRole; company_name?: string }) => {
    const res = await api.register({ ...data, email: data.email.trim() });
    const currentUser = await api.getCurrentUser(res.access_token);
    localStorage.setItem('talentloop_token', res.access_token);
    setToken(res.access_token);
    setUser(currentUser);
  };

  const logout = () => {
    localStorage.removeItem('talentloop_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (token) {
      const u = await api.getCurrentUser();
      setUser(u);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
