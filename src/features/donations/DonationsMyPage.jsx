import { useEffect, useMemo, useState } from "react";
import {
  listMyDonations,
  getDonationPhotoSignedUrl,
} from "../donations/donationsService";
import PageHeader from "../../components/PageHeader";

function formatDateBR(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR");
}

function StatusBadge({ status }) {
  const styles = {
    PENDENTE: "bg-amber-100 text-amber-700",
    AGENDADA: "bg-blue-100 text-blue-700",
    COLETADA: "bg-emerald-100 text-emerald-700",
  };

  const label = status ?? "-";
  const cls = styles[status] ?? "bg-slate-100 text-slate-700";

  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "h-7 px-3 rounded-full",
        "text-[11px] font-extrabold tracking-wide uppercase",
        cls,
      ].join(" ")}
    >
      {label}
    </span>
  );
}

function DonationCard({ d, photoUrl }) {
  const metaTop = `${d.quantidade ?? "-"} UN • ${d.estado_item ?? "-"}`;

  return (
    <div
      className={[
        "rounded-[28px] bg-white",
        "border border-slate-200/60",
        "shadow-[0_10px_30px_-20px_rgba(2,6,23,0.35)]",
        "px-4 sm:px-6 py-5",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Foto do item"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-[11px] text-slate-400 font-semibold">
              Sem foto
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-[16px] sm:text-[17px] font-extrabold text-slate-900 break-words">
                {d.descricao}
              </h3>

              <p className="mt-0.5 text-[12px] font-bold tracking-wide text-slate-400 uppercase">
                {metaTop}
              </p>
            </div>

            <div className="shrink-0">
              <StatusBadge status={d.status} />
            </div>
          </div>

          {d.status === "AGENDADA" && d.coleta_data ? (
            <div className="mt-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold">Coleta:</span>{" "}
                <span className="font-extrabold text-slate-800">
                  {formatDateBR(d.coleta_data)}
                  {d.coleta_periodo ? ` • ${d.coleta_periodo}` : ""}
                </span>
              </p>

              {d.coleta_observacao ? (
                <p className="mt-1">
                  <span className="font-semibold">Observação:</span>{" "}
                  {d.coleta_observacao}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
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
    <div className="overflow-x-auto pb-1 -mx-2 px-2">
      <div className="inline-flex rounded-2xl bg-white border border-emerald-200 shadow-sm p-1 min-w-max">
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
    </div>
  );
}

export default function DonationsMyPage() {
  const [donations, setDonations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [photoUrlMap, setPhotoUrlMap] = useState({});

  const load = async () => {
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await listMyDonations();
    setLoading(false);

    if (error) return setErrorMsg(error.message || "Erro ao carregar.");
    setDonations(data ?? []);
  };

  useEffect(() => {
    load();
  }, []);

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

  const filtered = useMemo(() => {
    const arr = donations ?? [];
    if (statusFilter === "ALL") return arr;
    return arr.filter((d) => d.status === statusFilter);
  }, [donations, statusFilter]);

  return (
    <div className="max-w-5xl mx-auto py-2 px-2">
      <PageHeader
        title="Minhas Doações"
        subtitle="Visualize, organize e acompanhe suas doações."
      />

      <div className="mt-6">
        <StatusTabs value={statusFilter} onChange={setStatusFilter} />
      </div>

      {errorMsg ? (
        <div className="mt-6 rounded-2xl bg-red-50 text-red-700 border border-red-200 px-4 py-3">
          {errorMsg}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-6 rounded-2xl bg-white border p-6">
          Carregando...
        </div>
      ) : null}

      {!loading && filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white border p-6 text-slate-500">
          Nenhuma doação nesse filtro.
        </div>
      ) : null}

      {!loading && filtered.length > 0 ? (
        <div className="mt-6 grid gap-4">
          {filtered
            .slice()
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((d) => (
              <DonationCard
                key={d.id}
                d={d}
                photoUrl={d.foto_path ? photoUrlMap[d.foto_path] : null}
              />
            ))}
        </div>
      ) : null}
    </div>
  );
}
