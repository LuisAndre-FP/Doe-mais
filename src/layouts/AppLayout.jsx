import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f3f5f4]">
      <Header />
      <SideMenu />

      <div className="pt-16 md:pt-0 md:ml-72 min-h-screen">
        <main className="px-4 pt-4 pb-6 flex justify-center">
          <div className="w-full max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
