import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header
      className={[
        "fixed top-0 left-0 z-50",
        "w-72 h-16",
        "bg-gradient-to-br from-[#0b7a57] to-[#075c42]",
        "border-r border-black/5",
        "shadow-[0_10px_24px_-18px_rgba(0,0,0,0.28)]",
      ].join(" ")}
    >
      <div className="h-full flex items-center justify-center">
        <Link to="/" className="inline-flex items-center">
          <img
            src="doemais.svg"
            alt="Doe+ logo"
            className="h-9 w-auto"
          />
        </Link>
      </div>
    </header>
  );
}