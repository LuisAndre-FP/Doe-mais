import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../hooks/useSession";

export default function ProtectedRoute() {
  const { session, loading } = useSession();

  if (loading) return <div className="p-6">Carregando...</div>;
  if (!session) return <Navigate to="/login" replace />;

  return <Outlet />;
}
