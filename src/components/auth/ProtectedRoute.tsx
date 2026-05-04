import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { Spinner } from "../ui/Spinner";

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: string;
  requireAnyRole?: string[];
  fallback?: string;
}

export function ProtectedRoute({ children, requireRole, requireAnyRole, fallback = "/" }: ProtectedRouteProps) {
  const { isAuthenticated, loading, hasRole, hasAnyRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--proesa-mist)" }}>
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && !hasRole(requireRole)) {
    return <Navigate to={fallback} replace />;
  }

  if (requireAnyRole && !hasAnyRole(requireAnyRole)) {
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
