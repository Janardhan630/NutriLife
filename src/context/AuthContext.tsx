import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

/**
 * Client-side authentication.
 *
 * NOTE: This is a frontend-only demo — accounts live in this browser's
 * localStorage and passwords are SHA-256 hashed before storage. It is NOT
 * real security (anything client-side can be inspected); when a backend
 * exists, swap the register/login bodies for API calls and keep the
 * context shape unchanged.
 */

export interface AuthUser {
  name: string;
  email: string;
}

interface StoredUser extends AuthUser {
  passwordHash: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useLocalStorage<StoredUser[]>('users', []);
  const [session, setSession] = useLocalStorage<AuthUser | null>('session', null);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const normalized = email.trim().toLowerCase();
      if (users.some((u) => u.email === normalized)) {
        throw new Error('An account with this email already exists — sign in instead.');
      }
      const passwordHash = await sha256(password);
      const user: StoredUser = { name: name.trim(), email: normalized, passwordHash };
      setUsers((prev) => [...prev, user]);
      setSession({ name: user.name, email: user.email });
    },
    [users, setUsers, setSession],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const normalized = email.trim().toLowerCase();
      const user = users.find((u) => u.email === normalized);
      if (!user || user.passwordHash !== (await sha256(password))) {
        throw new Error('Invalid email or password.');
      }
      setSession({ name: user.name, email: user.email });
    },
    [users, setSession],
  );

  const logout = useCallback(() => setSession(null), [setSession]);

  const value = useMemo(
    () => ({ user: session, register, login, logout }),
    [session, register, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
