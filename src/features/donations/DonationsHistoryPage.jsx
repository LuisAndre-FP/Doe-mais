import { useEffect, useState } from "react";
import { listMyDonations, getDonationPhotoSignedUrl } from "./donationsService";
import PageHeader from "../../components/PageHeader";

function formatDateBR(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR");
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
      const missing = donations
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

    if (donations.length > 0) run();
  }, [donations, photoUrlMap]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <PageHeader
        title="Histórico"
        subtitle="Consulte todas as suas doações finalizadas e acompanhe seus registros passados."
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
          {donations.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-2xl border shadow-sm p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {d.descricao}
                  </h3>

                  <div className="mt-2 text-sm text-slate-600 flex flex-wrap gap-x-6 gap-y-1">
                    <span>
                      <span className="font-semibold">Quantidade:</span> {d.quantidade}
                    </span>

                    {d.estado_item && (
                      <span>
                        <span className="font-semibold">Estado:</span>{" "}
                        {d.estado_item}
                      </span>
                    )}

                    <span>
                      <span className="font-semibold">Coletada em:</span>{" "}
                      {formatDateBR(d.updated_at)}
                    </span>
                  </div>
                </div>

                <div className="h-20 w-20 rounded-2xl bg-emerald-50 border overflow-hidden grid place-items-center">
                  {d.foto_path && photoUrlMap[d.foto_path] ? (
                    <img
                      src={photoUrlMap[d.foto_path]}
                      alt="Foto"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-slate-400 text-center">
                      Sem foto
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
