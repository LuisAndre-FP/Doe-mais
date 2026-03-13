import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header
      className={[
        "fixed top-0 left-0 z-50",
        "w-full h-16",
        "bg-gradient-to-br from-[#0b7a57] to-[#075c42]",
        "border-b border-black/5",
        "shadow-[0_4px_16px_-8px_rgba(0,0,0,0.28)]",
        "flex items-center justify-center",
        "md:hidden",
      ].join(" ")}
    >
      <Link to="/" className="inline-flex items-center">
        <img src="doemais.svg" alt="Doe+ logo" className="h-9 w-auto" />
      </Link>
    </header>
  );
}
