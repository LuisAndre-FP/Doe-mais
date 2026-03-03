import { Menu, X } from "lucide-react";

export default function Header({ sidebarOpen, onToggleSidebar }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Barra principal */}
      <div className="relative h-16">
        {/* fundo igual ao sidemenu */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-700 via-emerald-800 to-emerald-950" />

        {/* brilho suave (pra parecer “premium”) */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20" />

        {/* conteúdo */}
        <div className="relative h-full flex items-center justify-center">
          {/* Botão menu (canto esquerdo, dentro do header) */}
                <button
                type="button"
                onClick={onToggleSidebar}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-2xl grid place-items-center text-white/90 hover:text-white hover:bg-white/10 transition"
                aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
                >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>

                <div>
                <img src="doemais.svg" alt="Doe+ logo - donation platform application header" className="h-9 w-auto" />
                </div>
              </div>
              </div>

              {/* "linha neon" sutil */}
      <div className="relative h-[2px] bg-white/70">
        <div className="absolute inset-0 blur-[10px] bg-white/40" />
      </div>
    </header>
  );
}