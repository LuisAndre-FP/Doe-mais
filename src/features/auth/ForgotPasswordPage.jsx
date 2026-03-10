import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "./authService";
import AuthCard from "./AuthCard";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim()) return setErrorMsg("Informe seu e-mail.");

    setIsLoading(true);
    const { error } = await requestPasswordReset(email.trim());
    setIsLoading(false);

    if (error)
      return setErrorMsg("Não foi possível enviar o e-mail. Tente novamente.");

    setSuccessMsg(
      "Se esse e-mail existir, você receberá um link para redefinir sua senha.",
    );
  };

  return (
    <AuthCard
      title="Esqueci minha senha"
      subtitle="Informe seu e-mail para receber um link de redefinição"
      footer={
        <div className="flex gap-3 text-sm">
          <button
            type="button"
            className="text-emerald-700 font-semibold hover:underline"
            onClick={() => navigate("/login")}
          >
            Voltar para login
          </button>
          <span className="text-slate-400">•</span>
          <button
            type="button"
            className="text-slate-600 hover:underline"
            onClick={() => navigate("/cadastro")}
          >
            Criar conta
          </button>
        </div>
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

      <form onSubmit={handleReset} className="space-y-3">
        <input
          type="email"
          placeholder="Seu e-mail"
          className="w-full h-12 px-4 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-2xl bg-emerald-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {isLoading ? "Enviando..." : "Enviar link"}
        </button>
      </form>
    </AuthCard>
  );
}
