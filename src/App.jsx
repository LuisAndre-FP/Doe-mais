import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import ForgotPasswordPage from "./features/auth/ForgotPasswordPage";
import UpdatePasswordPage from "./features/auth/UpdatePasswordPage";
import AuthCallbackPage from "./features/auth/AuthCallbackPage";

import DonationsPage from "./features/donations/DonationsPage";
import DonationsMyPage from "./features/donations/DonationsMyPage";
import Historico from "./features/donations/DonationsHistoryPage";
import Perfil from "./features/profile/ProfilePage";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AppLayout from "./layouts/AppLayout";

import AdminDonationsPage from "./features/admin/AdminDonationsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/doacoes" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
        <Route path="/atualizar-senha" element={<UpdatePasswordPage />} />

        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/doacoes" element={<DonationsPage />} />
            <Route path="/minhas-doacoes" element={<DonationsMyPage />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/perfil" element={<Perfil />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDonationsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/doacoes" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
