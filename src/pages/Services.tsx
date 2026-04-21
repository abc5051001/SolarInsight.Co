import { useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import BookAuditModal from "../components/BookAuditModal";
import Footer from "../components/Footer";
import { Reveal } from "../components/animations";

export default function Services() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [bookOpen, setBookOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  // Track buffering progress for the loading screen
  const handleProgress = () => {
    const v = videoRef.current;
    if (!v || !v.duration || v.buffered.length === 0) return;
    const pct = Math.round(
      (v.buffered.end(v.buffered.length - 1) / v.duration) * 100,
    );
    setShowLoading(true);
    setVideoProgress(pct);
  };

  // Custom fade-in/out loop logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;
    const FADE = 0.5;

    const tick = () => {
      if (video.duration) {
        const t = video.currentTime;
        const d = video.duration;
        if (t < FADE) {
          video.style.opacity = String(t / FADE);
        } else if (t > d - FADE) {
          video.style.opacity = String((d - t) / FADE);
        } else {
          video.style.opacity = "1";
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
      }, 100);
    };

    video.style.opacity = "0";
    video.play().catch(() => {});
    video.addEventListener("ended", handleEnded);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="bg-black text-white font-sans min-h-screen">
      {/* Loading screen — only shown when actual buffering is needed */}
      {showLoading && !videoLoaded && (
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

      {/* ── HERO ── */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Video background */}
        <video
          ref={videoRef}
          src="/loopingZoominGreens.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute w-full h-full object-cover"
          style={{ opacity: 0 }}
          onProgress={handleProgress}
          onCanPlay={() => {
            if (showLoading) {
              setVideoProgress(100);
              setTimeout(() => setVideoLoaded(true), 500);
            } else {
              setVideoLoaded(true);
            }
          }}
        />

        {/* Gradient overlays — pointer-events-none so nav stays clickable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/80 pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none z-[1]" />

        {/* Nav — fixed, no wrapper div needed */}
        <Nav />

        {/* Hero text — pointer-events-none on container, auto only on button */}
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
          style={{ paddingTop: "calc(8rem - 75px)" }}
        >
          <p className="animate-fade-rise font-mono text-xs text-[#4ADE80] tracking-widest mb-6">
            SERVICES
          </p>
          <h1 className="animate-fade-rise text-[clamp(2.8rem,7vw,6rem)] font-medium text-white max-w-4xl tracking-tight leading-[1.05]">
            Your Panels,
            <br />
            <span className="font-normal text-white/65">In Expert Hands.</span>
          </h1>
          <p className="animate-fade-rise-delay text-[clamp(1rem,1.5vw,1.2rem)] text-white/60 max-w-xl mt-8 leading-relaxed">
            Deionized cleaning, thermal inspection, and micro-crack detection —
            everything your solar investment needs, backed by the most complete
            local soiling data in Northern Virginia.
          </p>
          <button
            onClick={() => setBookOpen(true)}
            className="animate-fade-rise-delay-2 pointer-events-auto mt-12 bg-white text-black font-mono text-xs font-bold tracking-widest px-14 py-5 hover:bg-[#4ADE80] transition-colors duration-300"
          >
            BOOK A FREE AUDIT
          </button>
        </div>
      </div>

      {/* ── SERVICES GRID ── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-16">
          <Reveal>
            <span className="font-mono text-xs text-[#4ADE80] tracking-widest">
              WHAT WE DO
            </span>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-medium text-white tracking-tight leading-[1.05]">
              Everything your panels need.
              <br />
              Nothing they don't.
            </h2>
          </Reveal>

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
                <div className="border-t border-white/10 pt-6 flex flex-col gap-3">
                  <h3 className="text-white font-medium text-lg">{title}</h3>
                  <p className="text-white/55 text-[14px] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="border border-white/10 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="font-mono text-xs text-[#4ADE80] tracking-widest mb-2">
                  READY TO START?
                </p>
                <h3 className="text-xl font-medium text-white">
                  Book your free audit today.
                </h3>
                <p className="text-white/50 text-sm mt-1">
                  No cost, no commitment. We assess and advise.
                </p>
              </div>
              <button
                onClick={() => setBookOpen(true)}
                className="shrink-0 bg-white text-black font-mono text-xs font-bold tracking-widest px-8 py-4 hover:bg-[#4ADE80] transition-colors duration-300"
              >
                BOOK FREE AUDIT
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer onBookAudit={() => setBookOpen(true)} />
      <BookAuditModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </div>
  );
}
