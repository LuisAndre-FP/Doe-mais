import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  Heart,
  PlusCircle,
  History,
  User,
  LogOut,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { getMyRole } from "../features/admin/adminService";
import { useSession } from "../hooks/useSession";

function MenuItem({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useSession();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!session) {
      setRole("USER");
      return;
    }
    const run = async () => {
      const { data, error } = await getMyRole();
      if (!error && data) setRole(String(data).trim());
    };
    run();
  }, [session]);

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

  const sidebarContent = (
    <>
      <div className="h-16 px-6 flex items-center justify-between border-b border-[#e3ebe7]">
        <span className="text-lg font-extrabold tracking-tight text-[#0b7a57]">
          DOE+
        </span>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="md:hidden h-9 w-9 rounded-xl flex items-center justify-center text-[#34584c] hover:bg-[#eaf4ef] transition"
          aria-label="Fechar menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-4 py-5 h-[calc(100%-64px)] flex flex-col">
        <nav className="space-y-2">
          {links.map((item) => (
            <MenuItem
              key={item.to}
              {...item}
              onClick={() => setMobileOpen(false)}
            />
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
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className={[
          "fixed top-0 left-0 z-[60] md:hidden",
          "h-16 w-16 flex items-center justify-center",
          "text-white",
        ].join(" ")}
        aria-label="Abrir menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={[
          "fixed left-0 top-0 z-[80] md:z-40",
          "w-72 h-screen",
          "bg-[#f3f5f4]",
          "text-[#234338]",
          "border-r border-[#e3ebe7]",
          "shadow-[8px_0_24px_-18px_rgba(0,0,0,0.12)]",
          "transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
