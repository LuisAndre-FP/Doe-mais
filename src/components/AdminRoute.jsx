import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../hooks/useSession";
import { getMyRole } from "../features/admin/adminService";

export default function AdminRoute() {
  const { session, loading } = useSession();
  const [roleLoading, setRoleLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    const run = async () => {
      if (!session) return;

      setRoleLoading(true);
      const { data, error } = await getMyRole();
      setRole(error ? "" : String(data ?? "").trim());
      setRoleLoading(false);
    };

    run();
  }, [session]);

  if (loading) return <div className="p-6">Carregando...</div>;
  if (!session) return <Navigate to="/login" replace />;

  if (roleLoading) return <div className="p-6">Carregando...</div>;
  if (role !== "ADMIN") return <Navigate to="/doacoes" replace />;

  return <Outlet />;
}
