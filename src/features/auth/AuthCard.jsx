export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-emerald-50">
      <div className="w-full max-w-md space-y-5">
        {/* CARD 1: topo (nome do sistema) */}
        <div className="rounded-3xl bg-white shadow-2xl border border-emerald-100 p-7 text-center">
          <h1 className="text-5xl font-extrabold text-emerald-600 tracking-tight">
            DOE+
          </h1>
          <p className="text-slate-500 mt-2">Gerenciamento de doações</p>
          <p className="text-xs text-slate-400 mt-4">Sua doação transforma vidas</p>
        </div>

        {/* CARD 2: conteúdo (login/cadastro/etc) */}
        <div className="rounded-3xl bg-white shadow-2xl border border-emerald-100 p-7">
          <h2 className="text-xl font-extrabold text-slate-900">{title}</h2>
          {subtitle ? (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          ) : null}

          <div className="mt-5">{children}</div>

          {footer ? <div className="mt-5">{footer}</div> : null}
        </div>

        <p className="text-center text-xs text-slate-400 pt-1">DOE+</p>
      </div>
    </div>
  );
}
