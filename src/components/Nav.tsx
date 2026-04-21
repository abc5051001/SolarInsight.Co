import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import BookAuditModal from "./BookAuditModal";

const NAV_LINKS = [
  ["SERVICES", "/services"],
  ["PRICING", "/pricing"],
  ["OUR DATA", "/data"],
  ["ABOUT", "/about"],
  ["FAQ", "/faq"],
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-1/2 -translate-x-1/2 z-20 w-[90%] flex items-center justify-between pointer-events-auto py-4 md:py-6 lg:py-8"
      >
        <Link
          to="/"
          className="flex items-center focus:outline-none px-4 py-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/5 hover:bg-white/15 transition-colors duration-300"
          aria-label="Back to home"
        >
          <span className="text-3xl font-medium leading-none text-white">
            SolarInsight
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-stretch bg-[#1A1A1A]/40 backdrop-blur-[80px]">
          <div className="flex items-center justify-between px-6 font-mono text-xs tracking-[-0.01em] w-[480px]">
            {NAV_LINKS.map(([label, href]) => (
              <Link
                key={label}
                to={href}
                className="text-white/64 hover:text-white transition-colors duration-300 py-1"
              >
                {label}
              </Link>
            ))}
          </div>
          <button
            onClick={() => setBookOpen(true)}
            className="bg-white text-black px-6 py-5 font-mono text-xs leading-4 font-bold tracking-[-0.01em] hover:bg-gray-200 transition-colors w-[148px]"
          >
            BOOK AUDIT
          </button>
        </nav>

        {/* Hamburger — mobile */}
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 pointer-events-auto transition-colors hover:bg-white/20"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="flex flex-col justify-center gap-1.5 w-4">
            <span
              className={`block w-full h-[1.5px] bg-white transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`}
            />
            <span
              className={`block h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "w-0 opacity-0" : "w-3/4"}`}
            />
            <span
              className={`block w-full h-[1.5px] bg-white transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`}
            />
          </span>
        </button>
      </motion.header>

      {/* Mobile menu */}
      <motion.div
        initial={{ opacity: 0, y: -8, pointerEvents: "none" }}
        animate={
          menuOpen
            ? { opacity: 1, y: 0, pointerEvents: "auto" }
            : { opacity: 0, y: -8, pointerEvents: "none" }
        }
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="lg:hidden fixed top-16 left-4 right-4 z-30 bg-white rounded-2xl shadow-2xl px-6 py-8 flex flex-col gap-5"
      >
        {NAV_LINKS.map(([label, href]) => (
          <Link
            key={label}
            to={href}
            className="font-mono text-sm text-black/70 hover:text-black tracking-widest transition-colors border-b border-black/8 pb-5 last:border-0 last:pb-0"
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
        <button
          className="mt-2 bg-black text-white py-4 font-mono text-xs font-bold tracking-widest hover:bg-gray-800 transition-colors rounded-lg"
          onClick={() => {
            setMenuOpen(false);
            setBookOpen(true);
          }}
        >
          BOOK AUDIT
        </button>
      </motion.div>

      <BookAuditModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </>
  );
}
