import { useEffect, useMemo, useState } from "react";
import { useSession } from "../../hooks/useSession";
import { getProfile, updateProfile } from "./profileService";
import { User2, Search, X, Users, Shield, ClipboardList } from "lucide-react";

import {
  listUsersProfiles,
  setUserRole,
  listRoleAudit,
} from "../admin/adminUserService";

function normalizePhone(value) {
  return (value ?? "").replace(/[^\d()+\-\s]/g, "");
}

export default function Perfil() {
  const { session, loading } = useSession();
  const user = session?.user ?? null;

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
  });

  const [myRole, setMyRole] = useState("USER");

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const displayName = useMemo(() => {
    return form.nome?.trim() || "Seu nome";
  }, [form.nome]);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      setMsg("");
      const { data, error } = await getProfile(user.id);

      if (!error && data) {
        setMyRole(String(data.role ?? "USER").trim());

        setForm({
          nome: data.nome ?? "",
          email: data.email ?? user.email ?? "",
          telefone: data.telefone ?? "",
          endereco: data.endereco ?? "",
        });
      } else {
        setForm((prev) => ({ ...prev, email: user.email ?? "" }));
      }
    };

    loadProfile();
  }, [user]);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const salvar = async () => {
    if (!user) return;
    setSaving(true);
    setMsg("");

    const complete = !!form.telefone?.trim() && !!form.endereco?.trim();

    const { error } = await updateProfile(user.id, {
      nome: form.nome,
      telefone: form.telefone,
      endereco: form.endereco,
      profile_completed: complete,
    });

    setSaving(false);

    if (error) setMsg("Erro ao salvar: " + (error.message || ""));
    else setMsg("Perfil salvo com sucesso!");
  };

  if (loading) return <div className="p-6">Carregando...</div>;
  if (!user) return <p className="p-6">Você precisa estar logado.</p>;

  return (
    <div className="max-w-5xl mx-auto py-2 px-2">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Perfil</h1>
          <p className="text-slate-500 mt-1">
            Visualize e atualize suas informações pessoais.
          </p>
        </div>
      </div>

      <div className="mt-6 mx-auto w-full max-w-[720px]">
        <div className="rounded-[32px] bg-white shadow-sm border border-emerald-100 overflow-hidden">
          <div className="px-8 pt-10 pb-8 text-center">
            <div className="mx-auto h-20 w-20 rounded-3xl bg-emerald-50 border border-emerald-100 grid place-items-center shadow-sm">
              <User2 className="h-9 w-9 text-emerald-600" />
            </div>

            <h2 className="mt-5 text-2xl font-extrabold text-slate-900">
              {displayName}
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-500">
              {form.email || user.email}
            </p>
          </div>

          <div className="px-8 pb-10">
            <div className="space-y-6">
              <Field label="NOME">
                <input
                  name="nome"
                  value={form.nome}
                  onChange={onChange}
                  className="h-12 w-full rounded-2xl bg-slate-50 border border-transparent px-4 font-semibold text-slate-900
                             focus:bg-white focus:border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  placeholder="Seu nome"
                />
              </Field>

              <Field label="TELEFONE">
                <input
                  name="telefone"
                  value={form.telefone}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      telefone: normalizePhone(e.target.value),
                    }))
                  }
                  className="h-12 w-full rounded-2xl bg-slate-50 border border-transparent px-4 font-semibold text-slate-900
                             focus:bg-white focus:border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  placeholder="(11) 99999-9999"
                />
              </Field>

              <Field label="ENDEREÇO COMPLETO">
                <input
                  name="endereco"
                  value={form.endereco}
                  onChange={onChange}
                  className="h-12 w-full rounded-2xl bg-slate-50 border border-transparent px-4 font-semibold text-slate-900
                             focus:bg-white focus:border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                />
              </Field>

              {msg ? (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm border ${
                    msg.startsWith("Erro")
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  {msg}
                </div>
              ) : null}

              <button
                onClick={salvar}
                disabled={saving}
                className="w-full h-14 rounded-2xl bg-emerald-700 text-white font-extrabold
                           hover:bg-emerald-800 transition disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {myRole === "ADMIN" ? <AdminUsersPanel /> : null}
    </div>
  );
}

