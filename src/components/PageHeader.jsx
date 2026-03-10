export default function PageHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h1 className="text-[2rem] leading-none font-extrabold text-slate-900">
          {title}
        </h1>

        {subtitle ? (
          <p className="text-slate-500 mt-1.5 leading-snug">{subtitle}</p>
        ) : null}
      </div>

      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}
