import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerWithEmail } from "./authService";
import AuthCard from "./AuthCard";
import PasswordInput from "../../components/PasswordInput";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim()) return setErrorMsg("Informe seu e-mail.");
    if (password.length < 6)
      return setErrorMsg("A senha deve ter pelo menos 6 caracteres.");

    setIsLoading(true);
    const { error } = await registerWithEmail(email.trim(), password);
    setIsLoading(false);

    if (error) {
      if (String(error.message).toLowerCase().includes("already")) {
        return setErrorMsg("Esse e-mail já está cadastrado.");
      }
      return setErrorMsg("Não foi possível criar sua conta. Tente novamente.");
    }

    setSuccessMsg(
      "Conta criada! Verifique seu e-mail para confirmar antes de entrar.",
    );
  };

  return (
    <AuthCard
      title="Criar conta"
      subtitle="Crie sua conta com e-mail e senha"
      footer={
        <button
          type="button"
          className="text-emerald-700 font-semibold hover:underline text-sm"
          onClick={() => navigate("/login")}
        >
          Já tenho conta — Entrar
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

      <form onSubmit={handleRegister} className="space-y-3">
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
          placeholder="Crie uma senha"
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-2xl bg-emerald-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {isLoading ? "Criando..." : "Criar conta"}
        </button>
      </form>
    </AuthCard>
  );
}
