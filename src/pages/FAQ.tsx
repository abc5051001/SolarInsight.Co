import { useState } from "react";
import Nav from "../components/Nav";
import BookAuditModal from "../components/BookAuditModal";
import Footer from "../components/Footer";
import LightRays from "../components/ui/LightRays";
import ShinyText from "../components/ui/ShinyText";

const QUESTIONS = [
  {
    q: "How often do panels need cleaning?",
    a: "Twice a year is optimal for Northern Virginia. Spring cleaning removes winter grime and pollen. Fall cleaning clears summer dust before lower-sun months when every watt matters most.",
  },
  {
    q: "Will cleaning actually improve my output?",
    a: "Yes — documented. We provide before-and-after production data with every service. On average our clients recover 15–21% of lost output after a cleaning in summer months.",
  },
  {
    q: "Does cleaning void my panel warranty?",
    a: "No. Deionized-water washing is the manufacturer-recommended cleaning method. Abrasive or chemical methods can void warranties — we never use them.",
  },
  {
    q: "What is a thermal inspection?",
    a: "An infrared camera scan performed from the roof. It identifies hot-spots — localized overheating caused by cell defects, shading, or soiling — that standard visual inspection misses entirely.",
  },
  {
    q: "How long does a service visit take?",
    a: "A typical residential system takes 2–4 hours depending on panel count, roof complexity, and gutter condition. We schedule a specific arrival window so you can plan your day.",
  },
  {
    q: "Is there a money-back guarantee?",
    a: "Yes. If you are not satisfied with any service visit we will return and re-clean at no charge, or refund that visit — whichever you prefer.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve Arlington, Alexandria, and Fairfax County in Northern Virginia. If you're on the border of our service area, contact us — we're expanding.",
  },
  {
    q: "Can I buy just one cleaning without an annual plan?",
    a: "Yes. One-time cleanings are available at $175–$275 depending on panel count. Annual plans offer significantly better value and include inspection and reporting.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-white/10">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center py-6 text-left gap-4"
      >
        <span className="text-white font-medium text-[15px]">{q}</span>
        <span
          className={`text-[#4ADE80] text-xl leading-none shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      {open && (
        <p className="pb-6 text-white/75 text-[14px] leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export default function FAQ() {
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

      <div className="relative z-10 pt-40 pb-28 px-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-16">
          <div>
            <ShinyText className="font-mono text-xs tracking-widest">
              FAQ
            </ShinyText>
            <h1 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-medium text-white tracking-tight leading-[1.05]">
              Common questions.
            </h1>
          </div>

          <div className="flex flex-col">
            {QUESTIONS.map(({ q, a }) => (
              <FAQItem key={q} q={q} a={a} />
            ))}
            <div className="border-t border-white/10" />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-white/10 pt-8">
            <div>
              <p className="text-white font-medium">Still have questions?</p>
              <p className="text-white/65 text-sm mt-1">
                Book a free audit — we'll walk through everything in person.
              </p>
            </div>
            <button
              onClick={() => setBookOpen(true)}
              className="shrink-0 bg-white text-black font-mono text-xs font-bold tracking-widest px-8 py-4 hover:bg-[#4ADE80] transition-colors duration-300"
            >
              BOOK FREE AUDIT
            </button>
          </div>
        </div>
      </div>

      <Footer onBookAudit={() => setBookOpen(true)} />
      <BookAuditModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </div>
  );
}
