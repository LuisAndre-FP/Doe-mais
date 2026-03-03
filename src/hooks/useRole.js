import { useEffect, useState } from "react";
import { useSession } from "./useSession";
import { getMyRole } from "../features/admin/adminService";

export function useRole() {
  const { session, loading: sessionLoading } = useSession();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (sessionLoading) return;

      if (!session) {
        setRole("");
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await getMyRole();
      setRole(error ? "" : String(data ?? "").trim());
      setLoading(false);
    };

    run();
  }, [session, sessionLoading]);

  return { role, loading };
}
