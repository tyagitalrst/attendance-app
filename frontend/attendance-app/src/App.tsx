import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { HistoryPage } from "./pages/HistoryPage";
import { AuthorizedRoute } from "./routes/AuthorizedRoute";
import { AppLayout } from "./components/common/AppLayout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <AuthorizedRoute>
                <AppLayout>
                  <HomePage />
                </AppLayout>
              </AuthorizedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <AuthorizedRoute>
                <AppLayout>
                  <HistoryPage />
                </AppLayout>
              </AuthorizedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <AuthorizedRoute>
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
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
