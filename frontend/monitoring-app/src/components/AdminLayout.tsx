import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useNotifications } from "../firebase/useNotifications";
import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Activate Firebase notifications
  useNotifications();

  const navItems = [
    { path: "/", label: "Users" },
    { path: "/attendance", label: "Attendances" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />

      <header className="bg-gray-900 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <h1 className="text-lg font-bold">Admin Portal</h1>
            <nav className="flex gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm transition ${
                    location.pathname === item.path
                      ? "text-white font-medium"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">{user?.name}</span>
            <button
              onClick={logout}
              className="rounded-md bg-red-600 px-3 py-1 text-sm hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6">{children}</main>
    </div>
  );
}
