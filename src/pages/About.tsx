import { useState } from "react";
import Nav from "../components/Nav";
import BookAuditModal from "../components/BookAuditModal";
import Footer from "../components/Footer";
import { Reveal } from "../components/animations";
import Prism from "../components/ui/Prism";
import ShinyText from "../components/ui/ShinyText";
import CountUp from "../components/ui/CountUp";

export default function About() {
  const [bookOpen, setBookOpen] = useState(false);

  return (
    <div className="relative bg-black text-white font-sans min-h-screen">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.4}
          baseWidth={4.5}
          scale={3}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={1}
        />
      </div>
      <Nav />

      <div className="pt-40 pb-28 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-20">
          {/* Headline */}
          <Reveal>
            <ShinyText className="font-mono text-xs tracking-widest">
              ABOUT
            </ShinyText>
            <h1 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-medium text-white tracking-tight leading-[1.05]">
              Built in Fairfax.
              <br />
              Serving the DMV.
            </h1>
          </Reveal>

          {/* Body copy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <Reveal>
              <div className="flex flex-col gap-6 text-white/60 text-[15px] leading-relaxed">
                <p>
                  SolarInsight was founded by a team of engineers and energy
                  analysts who noticed the same problem across DMV neighborhoods:
                  homeowners were investing $20,000–$30,000 in solar systems and
                  then doing almost nothing to maintain them.
                </p>
                <p>
                  We built a company around the data first. Before we sold a
                  single service, we spent two years measuring soiling rates
                  across the region. That research became the NOVA Soiling Index
                  — and the foundation for every recommendation we make.
                </p>
                <p>
                  We are not a power-washing company that also does solar. We
                  are a solar maintenance firm, full stop. Every technician is
                  trained specifically on PV systems, thermal cameras, and safe
                  roof access procedures.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="flex flex-col gap-8">
                {[
                  {
                    label: "Founded",
                    value: <CountUp to={2026} duration={1.5} />,
                  },
                  {
                    label: "Sites monitored",
                    value: (
                      <>
                        <CountUp to={200} duration={1.8} />+
                      </>
                    ),
                  },
                  {
                    label: "Service area",
                    value: "Virginia · Maryland · DC",
                  },
                  { label: "Guarantee", value: "100% money-back" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="border-t border-white/10 pt-6 flex flex-col gap-1"
                  >
                    <p className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
                      {label}
                    </p>
                    <p className="text-white font-medium text-lg">{value}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Mission */}
          <Reveal delay={0.1}>
            <div className="border border-white/10 p-10 flex flex-col gap-4">
              <ShinyText className="font-mono text-xs tracking-widest">
                OUR MISSION
              </ShinyText>
              <blockquote className="text-[clamp(1.3rem,2.5vw,2rem)] font-medium text-white leading-[1.2]">
                "Every solar system across Virginia, Maryland, and DC should be
                performing at its peak — and every homeowner should know exactly
                how theirs is doing."
              </blockquote>
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal delay={0.1}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-white/10 pt-12">
              <div>
                <p className="text-white font-medium text-lg">
                  Ready to protect your investment?
                </p>
                <p className="text-white/40 text-sm mt-1">
                  Start with a free audit — no cost, no commitment.
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
      </div>

      <Footer onBookAudit={() => setBookOpen(true)} />
      <BookAuditModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </div>
  );
}
