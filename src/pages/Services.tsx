import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import BookAuditModal from "../components/BookAuditModal";
import Footer from "../components/Footer";
import { Reveal } from "../components/animations";
import ShinyText from "../components/ui/ShinyText";

export default function Services() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [bookOpen, setBookOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const handleProgress = () => {
    const v = videoRef.current;
    if (!v || !v.duration || v.buffered.length === 0) return;
    const pct = Math.round(
      (v.buffered.end(v.buffered.length - 1) / v.duration) * 100,
    );
    setVideoProgress(pct);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;
    let fadedIn = false;
    const FADE_IN = 0.6;

    // Only fade in once on initial load — loop attribute handles seamless looping
    const tick = () => {
      if (!fadedIn) {
        const t = video.currentTime;
        if (t >= FADE_IN) {
          fadedIn = true;
          video.style.opacity = "1";
        } else {
          video.style.opacity = String(t / FADE_IN);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    video.style.opacity = "0";
    video.play().catch(() => {});
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="relative text-white font-sans min-h-screen">
      {/* ── FIXED VIDEO BACKGROUND ── */}
      <video
        ref={videoRef}
        src="/loopingZoominGreens.mp4"
        muted
        playsInline
        loop
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover -z-10"
        style={{ opacity: 0 }}
        onProgress={handleProgress}
        onCanPlay={() => {
          setVideoProgress(100);
          setVideoLoaded(true);
        }}
      />
      {/* Subtle dark overlay for readability across full page */}
      <div className="fixed inset-0 -z-10 bg-black/45 pointer-events-none" />

      {/* Loading screen */}
      {!videoLoaded && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white font-sans z-50">
          <div className="text-[10px] font-mono tracking-widest mb-4 text-white/50">
            LOADING SEQUENCE
          </div>
          <div className="text-4xl font-mono">{videoProgress}%</div>
          <div className="w-64 h-[1px] bg-white/10 mt-8 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${videoProgress}%` }}
            />
          </div>
        </div>
      )}

      <Nav />

      {/* ── HERO ── */}
      <div className="relative h-screen flex flex-col items-center justify-center text-center px-6">
        <Reveal>
          <p className="font-mono text-xs text-[#4ADE80] tracking-widest mb-6">
            SERVICES
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="text-[clamp(2.8rem,7vw,6rem)] font-medium text-white max-w-4xl tracking-tight leading-[1.05]">
            Your Panels,
            <br />
            <span className="font-normal text-white/65">In Expert Hands.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-[clamp(1rem,1.5vw,1.2rem)] text-white/60 max-w-xl mt-8 leading-relaxed">
            Deionized cleaning, thermal inspection, and micro-crack detection —
            everything your solar investment needs, backed by the most complete
            local soiling data in Northern Virginia.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-12 flex flex-col items-center gap-4">
            <button
              onClick={() => setBookOpen(true)}
              className="bg-white text-black font-mono text-xs font-bold tracking-widest px-14 py-5 hover:bg-[#4ADE80] transition-colors duration-300"
            >
              BOOK A FREE AUDIT
            </button>
            <Link
              to="/estimate"
              className="font-mono text-xs tracking-widest font-bold text-white/85 hover:text-white transition-colors duration-300"
            >
              GET A FREE ESTIMATE →
            </Link>
          </div>
        </Reveal>
      </div>

      {/* ── SERVICES GRID ── */}
      <section className="relative py-28 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-16">
          <div>
            <Reveal>
              <ShinyText className="font-mono text-xs tracking-widest">
                WHAT WE DO
              </ShinyText>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-medium text-white tracking-tight leading-[1.05]">
                Everything your panels need.
                <br />
                Nothing they don't.
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Panel Cleaning",
                desc: "Deionized-water wash twice a year removes pollen, bird droppings, and dust — the #1 cause of energy loss in Northern Virginia.",
              },
              {
                title: "Thermal Inspection",
                desc: "Infrared camera scan detects hot-spots, faulty bypass diodes, and cell-level failures invisible to the naked eye.",
              },
              {
                title: "Micro-crack Detection",
                desc: "EL imaging catches micro-cracks before they propagate, preserving cell output and protecting your manufacturer warranty.",
              },
              {
                title: "Gutter Clearance",
                desc: "Clogged gutters accelerate roof soiling. Every visit includes a full gutter clear to keep debris off your array.",
              },
              {
                title: "Production Reporting",
                desc: "Before-and-after kWh data delivered after every service so you see exactly what you recovered.",
              },
              {
                title: "Annual Soiling Report",
                desc: "You receive a copy of our Northern Virginia soiling index — the most detailed local dataset available to homeowners.",
              },
            ].map(({ title, desc }, i) => (
              <Reveal key={title} delay={i * 0.05}>
                <div className="border-t border-white/20 pt-6 flex flex-col gap-3">
                  <h3 className="text-white font-medium text-lg">{title}</h3>
                  <p className="text-white/70 text-[14px] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="border border-white/20 bg-black/30 backdrop-blur-sm p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <Reveal>
                  <ShinyText className="font-mono text-xs tracking-widest mb-2 block">
                    READY TO START?
                  </ShinyText>
                </Reveal>
                <Reveal delay={0.1}>
                  <h3 className="text-xl font-medium text-white">
                    Book your free audit today.
                  </h3>
                  <p className="text-white/50 text-sm mt-1">
                    No cost, no commitment. We assess and advise.
                  </p>
                </Reveal>
              </div>
              <div className="grid gap-4">
                <Reveal delay={0.2}>
                  <button
                    onClick={() => setBookOpen(true)}
                    className="shrink-0 bg-white text-black font-mono text-xs font-bold tracking-widest px-8 py-4 hover:bg-[#4ADE80] transition-colors duration-300"
                  >
                    BOOK FREE AUDIT
                  </button>
                </Reveal>
                <Reveal delay={0.2}>
                  <Link
                    to="/estimate"
                    className="shrink-0 items-center text-center text-white font-mono text-xs font-bold tracking-widest px-4 py-4 hover:bg-black/40 transition-colors duration-300"
                  >
                    GET FREE ESTIMATE →
                  </Link>
                </Reveal>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer onBookAudit={() => setBookOpen(true)} transparent />
      <BookAuditModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </div>
  );
}
