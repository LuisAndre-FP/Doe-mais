import { UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileIncompleteModal({ open, onClose }) {
  const navigate = useNavigate();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white border border-emerald-100 shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 grid place-items-center">
              <UserX className="h-7 w-7 text-emerald-700" />
            </div>

            <h2 className="mt-5 text-2xl font-extrabold text-slate-900">
              Perfil incompleto
            </h2>

            <div className="mt-4 h-px w-full bg-slate-100" />

            <p className="mt-4 text-slate-600 leading-relaxed">
              Para fazer doações, você precisa completar seu cadastro.
              <br />
              Acesse seu perfil e finalize as informações obrigatórias.
            </p>

            <button
              onClick={() => {
                onClose?.();
                navigate("/perfil");
              }}
              className="mt-7 w-full h-12 rounded-2xl bg-emerald-700 text-white font-extrabold hover:bg-emerald-800 transition"
            >
              Completar perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
