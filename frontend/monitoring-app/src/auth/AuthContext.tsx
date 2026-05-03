import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthRequest } from "../types/auth";
import type { User } from "../types/user";
import * as authAPI from "../api/auth";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (params: AuthRequest) => Promise<void>;
  logout: () => void;
  getUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.clear();
      }
    }
    return null;
  });
  const [isLoading] = useState(false);

  async function login(params: AuthRequest) {
    const result = await authAPI.login(params);
    localStorage.setItem("accessToken", result.accessToken);
    localStorage.setItem("user", JSON.stringify(result.user));
    setUser(result.user);
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  }

  async function getUser() {
    const userProfile = await authAPI.getProfile();
    localStorage.setItem("user", JSON.stringify(userProfile));
    setUser(userProfile);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
