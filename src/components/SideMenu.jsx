import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SideMenu({ open, onClose }) {
  const panelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const linkClass = ({ isActive }) =>
    `block w-full px-4 py-3 rounded-xl font-semibold transition ${
      isActive ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-emerald-100"
    }`;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose();
    navigate("/login", { replace: true });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay (clicar fora fecha) */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* painel */}
      <aside
        ref={panelRef}
        className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl p-4"
        onClick={(e) => e.stopPropagation()} // impede fechar ao clicar dentro
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-emerald-600">DOE+</h2>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl hover:bg-slate-100 grid place-items-center"
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-2">
          <NavLink to="/doacoes" className={linkClass} onClick={onClose}>
            Doações
          </NavLink>

          <NavLink to="/historico" className={linkClass} onClick={onClose}>
            Histórico
          </NavLink>

          <NavLink to="/perfil" className={linkClass} onClick={onClose}>
            Perfil
          </NavLink>
        </div>

        <div className="mt-6 pt-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:opacity-90 transition"
          >
            Sair
          </button>
        </div>
      </aside>
    </div>
  );
}
