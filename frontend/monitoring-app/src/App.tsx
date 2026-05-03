import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { AuthorizedRoute } from "./routes/AuthorizedRoute";
import { LoginPage } from "./pages/LoginPage";
import { UsersPage } from "./pages/UsersPage";
import { AttendancePage } from "./pages/AttendancePage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <AuthorizedRoute allowedRoles={["ADMIN"]}>
                <UsersPage />
              </AuthorizedRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <AuthorizedRoute allowedRoles={["ADMIN"]}>
                <AttendancePage />
              </AuthorizedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
