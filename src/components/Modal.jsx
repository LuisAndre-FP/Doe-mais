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
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
      />

      <div className="absolute inset-0 flex items-end sm:items-center justify-center sm:p-4">
        <div
          className="w-full sm:max-w-2xl bg-white shadow-2xl border border-slate-200 sm:rounded-3xl rounded-t-3xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
        >
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

          <div className="p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
