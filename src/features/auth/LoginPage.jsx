import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { loginWithGoogle, loginWithEmail } from "./authService";
import AuthCard from "./AuthCard";
import GoogleIcon from "../../components/icons/GoogleIcon";
import PasswordInput from "../../components/PasswordInput";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/doacoes", { replace: true });
    });
  }, [navigate]);

  const handleGoogle = async () => {
    setErrorMsg("");
    setIsLoading(true);
    const { error } = await loginWithGoogle();
    if (error) setErrorMsg("Não foi possível entrar com Google.");
    setIsLoading(false);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const { error } = await loginWithEmail(email, password);
    setIsLoading(false);

    if (error) return setErrorMsg("Email ou senha inválidos.");
    navigate("/doacoes", { replace: true });
  };

  return (
    <AuthCard
      title="Login com Google"
      subtitle="Acesse rapidamente usando sua conta Google"
      footer={
        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            className="text-emerald-700 font-semibold hover:underline"
            onClick={() => navigate("/cadastro")}
          >
            Criar conta
          </button>

          <button
            type="button"
            className="text-slate-500 hover:underline"
            onClick={() => navigate("/esqueci-senha")}
          >
            Esqueci minha senha
          </button>
        </div>
      }
    >
      {errorMsg ? (
        <div className="mb-4 rounded-2xl bg-red-50 text-red-700 px-4 py-3 text-sm">
          {errorMsg}
        </div>
      ) : null}

      <button
        onClick={handleGoogle}
        disabled={isLoading}
        className="w-full h-12 rounded-2xl border bg-white hover:bg-slate-50 transition font-semibold flex items-center justify-center gap-3 disabled:opacity-60"
      >
        <GoogleIcon className="h-5 w-5" />
        <span>{isLoading ? "Aguarde..." : "Entrar com Google"}</span>
      </button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">OU</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-3">
        <input
          type="email"
          placeholder="Seu e-mail"
          className="w-full h-12 px-4 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Sua senha"
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-2xl bg-emerald-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          Entrar com e-mail
        </button>
      </form>
    </AuthCard>
  );
}
