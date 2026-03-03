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

function DonationCard({ d, photoUrl }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
      <div className="flex items-start gap-4">
        {/* foto */}
        <div className="h-20 w-20 rounded-2xl bg-emerald-50 border border-emerald-100 overflow-hidden grid place-items-center shrink-0">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Foto do item"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-slate-400 text-center px-2">
              Sem foto
            </span>
          )}
        </div>

        {/* infos */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={d.status} />
            <span className="text-xs text-slate-400">
              {formatDateBR(d.created_at)}
            </span>
            <span className="text-xs text-slate-400">
              Quantidade: {d.quantidade}
            </span>
          </div>

          <h3 className="mt-2 text-lg font-extrabold text-slate-900 truncate">
            {d.descricao}
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            Estado: <b>{d.estado_item ?? "-"}</b>
          </p>

          {/* se estiver agendada, mostra coleta + obs */}
          {d.status === "AGENDADA" && d.coleta_data ? (
            <p className="mt-2 text-sm text-slate-600">
              <span className="font-semibold">Coleta:</span>{" "}
              <b>
                {formatDateBR(d.coleta_data)}
                {d.coleta_periodo ? ` • ${d.coleta_periodo}` : ""}
              </b>
            </p>
          ) : null}

          {d.status === "AGENDADA" && d.coleta_observacao ? (
            <p className="mt-1 text-sm text-slate-600">
              <span className="font-semibold">Observação:</span>{" "}
              {d.coleta_observacao}
            </p>
          ) : null}
        </div>
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

  // signed urls das fotos
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

  const filtered = useMemo(() => {
    const arr = donations ?? [];
    if (statusFilter === "ALL") return arr;

    // aqui o user pode filtrar por qualquer status
    return arr.filter((d) => d.status === statusFilter);
  }, [donations, statusFilter]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <PageHeader
        title="Minhas Doações"
        subtitle="Visualize, organize e acompanhe suas doações."
      />

      <div className="mt-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 rounded-2xl border px-4 bg-white font-semibold"
        >
          <option value="ALL">Todas</option>
          <option value="PENDENTE">Pendentes</option>
          <option value="AGENDADA">Agendadas</option>
          <option value="COLETADA">Coletadas</option>
        </select>
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
