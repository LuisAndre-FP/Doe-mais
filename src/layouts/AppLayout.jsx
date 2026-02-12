import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-emerald-50 w-full">
      <Header onOpenMenu={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="w-full p-6">
        <Outlet />
      </main>
    </div>
  );
}
