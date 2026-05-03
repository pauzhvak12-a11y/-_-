import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import {
  clearSession,
  findUserByEmail,
  getSession,
  getUsers,
  saveUser,
  setSession,
} from '../lib/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const s = getSession();
    if (!s?.userId) return;
    const u = getUsers().find((x) => x.id === s.userId);
    if (u) setUser({ id: u.id, name: u.name, email: u.email });
  }, []);

  const value = useMemo(
    () => ({
      user,
      register: (name, email, password) => {
        const id = crypto.randomUUID?.() ?? `u-${Date.now()}`;
        const res = saveUser({ id, name, email, password });
        if (!res.ok) return res;
        setSession(id);
        setUser({ id, name, email });
        return { ok: true };
      },
      login: (email, password) => {
        const u = findUserByEmail(email);
        if (!u || u.password !== password) return { ok: false, error: 'Неверный email или пароль' };
        setSession(u.id);
        setUser({ id: u.id, name: u.name, email: u.email });
        return { ok: true };
      },
      logout: () => {
        clearSession();
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth вне AuthProvider');
  return ctx;
}
