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
  /** URL raíz del portal-gateway (ej. `https://portal.grupoproesa.mx`).
   * Si está, el `refresh()` redirige al portal en un 401. Sin este prop,
   * el AuthProvider funciona en modo standalone (sin redirect). */
  portalUrl?: string;
  /** `internal_code` de la app en el portal-gateway (ej. `"control-coberturas"`).
   * Si está, el redirect 401 va al path canónico del gateway:
   *   `${portalUrl}/apps/${appCode}/launch?return_to=...`
   * (ver `proesa-gateway/docs/integration-guide.md` §"Flujo B").
   * **Sin este prop**, redirect va a `${portalUrl}/launch?return_to=...` —
   * que NO matchea con el path real del gateway y deja el portal en blanco.
   * Mantenido como opcional para backward-compat. */
  appCode?: string;
  /** URL absoluta a la que redirigir tras logout.
   * Default: `${portalUrl}/auth/logout` si `portalUrl` está; si no, `/login`.
   * Sobreescribir solo si la app necesita una URL específica distinta. */
  logoutUrl?: string;
}

export function AuthProvider({
  children,
  apiBase = "",
  portalUrl,
  appCode,
  logoutUrl,
}: AuthProviderProps) {
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
        const launchPath = appCode ? `/apps/${appCode}/launch` : "/launch";
        window.location.href = `${portalUrl}${launchPath}?return_to=${returnTo}`;
      }
    } finally {
      setLoading(false);
    }
  }, [api, portalUrl, appCode]);

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
      // 1. `logoutUrl` explícito > 2. `${portalUrl}/auth/logout` (cierra sesión del portal
      // también — comportamiento esperado) > 3. `/login` (standalone, sin portal).
      const target = logoutUrl
        ?? (portalUrl ? `${portalUrl}/auth/logout` : "/login");
      window.location.href = target;
    }
  }, [api, portalUrl, logoutUrl]);

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
