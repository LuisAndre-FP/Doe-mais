import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) navigate("/doacoes", { replace: true });
      else navigate("/login", { replace: true });
    };

    run();
  }, [navigate]);

  return <div className="p-6">Finalizando login...</div>;
}
