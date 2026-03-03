import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Heart, PlusCircle, History, User, LogOut, Shield } from "lucide-react";
import { getMyRole } from "../features/admin/adminService";

function Item({ to, label, icon: Icon, disabled = false }) {
  const base =
    "group relative w-12 h-12 rounded-2xl grid place-items-center transition";
  const active =
    "bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]";
  const idle = "text-white/80 hover:bg-white/10";
  const iconCls = "h-5 w-5";

  if (disabled) {
    return (
      <div className={`${base} opacity-40 cursor-not-allowed`}>
        <Icon className={iconCls} />
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${base} ${isActive ? active : idle}`}
    >
      {({ isActive }) => (
        <>
          <Icon className={iconCls} />

          {/* Tooltip (KTO-style) */}
          <div
            className={[
              "pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3",
              "opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0",
              "transition duration-150",
            ].join(" ")}
          >
            <div className="px-3 py-2 rounded-xl bg-black/80 text-white text-xs font-semibold whitespace-nowrap shadow-lg border border-white/10">
              {label}
            </div>
          </div>
        </>
      )}
    </NavLink>
  );
}

export default function SideMenu({ open = true }) {
  const [role, setRole] = useState("USER");
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const { data, error } = await getMyRole();
      if (!error && data) setRole(data);
    };
    run();
  }, []);

  const links = useMemo(() => {
    const baseLinks = [
      { to: "/doacoes", label: "Fazer Doação", icon: PlusCircle },
      { to: "/minhas-doacoes", label: "Minhas Doações", icon: Heart },
    ];

    if (role === "ADMIN") {
      baseLinks.push({
        to: "/admin",
        label: "Gerenciamento",
        icon: Shield,
      });
    }

    baseLinks.push(
      { to: "/historico", label: "Histórico", icon: History },
      { to: "/perfil", label: "Meu Perfil", icon: User },
    );

    return baseLinks;
  }, [role]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={[
        "fixed left-0 z-40",
        "top-16 h-[calc(100vh-64px)] w-16",
        "transition-transform duration-200 ease-out",
        open ? "translate-x-0" : "-translate-x-full",
        // mesma “família” do header
        "bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950",
        "border-r border-white/10",
      ].join(" ")}
    >
      <nav className="pt-4 flex flex-col items-center gap-2">
        {links.map((l) => (
          <Item key={l.to} {...l} />
        ))}
      </nav>

      {/* Logout fixo embaixo */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <button
          type="button"
          onClick={handleLogout}
          className="group relative w-12 h-12 rounded-2xl grid place-items-center text-white/70 hover:text-white hover:bg-white/10 transition"
          aria-label="Sair"
        >
          <LogOut className="h-5 w-5" />

          <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition duration-150">
            <div className="px-3 py-2 rounded-xl bg-black/80 text-white text-xs font-semibold whitespace-nowrap shadow-lg border border-white/10">
              Sair
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
}