function AdminUsersPanel() {
  const [openUsers, setOpenUsers] = useState(false);
  const [openAudit, setOpenAudit] = useState(false);

  // Users
  const [qUsers, setQUsers] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Audit
  const [qAudit, setQAudit] = useState("");
  const [audit, setAudit] = useState([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  const [msg, setMsg] = useState("");

  const loadUsers = async () => {
    setLoadingUsers(true);
    setMsg("");
    const { data, error } = await listUsersProfiles({ q: qUsers });
    setLoadingUsers(false);
    if (error) return setMsg(error.message || "Erro ao carregar usuários.");
    setUsers(data ?? []);
  };

  const loadAudit = async () => {
    setLoadingAudit(true);
    setMsg("");
    const { data, error } = await listRoleAudit({ limit: 80 });
    setLoadingAudit(false);
    if (error) return setMsg(error.message || "Erro ao carregar auditoria.");
    setAudit(data ?? []);
  };

  useEffect(() => {
    if (openUsers) loadUsers();
  }, [openUsers]);

  useEffect(() => {
    if (openAudit) loadAudit();
  }, [openAudit]);

  const filteredAudit = useMemo(() => {
    const q = qAudit.trim().toLowerCase();
    if (!q) return audit;

    return (audit ?? []).filter((a) => {
      const actor = (a.actor?.nome || a.actor?.email || "").toLowerCase();
      const target = (a.target?.nome || a.target?.email || "").toLowerCase();
      const text =
        `${actor} ${target} ${a.old_role || ""} ${a.new_role || ""}`.toLowerCase();
      return text.includes(q);
    });
  }, [audit, qAudit]);

  const toggleRole = async (u) => {
    const current = String(u.role || "USER").trim();
    const next = current === "ADMIN" ? "USER" : "ADMIN";

    const ok = confirm(
      next === "ADMIN"
        ? `Promover ${u.nome || u.email} para ADMIN?`
        : `Alterar permissão de ${u.nome || u.email} para USER?`,
    );
    if (!ok) return;

    setMsg("");
    const { error } = await setUserRole(u.id, next);
    if (error) return setMsg(error.message || "Erro ao alterar role.");

    setMsg("Permissão atualizada ✅");
    await loadUsers();
    await loadAudit();
  };

  return (
    <div className="mt-10">
      <div className="grid gap-4">
        <AdminActionCard
          title="Controle de Usuários"
          subtitle="Gerencie permissões e status de usuários"
          icon={Shield}
          actionLabel="Gerenciar"
          onAction={() => setOpenUsers(true)}
        />

        <AdminActionCard
          title="Registro de Auditoria"
          subtitle="Histórico completo de ações administrativas"
          icon={ClipboardList}
          actionLabel="Ver Registros"
          onAction={() => setOpenAudit(true)}
        />
      </div>

      {msg ? (
        <div
          className={[
            "mt-4 rounded-2xl px-4 py-3 text-sm border",
            msg.toLowerCase().includes("erro")
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200",
          ].join(" ")}
        >
          {msg}
        </div>
      ) : null}

      <ModalShell
        open={openUsers}
        onClose={() => setOpenUsers(false)}
        title="Controle de Usuários"
        subtitle="Gerencie permissões e status de usuários"
        icon={Shield}
      >
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={qUsers}
              onChange={(e) => setQUsers(e.target.value)}
              placeholder="Buscar por nome ou email..."
              className="h-12 w-full pl-11 pr-4 rounded-2xl bg-slate-50 border border-transparent font-semibold text-slate-900
                         focus:bg-white focus:border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={loadUsers}
              disabled={loadingUsers}
              className="h-11 px-5 rounded-2xl bg-emerald-700 text-white font-extrabold hover:bg-emerald-800 disabled:opacity-60"
            >
              {loadingUsers ? "Carregando..." : "Buscar"}
            </button>
          </div>

          <div className="grid gap-3 max-h-[55vh] overflow-auto pr-1">
            {loadingUsers ? (
              <div className="rounded-2xl bg-white border p-5">
                Carregando usuários...
              </div>
            ) : users.length === 0 ? (
              <div className="rounded-2xl bg-white border p-5 text-slate-500">
                Nenhum usuário encontrado.
              </div>
            ) : (
              users.map((u) => {
                const role = String(u.role || "USER").trim();
                const isAdmin = role === "ADMIN";

                return (
                  <div
                    key={u.id}
                    className="rounded-2xl bg-white border border-slate-200 p-5"
                  >
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-900 truncate">
                          {u.nome || u.email || "Sem nome"}
                        </p>
                        <p className="text-sm text-slate-500 truncate">
                          {u.email || "—"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <RolePill role={role} />

                        <button
                          type="button"
                          onClick={() => toggleRole(u)}
                          className={[
                            "h-10 px-4 rounded-2xl border font-extrabold transition",
                            isAdmin
                              ? "border-slate-200 bg-white hover:bg-slate-50 text-slate-900"
                              : "border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800",
                          ].join(" ")}
                        >
                          {isAdmin
                            ? "Alterrar para USER"
                            : "Promover para ADMIN"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </ModalShell>

      <ModalShell
        open={openAudit}
        onClose={() => setOpenAudit(false)}
        title="Registro de Auditoria"
        subtitle="Histórico completo de ações administrativas"
        icon={ClipboardList}
      >
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={qAudit}
              onChange={(e) => setQAudit(e.target.value)}
              placeholder="Buscar por nome de usuário..."
              className="h-12 w-full pl-11 pr-4 rounded-2xl bg-slate-50 border border-transparent font-semibold text-slate-900
                         focus:bg-white focus:border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <div className="grid gap-3 max-h-[60vh] overflow-auto pr-1">
            {loadingAudit ? (
              <div className="rounded-2xl bg-white border p-5">
                Carregando logs...
              </div>
            ) : filteredAudit.length === 0 ? (
              <div className="rounded-2xl bg-white border p-5 text-slate-500">
                Nenhum log ainda.
              </div>
            ) : (
              filteredAudit.map((a) => (
                <div
                  key={a.id}
                  className="rounded-2xl bg-white border border-slate-200 p-5"
                >
                  <p className="text-sm text-slate-700">
                    <span className="font-extrabold">
                      {a.actor?.nome || a.actor?.email || "Admin"}
                    </span>{" "}
                    <span className="text-emerald-700 font-extrabold">
                      {String(a.new_role || "").trim() === "ADMIN"
                        ? "promoveu"
                        : "alterou a permissão de ADMIN para USER de"}
                    </span>{" "}
                    <span className="font-extrabold">
                      {a.target?.nome || a.target?.email || "Usuário"}
                    </span>
                    .
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(a.created_at).toLocaleString("pt-BR")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </ModalShell>
    </div>
  );
}

function AdminActionCard({
  title,
  subtitle,
  icon: Icon,
  actionLabel,
  onAction,
}) {
  return (
    <div className="rounded-3xl bg-white border border-emerald-100 shadow-sm p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-100 grid place-items-center">
            <Icon className="h-5 w-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAction}
          className="h-11 px-5 rounded-2xl bg-emerald-700 text-white font-extrabold hover:bg-emerald-800 transition flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

function ModalShell({ open, onClose, title, subtitle, icon: Icon, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-100 grid place-items-center">
                {Icon ? <Icon className="h-5 w-5 text-emerald-700" /> : null}
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {title}
                </h3>
                {subtitle ? (
                  <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-11 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 font-extrabold flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Fechar
            </button>
          </div>

          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

function RolePill({ role }) {
  const isAdmin = String(role || "").trim() === "ADMIN";
  return (
    <span
      className={[
        "inline-flex items-center px-3 py-1 rounded-full border text-xs font-extrabold",
        isAdmin
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-slate-50 text-slate-700 border-slate-200",
      ].join(" ")}
    >
      {isAdmin ? "ADMIN" : "USER"}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
        {label}
      </label>
      {children}
    </div>
  );
}
