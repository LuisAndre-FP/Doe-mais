import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // opcional: fecha no mobile, abre no desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 900) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-white">
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />

      <SideMenu open={sidebarOpen} />

      {/* Conteúdo: dá espaço pro sidemenu quando ele estiver visível */}
      <div className={["pt-16 transition-all duration-200", sidebarOpen ? "pl-16" : "pl-0"].join(" ")}>
        <main className="px-6 py-8 min-h-[calc(100vh-64px)] flex justify-center">
          <div className="w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}