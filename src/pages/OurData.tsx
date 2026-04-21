import { useState } from "react";
import Nav from "../components/Nav";
import BookAuditModal from "../components/BookAuditModal";
import Footer from "../components/Footer";
import { Reveal } from "../components/animations";

const TIERS = [
  {
    name: "Homeowner Report",
    price: "$49",
    period: "/yr",
    desc: "Annual PDF export of our soiling index for your zip code. Understand exactly how much soiling is costing you each season.",
    features: ["Annual soiling index PDF", "Your zip-code segment", "Seasonal breakdown", "Recommended cleaning windows"],
    cta: "PURCHASE REPORT",
    highlight: false,
  },
  {
    name: "Installer License",
    price: "$299",
    period: "/yr",
    desc: "Full CSV dataset covering all 200+ monitored sites across Arlington, Alexandria, and Fairfax County. Updated after every service visit.",
    features: ["Full CSV dataset download", "All 200+ monitored sites", "Continuous update access", "County-level segmentation", "Commercial use license"],
    cta: "GET DATASET",
    highlight: true,
  },
  {
    name: "Enterprise API",
    price: "Custom",
    period: "",
    desc: "Real-time API access for integrations, monitoring dashboards, and large-scale analysis. Contact us for scoped pricing.",
    features: ["REST API access", "Real-time data feed", "Custom geographic scope", "SLA & dedicated support", "White-label option"],
    cta: "CONTACT US",
    highlight: false,
  },
];

export default function OurData() {
  const [bookOpen, setBookOpen] = useState(false);

  return (
    <div className="bg-black text-white font-sans min-h-screen">
      <Nav />

      {/* Hero */}
      <div className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <span className="font-mono text-xs text-[#4ADE80] tracking-widest">OUR DATA</span>
            <h1 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-medium text-white tracking-tight leading-[1.05]">
              The NOVA Soiling Index.
            </h1>
            <p className="mt-6 text-white/55 text-[15px] leading-relaxed max-w-2xl">
              Four years of continuous measurement across 200+ residential sites in Northern Virginia. Every service visit adds a data point. The result is the most granular solar soiling dataset available for this region — and now it's available for purchase.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Stats */}
      <section className="py-16 px-6 border-t border-white/8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { num: "200+", label: "Monitored sites" },
            { num: "21%",  label: "Avg. summer energy loss from soiling" },
            { num: "4 yrs", label: "Continuous local data collection" },
            { num: "2×",   label: "Update frequency per year" },
          ].map(({ num, label }, i) => (
            <Reveal key={num} delay={i * 0.08}>
              <div className="flex flex-col gap-2">
                <span className="text-[clamp(2rem,4vw,2.8rem)] font-bold text-white leading-none">{num}</span>
                <span className="text-[11px] font-mono text-white/45 uppercase tracking-widest leading-relaxed">{label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What's in the data */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <Reveal>
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-medium text-white tracking-tight">What the dataset includes.</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Soiling Rate",
                desc: "Per-site soiling accumulation rates measured across seasons — pollen, dust, bird droppings, and atmospheric particulates tracked separately.",
              },
              {
                title: "Energy Loss Estimates",
                desc: "Correlated kWh loss figures per site, per season. Validated against actual production data from monitoring systems.",
              },
              {
                title: "Geographic Segmentation",
                desc: "Data segmented by zip code, proximity to roads, tree canopy density, and prevailing wind patterns across NOVA.",
              },
            ].map(({ title, desc }, i) => (
              <Reveal key={title} delay={i * 0.1}>
                <div className="border-t border-white/10 pt-6 flex flex-col gap-3">
                  <h3 className="text-white font-medium">{title}</h3>
                  <p className="text-white/55 text-[14px] leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Purchase tiers */}
      <section className="py-20 px-6 border-t border-white/8">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <Reveal>
            <span className="font-mono text-xs text-[#4ADE80] tracking-widest">ACCESS TIERS</span>
            <h2 className="mt-4 text-[clamp(1.8rem,3.5vw,3rem)] font-medium text-white tracking-tight leading-[1.05]">
              Choose your level of access.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map(({ name, price, period, desc, features, cta, highlight }, i) => (
              <Reveal key={name} delay={i * 0.1}>
                <div className={`flex flex-col gap-6 p-8 rounded-2xl border h-full ${highlight ? "border-[#4ADE80]/40 bg-[#4ADE80]/5" : "border-white/10 bg-white/3"}`}>
                  <div>
                    <p className="font-mono text-xs text-white/50 tracking-widest">{name.toUpperCase()}</p>
                    <p className="text-4xl font-bold text-white mt-2">
                      {price}<span className="text-base font-normal text-white/40">{period}</span>
                    </p>
                    <p className="text-[13px] text-white/55 mt-3 leading-relaxed">{desc}</p>
                  </div>
                  <ul className="flex flex-col gap-2 flex-1">
                    {features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-[13px] text-white/70">
                        <span className="text-[#4ADE80]">✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setBookOpen(true)}
                    className={`mt-auto py-3 font-mono text-xs font-bold tracking-widest transition-colors rounded-lg ${highlight ? "bg-[#4ADE80] text-black hover:bg-[#22c55e]" : "bg-white/10 text-white hover:bg-white/20"}`}
                  >
                    {cta}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="text-white/30 text-[13px] text-center">
              All purchases include a data usage agreement. Enterprise API pricing depends on query volume and geographic scope.
            </p>
          </Reveal>
        </div>
      </section>

      <Footer onBookAudit={() => setBookOpen(true)} />
      <BookAuditModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </div>
  );
}
