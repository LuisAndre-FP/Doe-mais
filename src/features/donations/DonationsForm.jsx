import { useRef, useState } from "react";
import { createDonation } from "./donationsService";
import { Camera } from "lucide-react";

export default function DonationForm({ onSuccess, onCancel }) {
  const inputRef = useRef(null);

  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [estadoItem, setEstadoItem] = useState("NOVO");
  const [fotoFile, setFotoFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [isDragging, setIsDragging] = useState(false);

  const isImageFile = (file) => file && file.type?.startsWith("image/");
  const maxSizeBytes = 5 * 1024 * 1024; // ~5MB

  const pickFile = (file) => {
    if (!file) return;

    if (!isImageFile(file)) {
      setMsg("Erro: envie uma imagem (PNG/JPG).");
      return;
    }

    if (file.size > maxSizeBytes) {
      setMsg("Erro: imagem muito grande. Tente até ~5MB.");
      return;
    }

    setMsg("");
    setFotoFile(file);
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    pickFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer?.files?.[0];
    pickFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault(); // ✅ sem isso, o drop não acontece
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const onDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // garante que só desativa quando realmente saiu do dropzone
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    const isOutside =
      x < rect.left || x > rect.right || y < rect.top || y > rect.bottom;
    if (isOutside) setIsDragging(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!descricao.trim()) {
      setMsg("Informe uma descrição.");
      return;
    }

    setLoading(true);
    const { data, error } = await createDonation({
      descricao: descricao.trim(),
      quantidade: Number(quantidade),
      estado_item: estadoItem?.trim() || null,
      fotoFile,
    });
    setLoading(false);

    if (error) {
      setMsg("Erro: " + error.message);
      return;
    }

    onSuccess?.(data);

    setMsg("Doação criada ✅");
    setDescricao("");
    setQuantidade(1);
    setEstadoItem("NOVO");
    setFotoFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Headerzinho */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Nova Doação</h2>
        <p className="text-slate-500 mt-1">
          Preencha os dados do item que você deseja doar.
        </p>
      </div>

      {/* Upload */}
      <div className="rounded-[2rem] bg-white border border-slate-100 shadow-sm p-6">
        <label className="block text-xs font-extrabold tracking-widest text-slate-400 uppercase">
          Upload da Foto
        </label>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
          disabled={loading}
        />

        {/* dropzone */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={[
            "mt-3 h-36 rounded-[1.75rem] border-2 border-dashed bg-slate-50/60 transition flex flex-col items-center justify-center gap-2 text-center cursor-pointer select-none",
            isDragging
              ? "border-emerald-400 bg-emerald-50/60"
              : "border-slate-200 hover:bg-slate-50",
          ].join(" ")}
        >
          <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 grid place-items-center">
            <Camera className="h-5 w-5 text-emerald-600" />
          </div>

          <p className="text-sm font-semibold text-slate-600">
            {isDragging
              ? "Solte a imagem aqui"
              : "Clique ou arraste a foto aqui"}
          </p>

          <p className="text-xs text-slate-400">PNG/JPG • até ~5MB</p>

          {fotoFile ? (
            <p className="text-xs font-semibold text-emerald-700 mt-1">
              Selecionado: {fotoFile.name}
            </p>
          ) : null}
        </div>
      </div>

      {/* Campos */}
      <div className="space-y-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm p-6">
        <div className="space-y-2">
          <label className="text-xs font-extrabold tracking-widest text-slate-400 uppercase">
            O que você está doando?
          </label>
          <input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full h-12 rounded-2xl bg-slate-50 border border-transparent px-4 font-semibold text-slate-800 placeholder:text-slate-400
                       focus:outline-none focus:bg-white focus:border-emerald-200 focus:ring-2 focus:ring-emerald-100 transition"
            placeholder="Ex: Cadeira de Rodas, 10kg de Arroz..."
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-extrabold tracking-widest text-slate-400 uppercase">
              Quantidade
            </label>
            <input
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              className="w-full h-12 rounded-2xl bg-slate-50 border border-transparent px-4 font-semibold
                         focus:outline-none focus:bg-white focus:border-emerald-200 focus:ring-2 focus:ring-emerald-100 transition"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-extrabold tracking-widest text-slate-400 uppercase">
              Estado de conservação
            </label>
            <select
              value={estadoItem}
              onChange={(e) => setEstadoItem(e.target.value)}
              className="w-full h-12 rounded-2xl bg-slate-50 border border-transparent px-4 font-semibold
                         focus:outline-none focus:bg-white focus:border-emerald-200 focus:ring-2 focus:ring-emerald-100 transition"
              disabled={loading}
            >
              <option value="NOVO">Novo</option>
              <option value="SEMINOVO">Seminovo</option>
              <option value="USADO">Usado</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-800">
          O endereço cadastrado no seu perfil será usado para a coleta.
        </div>

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

        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 flex-1 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition disabled:opacity-60"
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="h-12 flex-[2] rounded-2xl bg-emerald-600 text-white font-extrabold hover:bg-emerald-700 transition disabled:opacity-60 shadow-lg shadow-emerald-100"
          >
            {loading ? "Enviando..." : "Enviar Doação"}
          </button>
        </div>
      </div>
    </form>
  );
}
