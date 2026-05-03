import type { ReactNode } from "react";
import type { Role } from "../types/user";
import { useAuth } from "../auth/AuthContext";
import { Spinner } from "../components/common/Spinner";

import { Navigate } from "react-router-dom";
interface Props {
  children: ReactNode;
  allowedRoles?: Role[];
}

export function AuthorizedRoute({ children, allowedRoles }: Props) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
