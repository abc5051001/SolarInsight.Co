import { useState } from "react";
import Nav from "../components/Nav";
import BookAuditModal from "../components/BookAuditModal";
import Footer from "../components/Footer";
import { Reveal } from "../components/animations";
import LightRays from "../components/ui/LightRays";
import ShinyText from "../components/ui/ShinyText";

const PLANS = [
  {
    plan: "Starter",
    price: "$225",
    sub: "Up to 20 panels",
    features: [
      "1× deionized wash",
      "Thermal inspection",
      "Money-back guarantee",
    ],
    highlight: false,
  },
  {
    plan: "Standard",
    price: "$500",
    sub: "21–30 panels",
    features: [
      "2× deionized wash",
      "Thermal + EL inspection",
      "Gutter clearance",
      "Production report",
      "Money-back guarantee",
    ],
    highlight: true,
  },
  {
    plan: "Premium",
    price: "$650",
    sub: "31+ panels",
    features: [
      "2× deionized wash",
      "Thermal + EL inspection",
      "Gutter clearance",
      "Annual soiling report",
      "Priority scheduling",
      "Money-back guarantee",
    ],
    highlight: false,
  },
];

export default function Pricing() {
  const [bookOpen, setBookOpen] = useState(false);

  return (
    <div className="relative bg-black text-white font-sans min-h-screen">
      <LightRays
        raysOrigin="top-center"
        raysColor="#ffffff"
        raysSpeed={1}
        lightSpread={0.5}
        rayLength={3}
        followMouse={false}
        mouseInfluence={0}
        noiseAmount={0}
        distortion={0}
        pulsating={false}
        fadeDistance={1}
        saturation={1}
      />
      <Nav />

      <div className="pt-40 pb-28 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-16">
          <Reveal>
            <ShinyText className="font-mono text-xs tracking-widest">
              PRICING
            </ShinyText>
            <h1 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-medium text-white tracking-tight leading-[1.05]">
              Flat annual plans.
              <br />
              No surprise invoices.
            </h1>
            <p className="mt-6 text-white/50 text-[15px] leading-relaxed max-w-xl">
              One annual fee covers everything — cleaning, inspection, gutters,
              and reporting. No hidden charges, no per-visit fees.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map(({ plan, price, sub, features, highlight }, i) => (
              <Reveal key={plan} delay={i * 0.1}>
                <div
                  className={`flex flex-col gap-6 p-8 rounded-2xl border h-full ${highlight ? "border-[#4ADE80]/40 bg-[#4ADE80]/5" : "border-white/10 bg-white/3"}`}
                >
                  {highlight && (
                    <ShinyText className="font-mono text-[10px] tracking-widest">
                      MOST POPULAR
                    </ShinyText>
                  )}
                  <div>
                    <p className="font-mono text-xs text-white/50 tracking-widest">
                      {plan.toUpperCase()}
                    </p>
                    <p className="text-4xl font-bold text-white mt-2">
                      {price}
                      <span className="text-base font-normal text-white/40">
                        /yr
                      </span>
                    </p>
                    <p className="text-[13px] text-white/50 mt-1">{sub}</p>
                  </div>
                  <ul className="flex flex-col gap-2 flex-1">
                    {features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-[13px] text-white/70"
                      >
                        <span className="text-[#4ADE80]">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setBookOpen(true)}
                    className={`mt-auto py-3 font-mono text-xs font-bold tracking-widest transition-colors rounded-lg ${highlight ? "bg-[#4ADE80] text-black hover:bg-[#22c55e]" : "bg-white/10 text-white hover:bg-white/20"}`}
                  >
                    GET STARTED
                  </button>
                </div>
              </Reveal>
            ))}
          </div>

          {/* FAQ teaser */}
          <Reveal delay={0.2}>
            <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="text-white font-medium">
                  Not sure which plan fits?
                </p>
                <p className="text-white/40 text-sm mt-1">
                  Book a free audit — we'll assess your system and recommend the
                  right tier.
                </p>
              </div>
              <button
                onClick={() => setBookOpen(true)}
                className="shrink-0 font-mono text-xs text-[#4ADE80] hover:text-white border border-[#4ADE80]/40 hover:border-white/40 px-6 py-3 transition-colors duration-300"
              >
                BOOK FREE AUDIT →
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
