import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Heart, PlusCircle, History, User, LogOut, Shield } from "lucide-react";
import { getMyRole } from "../features/admin/adminService";

function MenuItem({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200",
          "font-bold text-[15px]",
          isActive
            ? "bg-[#dceee7] text-[#0b7a57] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
            : "text-[#34584c] hover:text-[#0b7a57] hover:bg-[#eaf4ef]",
        ].join(" ")
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

export default function SideMenu() {
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
    const items = [
      { to: "/doacoes", label: "Fazer Doação", icon: PlusCircle },
      { to: "/minhas-doacoes", label: "Minhas Doações", icon: Heart },
    ];

    if (role === "ADMIN") {
      items.push({
        to: "/admin",
        label: "Gerenciamento",
        icon: Shield,
      });
    }

    items.push(
      { to: "/historico", label: "Histórico", icon: History },
      { to: "/perfil", label: "Meu Perfil", icon: User },
    );

    return items;
  }, [role]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={[
        "fixed left-0 top-0 z-40",
        "w-72 h-screen",
        "bg-[#f3f5f4]",
        "text-[#234338]",
        "border-r border-[#e3ebe7]",
        "shadow-[8px_0_24px_-18px_rgba(0,0,0,0.12)]",
      ].join(" ")}
    >
      <div className="h-16 px-6 flex items-center border-b border-[#e3ebe7]">
        <span className="text-lg font-extrabold tracking-tight text-[#0b7a57]">
          DOE+
        </span>
      </div>

      <div className="px-4 py-5 h-[calc(100vh-64px)] flex flex-col">
        <nav className="space-y-2">
          {links.map((item) => (
            <MenuItem key={item.to} {...item} />
          ))}
        </nav>

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[#34584c] hover:text-[#0b7a57] hover:bg-[#eaf4ef] transition-all duration-200 font-bold text-[15px]"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
