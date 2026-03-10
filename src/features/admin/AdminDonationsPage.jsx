import { useEffect, useState } from "react";
import {
  listAllDonations,
  markAsCollected,
  scheduleDonation,
} from "./adminDonationsServices";
import PageHeader from "../../components/PageHeader";
import { getDonationPhotoSignedUrl } from "../donations/donationsService";
import { MapPin, Phone, CalendarDays } from "lucide-react";

function StatusBadge({ status }) {
  const styles = {
    PENDENTE: "bg-amber-100 text-amber-700",
    AGENDADA: "bg-blue-100 text-blue-700",
    COLETADA: "bg-emerald-100 text-emerald-700",
  };

  const cls = styles[status] ?? "bg-slate-100 text-slate-700";

  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "h-7 px-3 rounded-full",
        "text-[11px] font-extrabold tracking-widest uppercase",
        cls,
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function StatusTabs({ value, onChange }) {
  const tabs = [
    { value: "ALL", label: "Todos" },
    { value: "PENDENTE", label: "Pendente" },
    { value: "AGENDADA", label: "Agendada" },
    { value: "COLETADA", label: "Coletada" },
  ];

  return (
    <div className="inline-flex rounded-2xl bg-white border border-emerald-200 shadow-sm p-1">
      {tabs.map((t) => {
        const active = value === t.value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={[
              "h-9 px-4 rounded-xl",
              "text-[11px] font-extrabold tracking-widest uppercase",
              "transition",
              active
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function AdminDonationCard({
  d,
  imgUrl,
  donorName,
  donorPhone,
  donorAddress,
  onSchedule,
  onCollect,
  fmtDate,
  periodoLabel,
}) {
  const isScheduled = d.status === "AGENDADA";

  return (
    <div className="rounded-[32px] bg-white border border-slate-100 shadow-sm p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative w-full md:w-[260px] h-[170px] rounded-[28px] overflow-hidden bg-slate-50 border border-slate-100">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt="Foto do item"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-slate-400 text-sm font-semibold">
              Sem foto
            </div>
          )}

          <div className="absolute top-3 left-3">
            <StatusBadge status={d.status} />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-2xl font-extrabold text-slate-900 truncate">
                {d.descricao}
              </h3>

              <p className="mt-1 text-xs font-extrabold tracking-widest text-slate-400 uppercase">
                Doador:{" "}
                <span className="tracking-normal text-slate-700 font-bold normal-case">
                  {donorName}
                </span>
              </p>
            </div>

            <span className="shrink-0 rounded-2xl bg-slate-50 border border-slate-100 px-3 py-2 text-xs font-extrabold text-slate-700">
              QTD: {d.quantidade}
            </span>
          </div>

          <div className="mt-4 grid gap-3 text-sm">
            <div className="flex items-start gap-2 text-slate-600">
              <MapPin className="h-4 w-4 mt-0.5 text-slate-400" />
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase">
                  Endereço de coleta
                </p>
                <p className="font-semibold text-slate-700 truncate">
                  {donorAddress}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-600">
              <Phone className="h-4 w-4 mt-0.5 text-slate-400" />
              <div>
                <p className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase">
                  Telefone
                </p>
                <p className="font-semibold text-slate-700">{donorPhone}</p>
              </div>
            </div>

            {isScheduled && d.coleta_data ? (
              <div className="flex items-start gap-2 text-slate-600">
                <CalendarDays className="h-4 w-4 mt-0.5 text-slate-400" />
                <div>
                  <p className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase">
                    Coleta agendada
                  </p>
                  <p className="font-semibold text-blue-700">
                    {fmtDate(d.coleta_data)} ({periodoLabel(d.coleta_periodo)})
                  </p>
                </div>
              </div>
            ) : null}

            {isScheduled && d.coleta_observacao ? (
              <div className="mt-2 text-sm text-slate-600">
                <span className="font-extrabold text-slate-700">
                  Observação:
                </span>{" "}
                {d.coleta_observacao}
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {d.status === "PENDENTE" ? (
              <button
                type="button"
                onClick={onSchedule}
                className="h-11 px-6 rounded-2xl bg-emerald-600 text-white font-extrabold hover:bg-emerald-700 shadow-sm"
              >
                AGENDAR COLETA
              </button>
            ) : null}

            {d.status === "AGENDADA" ? (
              <>
                <button
                  type="button"
                  onClick={onCollect}
                  className="h-11 px-6 rounded-2xl bg-emerald-600 text-white font-extrabold hover:bg-emerald-700 shadow-sm"
                >
                  MARCAR COMO COLETADA
                </button>

                <button
                  type="button"
                  onClick={onSchedule}
                  className="h-11 px-6 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 font-extrabold hover:bg-slate-100"
                >
                  REAGENDAR
                </button>
              </>
            ) : null}

            {d.status === "COLETADA" ? (
              <span className="text-sm font-bold text-slate-400">
                Finalizada em {fmtDate(d.updated_at || d.created_at)}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Modal({ open, onClose, title, subtitle, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-[28px] bg-white shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">{title}</h3>
              {subtitle ? (
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-2xl hover:bg-slate-100 grid place-items-center"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          <div className="px-6 pb-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Toast({ open, type = "success", title, message, onClose }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;

  const styles =
    type === "error"
      ? "bg-red-50 border-red-200 text-red-800"
      : "bg-emerald-50 border-emerald-200 text-emerald-800";

  const dot = type === "error" ? "bg-red-500" : "bg-emerald-600";

  return (
    <div className="fixed top-4 right-4 z-[9999] w-[92vw] max-w-sm">
      <div className={`rounded-2xl border shadow-lg p-4 ${styles}`}>
        <div className="flex items-start gap-3">
          <span className={`mt-1 h-2.5 w-2.5 rounded-full ${dot}`} />
          <div className="min-w-0">
            {title ? <p className="font-extrabold leading-5">{title}</p> : null}
            {message ? (
              <p className="text-sm mt-1 opacity-90">{message}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-auto h-8 w-8 rounded-xl hover:bg-black/5 grid place-items-center"
            aria-label="Fechar toast"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({
  open,
  title = "Confirmar",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
  onConfirm,
  onClose,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "Enter") onConfirm?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onConfirm]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => {
          if (!loading) onClose?.();
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
            {message ? (
              <p className="mt-1 text-sm text-slate-500">{message}</p>
            ) : null}
          </div>

          <div className="p-5 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 h-11 rounded-2xl border font-extrabold hover:bg-slate-50 disabled:opacity-60"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 h-11 rounded-2xl bg-emerald-700 text-white font-extrabold hover:bg-emerald-800 disabled:opacity-60"
            >
              {loading ? "Finalizando..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDonationsPage() {
  const [status, setStatus] = useState("ALL");
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [photoUrlMap, setPhotoUrlMap] = useState({});

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const [coletaData, setColetaData] = useState("");
  const [coletaPeriodo, setColetaPeriodo] = useState("MANHA");
  const [coletaObs, setColetaObs] = useState("");
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toCollect, setToCollect] = useState(null);
  const [collecting, setCollecting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const showToast = ({ type = "success", title, message }) => {
    setToast({ open: true, type, title, message });
  };

  const closeToast = () => setToast((prev) => ({ ...prev, open: false }));

  const fmtDate = (v) => (v ? new Date(v).toLocaleDateString("pt-BR") : "");

  const periodoLabel = (p) =>
    p === "MANHA"
      ? "Manhã"
      : p === "TARDE"
        ? "Tarde"
        : p === "NOITE"
          ? "Noite"
          : p;

  const load = async () => {
    setErrorMsg("");
    setLoading(true);

    const { data, error } = await listAllDonations(status);

    setLoading(false);
    if (error) {
      setErrorMsg(error.message || "Erro ao carregar doações.");
      return;
    }
    setDonations(data ?? []);
  };

  useEffect(() => {
    load();
  }, [status]);

  useEffect(() => {
    const run = async () => {
      const missing = (donations ?? [])
        .map((d) => d.foto_path)
        .filter(Boolean)
        .filter((path) => !photoUrlMap[path]);

      for (const path of missing) {
        const { data, error } = await getDonationPhotoSignedUrl(path);
        if (!error && data?.signedUrl) {
          setPhotoUrlMap((prev) => ({ ...prev, [path]: data.signedUrl }));
        }
      }
    };

    if ((donations ?? []).length > 0) run();
  }, [donations]);

  const openSchedule = (d) => {
    setSelectedDonation(d);
    setColetaData(d.coleta_data ?? "");
    setColetaPeriodo(d.coleta_periodo ?? "MANHA");
    setColetaObs(d.coleta_observacao ?? "");
    setScheduleOpen(true);
  };

  const saveSchedule = async () => {
    if (!selectedDonation) return;

    if (!coletaData) {
      showToast({
        type: "error",
        title: "Data obrigatória",
        message: "Escolha uma data para a coleta.",
      });
      return;
    }

    if (coletaData < today) {
      showToast({
        type: "error",
        title: "Data inválida",
        message: "Não é possível agendar coleta para uma data passada.",
      });
      return;
    }

    const isReschedule = selectedDonation.status === "AGENDADA";

    setSaving(true);
    const { error } = await scheduleDonation(selectedDonation.id, {
      coleta_data: coletaData,
      coleta_periodo: coletaPeriodo,
      coleta_observacao: coletaObs,
    });
    setSaving(false);

    if (error) {
      showToast({
        type: "error",
        title: "Não foi possível salvar",
        message: error.message || "Tente novamente.",
      });
      return;
    }

    setScheduleOpen(false);
    setSelectedDonation(null);

    showToast({
      type: "success",
      title: isReschedule ? "Coleta reagendada ✅" : "Coleta agendada ✅",
      message: `Data: ${fmtDate(coletaData)} • ${periodoLabel(coletaPeriodo)}`,
    });

    load();
  };

  const setCollected = (d) => {
    setToCollect(d);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    if (collecting) return;
    setConfirmOpen(false);
    setToCollect(null);
  };

  const confirmCollected = async () => {
    if (!toCollect) return;

    setCollecting(true);
    const { error } = await markAsCollected(toCollect.id);
    setCollecting(false);

    if (error) {
      showToast({
        type: "error",
        title: "Erro ao finalizar",
        message: error.message || "Tente novamente.",
      });
      return;
    }

    showToast({
      type: "success",
      title: "Doação finalizada ✅",
      message: toCollect.descricao,
    });

    setConfirmOpen(false);
    setToCollect(null);
    load();
  };

  return (
    <div className="max-w-5xl mx-auto py-2 px-2">
      <PageHeader
        title="Gerenciamento de Doações"
        subtitle="Controle e organize todas as solicitações de doações."
      />

      <div className="mt-6">
        <StatusTabs value={status} onChange={setStatus} />
      </div>

      {errorMsg ? (
        <div className="mt-5 rounded-2xl bg-red-50 text-red-700 border border-red-200 px-4 py-3">
          {errorMsg}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-6 rounded-2xl bg-white border p-6">
          Carregando...
        </div>
      ) : null}

      {!loading && donations.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white border p-6 text-center">
          <p className="font-bold text-slate-900">
            Nenhuma doação nesse filtro
          </p>
        </div>
      ) : null}

      {!loading && donations.length > 0 ? (
        <div className="mt-6 grid gap-5">
          {donations.map((d) => {
            const p = d.profiles;
            const donorName = p?.nome ?? "Doador";
            const donorPhone = p?.telefone ?? "-";
            const donorAddress = p?.endereco ?? "-";
            const imgUrl = d.foto_path ? photoUrlMap[d.foto_path] : null;

            return (
              <AdminDonationCard
                key={d.id}
                d={d}
                imgUrl={imgUrl}
                donorName={donorName}
                donorPhone={donorPhone}
                donorAddress={donorAddress}
                onSchedule={() => openSchedule(d)}
                onCollect={() => setCollected(d)}
                fmtDate={fmtDate}
                periodoLabel={periodoLabel}
              />
            );
          })}
        </div>
      ) : null}

      <Modal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        title={
          selectedDonation?.status === "AGENDADA"
            ? "Reagendar coleta"
            : "Agendar coleta"
        }
        subtitle={selectedDonation ? `Item: ${selectedDonation.descricao}` : ""}
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
              Data prevista
            </label>
            <input
              type="date"
              min={today}
              value={coletaData}
              onChange={(e) => setColetaData(e.target.value)}
              className="h-12 w-full rounded-2xl bg-slate-50 border border-transparent px-4 font-semibold text-slate-900
                         focus:bg-white focus:border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
              Período do dia
            </label>

            <div className="grid grid-cols-3 gap-2">
              {["MANHA", "TARDE", "NOITE"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setColetaPeriodo(p)}
                  className={[
                    "h-11 rounded-2xl border font-bold",
                    coletaPeriodo === p
                      ? "bg-emerald-700 text-white border-emerald-700"
                      : "bg-white hover:bg-slate-50",
                  ].join(" ")}
                >
                  {periodoLabel(p)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
              Observação (opcional)
            </label>
            <textarea
              value={coletaObs}
              onChange={(e) => setColetaObs(e.target.value)}
              className="w-full rounded-2xl bg-slate-50 border border-transparent p-4 min-h-[110px] font-semibold text-slate-900
                         focus:bg-white focus:border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              placeholder="Ex: Ligar antes de chegar..."
            />
          </div>

          <button
            type="button"
            onClick={saveSchedule}
            className="mt-2 w-full h-12 rounded-2xl bg-emerald-700 text-white font-extrabold hover:bg-emerald-800 disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Salvando..." : "Confirmar agendamento"}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Concluir doação?"
        message={
          toCollect ? `Marcar "${toCollect.descricao}" como COLETADA?` : ""
        }
        confirmText="Sim, concluir"
        cancelText="Não"
        loading={collecting}
        onClose={closeConfirm}
        onConfirm={confirmCollected}
      />

      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={closeToast}
      />
    </div>
  );
}
