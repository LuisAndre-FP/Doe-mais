import { useEffect } from "react";

export default function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        onDragOver={(e) => e.preventDefault()} // ajuda o drop não “morrer”
        onDrop={(e) => e.preventDefault()} // evita o browser abrir a imagem
      />

      {/* wrapper */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        {/* modal */}
        <div
          className="w-full max-w-2xl bg-white shadow-2xl border border-slate-200 rounded-3xl overflow-hidden"
          onClick={(e) => e.stopPropagation()} // ✅ ESSENCIAL
          onMouseDown={(e) => e.stopPropagation()}
          onDragOver={(e) => e.preventDefault()} // ✅ mantém drag ativo
          onDrop={(e) => e.preventDefault()} // ✅ evita conflito com overlay
        >
          {/* topo só com X */}
          <div className="h-14 px-4 flex items-center justify-end border-b border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-xl hover:bg-slate-100 grid place-items-center"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          {/* conteúdo com scroll */}
          <div className="p-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
