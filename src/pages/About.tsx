import { useState } from "react";
import Nav from "../components/Nav";
import BookAuditModal from "../components/BookAuditModal";
import Footer from "../components/Footer";
import { Reveal } from "../components/animations";

export default function About() {
  const [bookOpen, setBookOpen] = useState(false);

  return (
    <div className="bg-black text-white font-sans min-h-screen">
      <Nav />

      <div className="pt-40 pb-28 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-20">

          {/* Headline */}
          <Reveal>
            <span className="font-mono text-xs text-[#4ADE80] tracking-widest">ABOUT</span>
            <h1 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-medium text-white tracking-tight leading-[1.05]">
              Built in Arlington.<br />For Arlington.
            </h1>
          </Reveal>

          {/* Body copy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <Reveal>
              <div className="flex flex-col gap-6 text-white/60 text-[15px] leading-relaxed">
                <p>
                  SolarInsight was founded by a team of engineers and energy analysts who noticed the same problem across Northern Virginia neighborhoods: homeowners were investing $20,000–$30,000 in solar systems and then doing almost nothing to maintain them.
                </p>
                <p>
                  We built a company around the data first. Before we sold a single service, we spent two years measuring soiling rates across the region. That research became the NOVA Soiling Index — and the foundation for every recommendation we make.
                </p>
                <p>
                  We are not a power-washing company that also does solar. We are a solar maintenance firm, full stop. Every technician is trained specifically on PV systems, thermal cameras, and safe roof access procedures.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="flex flex-col gap-8">
                {[
                  { label: "Founded", value: "2021" },
                  { label: "Sites monitored", value: "200+" },
                  { label: "Service area", value: "Arlington · Alexandria · Fairfax" },
                  { label: "Guarantee", value: "100% money-back" },
                ].map(({ label, value }) => (
                  <div key={label} className="border-t border-white/10 pt-6 flex flex-col gap-1">
                    <p className="font-mono text-[10px] text-white/40 tracking-widest uppercase">{label}</p>
                    <p className="text-white font-medium text-lg">{value}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Mission */}
          <Reveal delay={0.1}>
            <div className="border border-white/10 p-10 flex flex-col gap-4">
              <p className="font-mono text-xs text-[#4ADE80] tracking-widest">OUR MISSION</p>
              <blockquote className="text-[clamp(1.3rem,2.5vw,2rem)] font-medium text-white leading-[1.2]">
                "Every solar system in Northern Virginia should be performing at its peak — and every homeowner should know exactly how theirs is doing."
              </blockquote>
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal delay={0.1}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-white/10 pt-12">
              <div>
                <p className="text-white font-medium text-lg">Ready to protect your investment?</p>
                <p className="text-white/40 text-sm mt-1">Start with a free audit — no cost, no commitment.</p>
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
