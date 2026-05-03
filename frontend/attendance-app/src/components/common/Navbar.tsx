import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <span className="text-base font-bold text-orange-600">
            Attendance
          </span>
          <div className="flex gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/history"
              end
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              History
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              Profile
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={logout}
            className="rounded-md bg-gray-800 px-3 py-1.5 text-sm text-white hover:bg-gray-900"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
