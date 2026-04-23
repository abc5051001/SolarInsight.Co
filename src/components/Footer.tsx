import { Link } from "react-router-dom";

interface Props {
  readonly onBookAudit: () => void;
  readonly transparent?: boolean;
}

export default function Footer({ onBookAudit, transparent }: Props) {
  return (
    <footer className={`border-t border-white/8 py-12 px-6 ${transparent ? "bg-transparent" : "bg-black"}`}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="relative z-10 text-3xl font-extrabold leading-none text-white hover:opacity-70 transition-opacity duration-300"
        >
          SolarInsight
        </Link>
        <p className="font-mono text-[11px] text-white/30 tracking-widest">
          © 2025 SOLARINSIGHT LLC · ARLINGTON, VA
        </p>
        <button
          onClick={onBookAudit}
          className="font-mono text-xs text-[#4ADE80] hover:text-white tracking-widest transition-colors"
        >
          BOOK A FREE AUDIT →
        </button>
      </div>
    </footer>
  );
}
