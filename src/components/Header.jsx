export default function Header({ onOpenMenu }) {
  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMenu}
            className="h-10 w-10 rounded-xl hover:bg-slate-100 grid place-items-center"
            aria-label="Abrir menu"
          >
            ☰
          </button>

          <h1 className="text-2xl font-extrabold text-emerald-600 tracking-tight">
            DOE+
          </h1>
        </div>

        {/* opcional: pode ter algo do lado direito */}
      </div>
    </header>
  );
}
