import { useEffect, useState } from "react";
import {
  listAllDonations,
  markAsCollected,
  scheduleDonation,
} from "./adminDonationsServices";
import PageHeader from "../../components/PageHeader";
import { getDonationPhotoSignedUrl } from "../donations/donationsService";
import { MapPin, Phone, User2, CalendarDays } from "lucide-react";

function StatusBadge({ status }) {
  const styles = {
    PENDENTE: "bg-amber-50 text-amber-700 border-amber-200",
    AGENDADA: "bg-blue-50 text-blue-700 border-blue-200",
    COLETADA: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  const cls = styles[status] ?? "bg-slate-50 text-slate-700 border-slate-200";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${cls}`}
    >
      {status}
    </span>
  );
}

/** Modal (continua sendo usado APENAS para agendar/reagendar) */
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

/** Confirm simples (NÃO usa teu Modal grandão) */
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

  // fotos
  const [photoUrlMap, setPhotoUrlMap] = useState({});

  // modal agendar
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const [coletaData, setColetaData] = useState("");
  const [coletaPeriodo, setColetaPeriodo] = useState("MANHA");
  const [coletaObs, setColetaObs] = useState("");
  const [saving, setSaving] = useState(false);

  // toast
  const [toast, setToast] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const showToast = ({ type = "success", title, message }) => {
    setToast({ open: true, type, title, message });
  };
  const closeToast = () => setToast((prev) => ({ ...prev, open: false }));

  // confirm simples (coletada)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toCollect, setToCollect] = useState(null);
  const [collecting, setCollecting] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // abre confirm simples
  const setCollected = (d) => {
    setToCollect(d);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    if (collecting) return;
    setConfirmOpen(false);
    setToCollect(null);
  };

  // confirma finalização
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
    <div className="max-w-5xl mx-auto py-8 px-6">
      <PageHeader
        title="Gerenciamento de Doações"
        subtitle="Controle e organize todas as solicitações de doações."
      />

      <div className="mt-6">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-11 rounded-2xl border px-4 bg-white font-semibold"
        >
          <option value="ALL">Todas</option>
          <option value="PENDENTE">Pendentes</option>
          <option value="AGENDADA">Agendadas</option>
          <option value="COLETADA">Coletadas</option>
        </select>
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
        <div className="mt-6 grid gap-4">
          {donations.map((d) => {
            const p = d.profiles;
            const donorName = p?.nome ?? "Doador";
            const donorPhone = p?.telefone ?? "-";
            const donorAddress = p?.endereco ?? "-";

            const imgUrl = d.foto_path ? photoUrlMap[d.foto_path] : null;

            return (
              <div
                key={d.id}
                className="rounded-2xl bg-white border shadow-sm p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 min-w-0">
                    <div className="h-24 w-24 rounded-2xl bg-emerald-50 border overflow-hidden grid place-items-center shrink-0">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt="Foto"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-slate-400 text-center px-2">
                          Sem foto
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <StatusBadge status={d.status} />
                        <span className="text-xs text-slate-400">
                          {fmtDate(d.created_at)}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          Quantidade: {d.quantidade}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-extrabold text-slate-900 truncate">
                        {d.descricao}
                      </h3>

                      <div className="mt-3 grid gap-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <User2 className="h-4 w-4 text-slate-400" />
                          <span className="font-semibold text-slate-700">
                            {donorName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span>{donorPhone}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span className="truncate">{donorAddress}</span>
                        </div>

                        {d.status === "AGENDADA" && d.coleta_data ? (
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-slate-400" />
                            <span>
                              <span className="font-semibold">Coleta:</span>{" "}
                              {fmtDate(d.coleta_data)} •{" "}
                              {periodoLabel(d.coleta_periodo)}
                            </span>
                          </div>
                        ) : null}

                        {d.coleta_observacao ? (
                          <div className="text-sm text-slate-500">
                            <span className="font-semibold text-slate-600">
                              Obs:
                            </span>{" "}
                            {d.coleta_observacao}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col gap-2">
                    {d.status !== "COLETADA" ? (
                      <button
                        type="button"
                        onClick={() => openSchedule(d)}
                        className="h-10 px-4 rounded-2xl border font-semibold hover:bg-slate-50"
                      >
                        {d.status === "AGENDADA" ? "Reagendar" : "Agendar"}
                      </button>
                    ) : null}

                    {d.status !== "COLETADA" ? (
                      <button
                        type="button"
                        onClick={() => setCollected(d)}
                        className="h-10 px-4 rounded-2xl bg-emerald-700 text-white font-semibold hover:bg-emerald-800"
                      >
                        Marcar coletada
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 text-center">
                        Finalizada
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* modal agendar */}
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

      {/* confirm simples (coletada) */}
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

      {/* toast */}
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
