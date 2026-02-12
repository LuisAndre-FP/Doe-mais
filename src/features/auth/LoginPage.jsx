import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const userEmail = data.session?.user?.email ?? "";
      setEmail(userEmail);

      if (data.session) navigate("/doacoes", { replace: true });

    });
  }, [navigate]);

  const loginGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <h1 className="text-3xl font-extrabold text-emerald-600 tracking-tight">
          DOE+
        </h1>
        <p className="text-slate-500 mt-1">Gerenciamento de doações</p>

        <div className="mt-6 rounded-2xl border p-5">
          <h2 className="text-lg font-bold">Bem-vindo de volta</h2>
          <p className="text-sm text-slate-500">Escolha como deseja acessar</p>

          <button
            onClick={loginGoogle}
            className="mt-5 w-full h-12 rounded-2xl bg-black text-white font-semibold hover:opacity-90 transition"
          >
            Entrar com Google
          </button>

          <button
            type="button"
            className="mt-4 w-full text-emerald-600 font-semibold text-sm hover:underline"
          >
            Criar conta com e-mail (em breve)
          </button>
        </div>
      </div>
    </div>
  );
}
