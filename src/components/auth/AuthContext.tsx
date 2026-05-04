import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { apiClient, ApiError } from "../../utils/api-client";

export interface User {
  id: string;
  nombre: string;
  primerNombre: string;
  email: string;
  roles: string[];
  metadata?: Record<string, unknown>;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  mustChangePassword: boolean;
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  hasRole(role: string): boolean;
  hasAnyRole(roles: string[]): boolean;
  refresh(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  apiBase?: string;
  portalUrl?: string;
}

export function AuthProvider({ children, apiBase = "", portalUrl }: AuthProviderProps) {
  const api = useMemo(() => apiClient(apiBase), [apiBase]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const me = await api.get<User & { mustChangePassword?: boolean }>("/api/auth/me");
      setMustChangePassword(Boolean(me.mustChangePassword));
      const { mustChangePassword: _ignored, ...rest } = me;
      setUser(rest);
    } catch (err) {
      setUser(null);
      setMustChangePassword(false);
      if (err instanceof ApiError && err.status === 401 && portalUrl && !import.meta.env?.VITE_DEV_LOCAL_LOGIN) {
        // En prod, sin sesión → redirige al Portal
        const returnTo = encodeURIComponent(window.location.href);
        window.location.href = `${portalUrl}/launch?return_to=${returnTo}`;
      }
    } finally {
      setLoading(false);
    }
  }, [api, portalUrl]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    await api.post("/api/auth/login", { email, password });
    await refresh();
  }, [api, refresh]);

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      setUser(null);
      if (portalUrl) {
        window.location.href = portalUrl;
      } else {
        window.location.href = "/login";
      }
    }
  }, [api, portalUrl]);

  const hasRole = useCallback((role: string) => Boolean(user?.roles.includes(role)), [user]);
  const hasAnyRole = useCallback(
    (roles: string[]) => Boolean(user && roles.some((r) => user.roles.includes(r))),
    [user],
  );

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user) && !mustChangePassword,
    mustChangePassword,
    login,
    logout,
    hasRole,
    hasAnyRole,
    refresh,
  }), [user, loading, mustChangePassword, login, logout, hasRole, hasAnyRole, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
