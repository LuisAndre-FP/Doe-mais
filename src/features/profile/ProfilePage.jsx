import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useSession } from "../../hooks/useSession";

export default function Perfil() {
  const { user, loading } = useSession();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("nome,email,telefone,endereco")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setForm({
          nome: data.nome ?? "",
          email: data.email ?? user.email ?? "",
          telefone: data.telefone ?? "",
          endereco: data.endereco ?? "",
        });
      }
    };

    loadProfile();
  }, [user]);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const salvar = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        nome: form.nome,
        telefone: form.telefone,
        endereco: form.endereco,
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) alert("Erro ao salvar: " + error.message);
    else alert("Perfil salvo ✅");
  };

  if (loading) return null;
  if (!user) return <p className="p-6">Você precisa estar logado.</p>;

  return (
    <div className="min-h-screen bg-emerald-50 p-6 flex justify-center">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-emerald-700">Meu Perfil</h1>
        <p className="text-slate-500 mt-1">
          Complete seus dados para facilitar a coleta.
        </p>

        <div className="mt-6 grid gap-4">
          <div>
            <label className="text-sm font-semibold">Nome</label>
            <input
              name="nome"
              value={form.nome}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border p-3"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">E-mail</label>
            <input
              value={form.email}
              disabled
              className="mt-1 w-full rounded-xl border p-3 bg-slate-50 text-slate-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Telefone</label>
            <input
              name="telefone"
              value={form.telefone}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border p-3"
              placeholder="(xx) xxxxx-xxxx"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Endereço</label>
            <input
              name="endereco"
              value={form.endereco}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border p-3"
              placeholder="Rua, número, bairro, cidade - UF"
            />
          </div>

          <button
            onClick={salvar}
            disabled={saving}
            className="mt-2 w-full rounded-xl bg-emerald-600 text-white py-3 font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
