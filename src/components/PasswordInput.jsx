import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Senha",
  autoComplete = "current-password",
  disabled = false,
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        disabled={disabled}
        className="
          w-full h-12 px-4 pr-12
          rounded-2xl
          border border-emerald-100
          bg-emerald-50/40
          text-slate-800
          placeholder:text-slate-400
          focus:outline-none
          focus:ring-2 focus:ring-emerald-500
          focus:border-emerald-500
          transition
        "
      />

      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        disabled={disabled}
        aria-label={show ? "Ocultar senha" : "Mostrar senha"}
        className="
          absolute right-2 top-1/2 -translate-y-1/2
          h-9 w-9
          rounded-xl
          grid place-items-center
          text-emerald-600
          hover:bg-emerald-100
          transition
        "
      >
        {show ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
      </button>
    </div>
  );
}
