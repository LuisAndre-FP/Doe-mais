import { useEffect, useState } from "react";
import { listMyDonations, getDonationPhotoSignedUrl } from "./donationsService";
import PageHeader from "../../components/PageHeader";

function formatDateBR(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR");
}

function StatusBadge({ status }) {
  const styles = {
    COLETADA: "bg-emerald-100 text-emerald-700",
    PENDENTE: "bg-amber-100 text-amber-700",
    AGENDADA: "bg-blue-100 text-blue-700",
  };

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
      {status}
    </span>
  );
}

function DonationHistoryCard({ d, photoUrl }) {
  const metaTop = `${d.quantidade ?? "-"} UN • ${d.estado_item ?? "-"}`;

  return (
    <div
      className={[
        "rounded-[28px] bg-white",
        "border border-slate-200/60",
        "shadow-[0_10px_30px_-20px_rgba(2,6,23,0.35)]",
        "px-6 py-5",
      ].join(" ")}
    >
      <div className="flex items-center gap-5">
        <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
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
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[17px] font-extrabold text-slate-900 truncate">
                {d.descricao}
              </h3>

              <p className="mt-0.5 text-[12px] font-bold tracking-wide text-slate-400 uppercase">
                {metaTop}
              </p>

              <p className="mt-2 text-sm text-slate-600">
                <span className="font-semibold">Coletada em:</span>{" "}
                <span className="font-extrabold text-slate-800">
                  {formatDateBR(d.updated_at)}
                </span>
              </p>
            </div>

            <div className="shrink-0">
              <StatusBadge status="COLETADA" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonationsHistoryPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [photoUrlMap, setPhotoUrlMap] = useState({});

  const load = async () => {
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await listMyDonations();

    setLoading(false);

    if (error) {
      setErrorMsg(error.message || "Erro ao carregar histórico.");
      return;
    }

    const collected = (data ?? []).filter((d) => d.status === "COLETADA");
    setDonations(collected);
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

  return (
    <div className="max-w-5xl mx-auto py-2 px-2">
      <PageHeader
        title="Histórico"
        subtitle="Visualize suas doações passados."
      />

      {errorMsg ? (
        <div className="mt-6 bg-red-50 text-red-700 border border-red-200 rounded-2xl px-4 py-3">
          {errorMsg}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-6 bg-white rounded-2xl border p-6">
          Carregando...
        </div>
      ) : donations.length === 0 ? (
        <div className="mt-6 bg-white rounded-2xl border p-6 text-center">
          <p className="font-bold text-slate-900">
            Nenhuma doação finalizada ainda.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {donations
            .slice()
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .map((d) => (
              <DonationHistoryCard
                key={d.id}
                d={d}
                photoUrl={d.foto_path ? photoUrlMap[d.foto_path] : null}
              />
            ))}
        </div>
      )}
    </div>
  );
}
