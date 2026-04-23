import { useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import BookAuditModal from "../components/BookAuditModal";
import LightRays from "../components/ui/LightRays";
import ShinyText from "../components/ui/ShinyText";
import { Reveal } from "../components/animations";

const API_URL = "https://solarinsightco-production.up.railway.app";

interface SolarPotential {
  system_kw: number;
  annual_kwh: number;
  electricity_rate: number;
  rate_source: string;
  soiling_rate: number;
  soiling_kwh_lost: number;
  soiling_dollar_lost: number;
  yearly_soiling: number[];
  recommended_cleanings: number;
  cleaning_cost: number;
  cleaning_roi: number;
  lifetime_soiling_usd: number;
  panels_note: string | null;
}

interface EstimateResult {
  address: string;
  solar_potential: SolarPotential;
}

export default function Estimate() {
  const [bookOpen, setBookOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [panelCount, setPanelCount] = useState("");
  const [electricityRate, setElectricityRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cleanings, setCleanings] = useState<1 | 2>(1);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body: Record<string, unknown> = {
        address,
        panel_count: Number.parseInt(panelCount),
      };
      if (electricityRate) {
        body.electricity_rate = Number.parseFloat(electricityRate);
      }

      const res = await fetch(`${API_URL}/check_address`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to fetch estimate.");
      const data = await res.json();
      setResult(data);
      setCleanings(data.solar_potential.recommended_cleanings);
    } catch {
      setError("Something went wrong. Make sure your address is in the Northern Virginia / DC / Maryland area.");
    } finally {
      setLoading(false);
    }
  };

  const sp = result?.solar_potential;
  const cleaningCost = cleanings * 225;
  const roi = sp ? Math.round((sp.soiling_dollar_lost - cleaningCost) * 100) / 100 : 0;
  const roiPositive = roi >= 0;
  const soilingPct = sp ? Math.round((sp.soiling_rate ?? 0.2) * 100) : 0;

  return (
    <div className="relative bg-black text-white font-sans min-h-screen">
      <LightRays raysOrigin="top-center" raysColor="#ffffff" raysSpeed={1} lightSpread={0.5} rayLength={3} followMouse={false} mouseInfluence={0} noiseAmount={0} distortion={0} pulsating={false} fadeDistance={1} saturation={1} />
      <Nav />

      <div className="relative z-10 pt-40 pb-28 px-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-16">

          {/* Header */}
          <div>
            <Reveal>
              <ShinyText className="font-mono text-xs tracking-widest">
                SOLAR ESTIMATE
              </ShinyText>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-medium text-white tracking-tight leading-[1.05]">
                See what soiling
                <br />
                <span className="text-white/50">costs you.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 text-white/50 text-sm leading-relaxed max-w-lg">
                Enter your address and panel count. We'll pull your system's actual solar data and show you exactly what soiling is stealing.
              </p>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[11px] text-white/40 tracking-widest">
                  ADDRESS
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="929 N Daniel St, Arlington VA"
                  required
                  className="bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-4 font-mono text-sm focus:outline-none focus:border-[#4ADE80] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[11px] text-white/40 tracking-widest">
                  NUMBER OF PANELS
                </label>
                <input
                  type="number"
                  value={panelCount}
                  onChange={(e) => setPanelCount(e.target.value)}
                  placeholder="20"
                  min="1"
                  required
                  className="bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-4 font-mono text-sm focus:outline-none focus:border-[#4ADE80] transition-colors"
                />
              </div>

              <div className="border border-white/8 p-5 flex flex-col gap-3">
                <p className="font-mono text-[11px] text-white/40 tracking-widest">
                  OPTIONAL — ELECTRICITY RATE
                </p>
                <div className="relative">
                  <input
                    type="number"
                    value={electricityRate}
                    onChange={(e) => setElectricityRate(e.target.value)}
                    placeholder="0.14"
                    min="0.01"
                    step="0.001"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-4 font-mono text-sm focus:outline-none focus:border-[#4ADE80] transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[11px] text-white/30">$/kWh</span>
                </div>
                <p className="font-mono text-[10px] text-white/25 tracking-wide">
                  Found on your Dominion Energy bill under "Energy Charge". Defaults to regional average if left blank.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-white text-black font-mono text-xs font-bold tracking-widest px-8 py-5 hover:bg-[#4ADE80] transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "CALCULATING..." : "GET ESTIMATE →"}
              </button>
            </form>
          </Reveal>

          {error && (
            <div className="border border-red-500/30 bg-red-500/10 px-6 py-4 font-mono text-xs text-red-400">
              {error}
            </div>
          )}

          {/* Result card */}
          {sp && (
            <Reveal>
              <div className="border border-white/15 flex flex-col overflow-hidden">

                {/* Hero — lifetime loss */}
                <div className="px-8 py-10 bg-white/3 flex flex-col gap-2 border-b border-white/10">
                  <p className="font-mono text-[10px] tracking-widest text-white/40">
                    ESTIMATED SOILING LOSS OVER 20 YEARS
                  </p>
                  <p className="text-[clamp(3rem,8vw,5rem)] font-medium text-[#4ADE80] leading-none">
                    ${sp.lifetime_soiling_usd.toLocaleString()}
                  </p>
                  <p className="text-white/40 text-sm mt-1">
                    That's <span className="text-white">${sp.soiling_dollar_lost}/yr</span> in lost electricity production from your {sp.system_kw} kW system — money your panels are generating but soiling is stealing.
                  </p>
                  <p className="font-mono text-[10px] text-white/25 tracking-widest mt-2">
                    {sp.rate_source === "user_rate" ? "YOUR RATE" : "REGIONAL AVERAGE RATE"} · {result?.address}
                  </p>
                </div>

                {/* Panel count note */}
                {sp.panels_note && (
                  <div className="px-8 py-3 bg-white/5 border-b border-white/10 flex items-center gap-2">
                    <span className="text-white/40 text-[11px]">ⓘ</span>
                    <p className="font-mono text-[10px] text-white/40 tracking-wide">{sp.panels_note}</p>
                  </div>
                )}

                {/* Stats row */}
                <div className="grid grid-cols-3 divide-x divide-white/10 border-b border-white/10">
                  <MiniStat label="ANNUAL PRODUCTION" value={`${sp.annual_kwh.toLocaleString()} kWh`} />
                  <MiniStat label="LOST TO SOILING" value={`${sp.soiling_kwh_lost.toLocaleString()} kWh`} accent />
                  <MiniStat label="SOILING RATE" value={`${soilingPct}% / yr`} />
                </div>

                {/* Soiling cost trend chart */}
                <div className="px-8 py-6 border-b border-white/10 flex flex-col gap-4">
                  <div className="flex items-end justify-between">
                    <p className="font-mono text-[10px] tracking-widest text-white/40">
                      SOILING COST TREND — 20 YEARS
                    </p>
                    <p className="font-mono text-[10px] text-white/25">
                      5.6% annual rate (NoVA avg 2020–2024)
                    </p>
                  </div>
                  <div className="flex items-end gap-0.75 h-20">
                    {sp.yearly_soiling.map((val, i) => {
                      const max = Math.max(...sp.yearly_soiling);
                      const barPx = Math.round((val / max) * 80);
                      const isMilestone = i === 0 || i === 4 || i === 9 || i === 19;
                      return (
                        <div key={val.toFixed(2)} className="relative flex-1 group">
                          <div
                            className="w-full bg-[#4ADE80]/30 group-hover:bg-[#4ADE80] transition-colors duration-150"
                            style={{ height: `${barPx}px` }}
                          />
                          {isMilestone && (
                            <span className="absolute -bottom-5 font-mono text-[8px] text-white/30 whitespace-nowrap">
                              Yr {i + 1}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-4">
                    {[0, 4, 9, 19].map((i) => (
                      <div key={i} className="flex flex-col gap-0.5">
                        <p className="font-mono text-[8px] text-white/25">YR {i + 1}</p>
                        <p className="font-mono text-[11px] text-white/70">${sp.yearly_soiling[i]}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cleaning toggle */}
                <div className="px-8 py-6 border-b border-white/10 flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] tracking-widest text-white/40">
                      CLEANING FREQUENCY
                    </p>
                    <div className="flex gap-2">
                      {([1, 2] as const).map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setCleanings(n)}
                          className={`font-mono text-[11px] tracking-widest px-5 py-2 border transition-colors ${cleanings === n ? "border-[#4ADE80] text-[#4ADE80] bg-[#4ADE80]/8" : "border-white/20 text-white/40 hover:border-white/40"}`}
                        >
                          {n}× / YEAR
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="font-mono text-[10px] tracking-widest text-white/40">CLEANING COST</p>
                      <p className="text-2xl font-medium text-white">${cleaningCost}/yr</p>
                    </div>
                    <div className="text-white/20 text-2xl font-light">vs</div>
                    <div className="flex flex-col gap-1 text-right">
                      <p className="font-mono text-[10px] tracking-widest text-white/40">PRODUCTION RECOVERED</p>
                      <p className="text-2xl font-medium text-[#4ADE80]">${sp.soiling_dollar_lost}/yr</p>
                    </div>
                  </div>
                </div>

                {/* ROI footer */}
                <div className={`px-8 py-7 flex items-center justify-between gap-6 ${roiPositive ? "bg-[#4ADE80]/8" : "bg-white/3"}`}>
                  <div className="flex flex-col gap-1">
                    <p className="font-mono text-[10px] tracking-widest text-white/40">NET ROI / YEAR</p>
                    <p className={`text-4xl font-medium ${roiPositive ? "text-[#4ADE80]" : "text-white/60"}`}>
                      {roiPositive ? "+" : "-"}${Math.abs(roi)}
                    </p>
                    <p className="text-white/35 text-xs mt-1">
                      {roiPositive
                        ? "Cleaning pays for itself — and then some."
                        : "Try 1× / year, or see panel longevity benefits below."}
                    </p>
                  </div>
                  <button
                    onClick={() => setBookOpen(true)}
                    className="shrink-0 bg-white text-black font-mono text-xs font-bold tracking-widest px-6 py-4 hover:bg-[#4ADE80] transition-colors duration-300"
                  >
                    BOOK FREE AUDIT
                  </button>
                </div>

                {/* Panel longevity section */}
                <div className="px-8 py-6 border-t border-white/10 flex flex-col gap-4 bg-white/2">
                  <p className="font-mono text-[10px] tracking-widest text-white/40">BEYOND THE NUMBERS</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-white text-sm font-medium">Warranty Protection</p>
                      <p className="text-white/45 text-[12px] leading-relaxed">Most manufacturers require periodic cleaning to keep your 25-year warranty valid.</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-white text-sm font-medium">Slower Degradation</p>
                      <p className="text-white/45 text-[12px] leading-relaxed">Soiling-induced hot spots accelerate cell degradation by up to 2× — shortening effective panel life.</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-white text-sm font-medium">Early Fault Detection</p>
                      <p className="text-white/45 text-[12px] leading-relaxed">Every visit includes a visual inspection. We catch inverter faults and micro-cracks before they compound.</p>
                    </div>
                  </div>
                </div>

              </div>
            </Reveal>
          )}
        </div>
      </div>

      <Footer onBookAudit={() => setBookOpen(true)} />
      <BookAuditModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </div>
  );
}

function MiniStat({
  label,
  value,
  accent = false,
}: {
  readonly label: string;
  readonly value: string;
  readonly accent?: boolean;
}) {
  return (
    <div className="px-6 py-5 flex flex-col gap-1">
      <p className="font-mono text-[10px] tracking-widest text-white/30">{label}</p>
      <p className={`text-base font-medium ${accent ? "text-[#4ADE80]" : "text-white"}`}>{value}</p>
    </div>
  );
}
