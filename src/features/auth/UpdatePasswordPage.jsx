import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import AuthCard from "./AuthCard";
import PasswordInput from "../../components/PasswordInput";

export default function UpdatePasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session)
        setErrorMsg("Link inválido ou expirado. Solicite novamente.");
    });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password.length < 6)
      return setErrorMsg("A senha deve ter pelo menos 6 caracteres.");
    if (password !== confirm) return setErrorMsg("As senhas não conferem.");

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) return setErrorMsg("Não foi possível atualizar a senha.");

    setSuccessMsg("Senha atualizada! Você já pode entrar.");
    setTimeout(() => navigate("/login", { replace: true }), 1200);
  };

  return (
    <AuthCard
      title="Atualizar senha"
      subtitle="Defina uma nova senha para sua conta"
      footer={
        <button
          type="button"
          className="text-emerald-700 font-semibold hover:underline text-sm"
          onClick={() => navigate("/login")}
        >
          Voltar para login
        </button>
      }
    >
      {errorMsg ? (
        <div className="mb-4 rounded-2xl bg-red-50 text-red-700 px-4 py-3 text-sm">
          {errorMsg}
        </div>
      ) : null}

      {successMsg ? (
        <div className="mb-4 rounded-2xl bg-emerald-50 text-emerald-700 px-4 py-3 text-sm">
          {successMsg}
        </div>
      ) : null}

      <form onSubmit={handleUpdate} className="space-y-3">
        <PasswordInput
          type="password"
          placeholder="Nova senha"
          className="w-full h-12 px-4 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          disabled={!!errorMsg}
        />

        <PasswordInput
          type="password"
          placeholder="Confirmar nova senha"
          className="w-full h-12 px-4 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          disabled={!!errorMsg}
        />

        <button
          type="submit"
          disabled={isLoading || !!errorMsg}
          className="w-full h-12 rounded-2xl bg-emerald-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {isLoading ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </AuthCard>
  );
}
