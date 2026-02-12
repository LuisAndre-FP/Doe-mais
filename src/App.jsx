import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./features/auth/LoginPage";
import Doacoes from "./features/donations/DonationsPage";
import Historico from "./features/donations/DonationsHistoryPage"; 
import Perfil from "./features/profile/ProfilePage";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* login */}
        <Route path="/login" element={<Login />} />

        {/* protegidas (todas aqui dentro) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}> 
            <Route path="/" element={<Navigate to="/doacoes" replace />} />
            <Route path="/doacoes" element={<Doacoes />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/doacoes" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
