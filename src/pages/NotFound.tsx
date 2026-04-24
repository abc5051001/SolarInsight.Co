import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import BookAuditModal from "../components/BookAuditModal";

export default function NotFound() {
  const navigate = useNavigate();
  const [bookOpen, setBookOpen] = useState(false);

  return (
    <div className="bg-black min-h-screen flex flex-col text-white font-sans">
      <Nav />

      <div
        className="flex-1 flex flex-col items-center justify-center text-center px-8"
        style={{ animation: "fadein 0.6s ease forwards", opacity: 0 }}
      >
        <style>{`@keyframes fadein { to { opacity: 1; } }`}</style>

        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(2.5rem, 8vw, 4rem)",
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}>
          404
        </p>

        <h1 style={{
          marginTop: "1rem",
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "-0.02em",
        }}>
          Page not found
        </h1>

        <p style={{
          marginTop: "0.5rem",
          fontSize: "0.875rem",
          color: "rgba(255,255,255,0.5)",
          maxWidth: "320px",
          lineHeight: 1.6,
        }}>
          Sorry, we couldn't find the page you're looking for.
        </p>

        <div style={{ marginTop: "1.25rem", display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => navigate(-1)}
            style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fff", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#4ADE80")}
            onMouseLeave={e => (e.currentTarget.style.color = "#fff")}
          >
            ← Go back
          </button>
          <Link
            to="/"
            style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fff", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#4ADE80")}
            onMouseLeave={e => (e.currentTarget.style.color = "#fff")}
          >
            Go to the home page
          </Link>
        </div>
      </div>

      <Footer onBookAudit={() => setBookOpen(true)} />
      <BookAuditModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </div>
  );
}
