import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import gsap from "gsap";
import ScrollReveal from "./components/ScrollReveal";
import ModelViewer from "./components/ModelViewer";
import GoogleModelViewer from "./components/GoogleModelViewer";

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const TOTAL_FRAMES = 121;
const ZOOM_FACTOR = 1.0;

export default function App() {
  const [arrowCycle, setArrowCycle] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    panels: "",
    message: "",
  });
  const [formSent, setFormSent] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedProgress, setLoadedProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const requestRef = useRef<number>(0);

  const screen3Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: screen3Progress } = useScroll({
    target: screen3Ref,
    offset: ["start end", "start start"],
  });

  // Finish flattening when it's 80% of the way to the top
  const rotateX = useTransform(screen3Progress, [0, 0.8], [15, 0]);
  const y = useTransform(screen3Progress, [0, 0.8], [100, 0]);
  const cardOpacity = useTransform(screen3Progress, [0, 0.4], [0, 1]);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNumber = i.toString().padStart(3, "0");
      img.src = `/ezgif-frame-${frameNumber}.jpg`;

      const handleLoad = () => {
        loadedCount++;
        setLoadedProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setIsLoaded(true);
        }
      };

      img.onload = handleLoad;
      img.onerror = handleLoad; // Proceed even on error to not block
      images.push(img);
    }
  }, []);

  // Canvas drawing logic
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const images = imagesRef.current;

    if (!canvas || !ctx || !images[index]) return;

    const img = images[index];

    // Set canvas dimensions to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Calculate object-fit: cover with ZOOM_FACTOR
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    // Apply zoom
    const zoomedWidth = drawWidth * ZOOM_FACTOR;
    const zoomedHeight = drawHeight * ZOOM_FACTOR;
    const zoomOffsetX = offsetX - (zoomedWidth - drawWidth) / 2;
    const zoomOffsetY = offsetY - (zoomedHeight - drawHeight) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, zoomOffsetX, zoomOffsetY, zoomedWidth, zoomedHeight);
  };

  // Scroll and Resize handling
  useEffect(() => {
    if (!isLoaded) return;

    // Initial draw
    drawFrame(0);

    const handleScroll = () => {
      if (!screen3Ref.current) return;

      const rect = screen3Ref.current.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;
      const stopScroll = Math.max(1, absoluteTop + window.innerHeight * 1.5);

      const scrollFraction = Math.max(
        0,
        Math.min(1, window.scrollY / stopScroll),
      );

      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(scrollFraction * TOTAL_FRAMES),
      );

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        requestRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
      }
    };

    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    // Trigger once
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isLoaded]);

  // Mouse Parallax
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // -10 to 10
      const y = (e.clientY / window.innerHeight - 0.5) * 20; // -10 to 10

      gsap.to(canvas, {
        x: -x,
        y: -y,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isLoaded]);

  return (
    <>
      {/* Loading Overlay - Rendered ON TOP, not instead of, to prevent hydration errors */}
      {!isLoaded && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white font-sans z-50">
          <div className="text-[10px] font-mono tracking-widest mb-4 text-white/50">
            LOADING SEQUENCE
          </div>
          <div className="text-4xl font-mono">{loadedProgress}%</div>
          <div className="w-64 h-[1px] bg-white/10 mt-8 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${loadedProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="relative w-full bg-black text-white font-sans">
        {/* Fixed Background Canvas */}
        <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden bg-black">
          <canvas
            ref={canvasRef}
            className="w-full h-full will-change-transform"
            style={{ scale: 1.05 }}
          />
          {/* Overlay gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60 pointer-events-none" />
        </div>

        {/* Fixed Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-1/2 -translate-x-1/2 z-20 w-[90%] flex items-center justify-between pointer-events-auto py-4 md:py-6 lg:py-8"
        >
          {/* Logo — click to scroll to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center focus:outline-none"
            aria-label="Back to top"
          >
            <span className="text-3xl font-extrabold leading-none">
              <span className="text-white">Solar</span>
              <span className="">Insight</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-stretch bg-[#1A1A1A]/40 backdrop-blur-[80px]">
            <div className="flex items-center justify-between px-6 font-mono text-xs tracking-[-0.01em] w-[480px]">
              {[
                ["SERVICES", "#services"],
                ["PRICING", "#pricing"],
                ["OUR DATA", "#data"],
                ["ABOUT", "#about"],
                ["FAQ", "#faq"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="text-white/64 hover:text-white transition-colors duration-300 py-1"
                >
                  {label}
                </a>
              ))}
            </div>
            <button
              onClick={() => setBookOpen(true)}
              className="bg-white text-black px-6 py-5 font-mono text-xs leading-4 font-bold tracking-[-0.01em] hover:bg-gray-200 transition-colors w-[148px]"
            >
              BOOK AUDIT
            </button>
          </nav>

          {/* Hamburger — mobile only */}
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

        {/* Mobile menu modal — white card, not full height */}
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
          {[
            ["SERVICES", "#services"],
            ["PRICING", "#pricing"],
            ["OUR DATA", "#data"],
            ["ABOUT", "#about"],
            ["FAQ", "#faq"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="font-mono text-sm text-black/70 hover:text-black tracking-widest transition-colors border-b border-black/8 pb-5 last:border-0 last:pb-0"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
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

        {/* Scrollable Content */}
        <div className="relative z-10 w-full pointer-events-none">
          {/* Screen 1 */}
          <div className="w-[90%] mx-auto h-screen flex flex-col py-8 md:py-12 lg:py-16 pb-12">
            <main className="flex-1 w-full pointer-events-auto flex flex-col justify-end md:grid md:grid-cols-12 md:grid-rows-[1fr_auto] gap-y-8 md:gap-y-0 md:gap-x-8 pb-8 md:pb-0">
              {/* Left Heading (Bottom Left on Desktop, Top on Mobile) */}
              <div className="md:row-start-2 md:col-start-1 md:col-span-8 flex items-end">
                <Reveal delay={0.2}>
                  <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] font-medium tracking-tight text-white">
                    Maintain.
                    <br />
                    Monitor. Protect.
                  </h1>
                </Reveal>
              </div>

              {/* Right Text Content (Center Right on Desktop) */}
              <div className="md:row-start-1 md:col-start-8 md:col-span-5 flex flex-col justify-center items-start md:items-end text-left md:text-right">
                <Reveal delay={0.3}>
                  <p className="text-[clamp(1rem,1.6vw,1.375rem)] text-white/64 leading-[1.3] font-normal max-w-[460px]">
                    Your solar system is a $25,000 investment. We maintain,
                    monitor, and protect it —{" "}
                    <span className="font-semibold text-white">
                      backed by the most complete local soiling data in Northern
                      Virginia.
                    </span>
                  </p>
                </Reveal>
              </div>

              {/* Right Button (Bottom Right on Desktop, Bottom on Mobile) */}
              <div className="md:row-start-2 md:col-start-8 md:col-span-5 flex items-end justify-start md:justify-end">
                <Reveal delay={0.4}>
                  <div
                    className="flex items-stretch gap-1 group cursor-pointer"
                    onClick={() => setBookOpen(true)}
                    onMouseEnter={() => setArrowCycle((c) => c + 1)}
                    onMouseLeave={() => setArrowCycle((c) => c + 1)}
                  >
                    {/* Text Button */}
                    <div className="flex items-center px-8 py-5 bg-white/8 backdrop-blur-[80px] group-hover:bg-white transition-colors duration-300">
                      <span className="font-mono text-[12px] tracking-[-0.01em] text-white/90 group-hover:text-black transition-colors duration-300">
                        GET A FREE AUDIT
                      </span>
                    </div>
                    {/* Arrow Button */}
                    <div className="relative flex items-center justify-center px-6 bg-white/8 backdrop-blur-[80px] group-hover:bg-white transition-colors duration-300 overflow-hidden">
                      {arrowCycle === 0 ? (
                        <ArrowRight className="w-5 h-5 text-white/90 group-hover:text-black transition-colors duration-300" />
                      ) : (
                        <React.Fragment key={arrowCycle}>
                          <ArrowRight className="w-5 h-5 text-white/90 group-hover:text-black transition-colors duration-300 animate-fly-out" />
                          <ArrowRight className="absolute w-5 h-5 text-white/90 group-hover:text-black transition-colors duration-300 animate-fly-in" />
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                </Reveal>
              </div>
            </main>
          </div>

          {/* Gap before Screen 2 */}
          <div className="h-[200px] w-full"></div>

          {/* Screen 2 */}
          <div className="w-[90%] mx-auto min-h-screen flex flex-col justify-center py-8 md:py-12 lg:py-16 pointer-events-auto">
            <div className="max-w-[1200px] w-full">
              <ScrollReveal
                baseOpacity={0.1}
                enableBlur={true}
                baseRotation={3}
                blurStrength={4}
                textClassName="text-[clamp(1.5rem,4vw,4rem)] leading-[0.85] font-medium  text-white w-full"
              >
                Neglect Makes Panels Degrade 3× Faster. Hot-Spots Void
                Warranties. We Maintain, Inspect, And Document — So You Never
                Find Out The Hard Way.
              </ScrollReveal>

              <div className="mt-24 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
                {/* Col 1: Logo & Tagline */}
                <Reveal
                  delay={0.1}
                  className="md:col-span-4 flex flex-col gap-6"
                >
                  <div className="flex items-center">
                    <span className="text-3xl font-extrabold  leading-none">
                      <span className="text-white">Solar</span>
                      <span className="">Insight</span>
                    </span>
                  </div>
                  <p className="text-[11px] font-mono tracking-widest text-white/60 uppercase leading-relaxed">
                    Solar asset maintenance
                    <br />
                    Arlington, Virginia
                  </p>
                </Reveal>

                {/* Col 2: Research */}
                <Reveal
                  delay={0.2}
                  className="md:col-span-4 flex flex-col gap-4"
                >
                  <h3 className="text-xl font-medium text-white">
                    Why Maintenance
                    <br />
                    Matters
                  </h3>
                  <p className="text-[15px] text-white/80 leading-relaxed">
                    Dirty panels cause hot-spot degradation, accelerate PID
                    failure, and can void your warranty. Neglect documentably
                    makes panels degrade faster.
                  </p>
                </Reveal>

                {/* Col 3: Tourism */}
                <Reveal
                  delay={0.3}
                  className="md:col-span-4 flex flex-col gap-4"
                >
                  <h3 className="text-xl font-medium text-white">
                    Data-Backed
                    <br />
                    Local Authority
                  </h3>
                  <p className="text-[15px] text-white/80 leading-relaxed">
                    Every job feeds our proprietary soiling dataset for Northern
                    Virginia — published annually and used by local installers
                    and homeowners alike.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>

          {/* Gap before Screen 3 */}
          <div className="h-[80vh] w-full"></div>

          {/* Screen 3 */}
          <div
            ref={screen3Ref}
            className="w-full h-[300vh] pointer-events-auto relative"
          >
            <div
              className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden"
              style={{ perspective: "1200px" }}
            >
              <motion.div
                style={{
                  rotateX,
                  y,
                  opacity: cardOpacity,
                  transformOrigin: "bottom center",
                }}
                className="w-[90vw] md:w-[80vw] h-[85vh] md:h-[80vh] bg-[#1A1A1A]/40 backdrop-blur-[80px] border border-white/10 flex flex-col p-5 md:p-8 relative"
              >
                {/* Header: Title + Specs side by side on desktop, stacked on mobile */}
                <div className="flex flex-col md:flex-row md:justify-between gap-3 md:gap-0 pointer-events-none z-10">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[14px] md:text-[18px] font-sans font-medium text-white uppercase tracking-wide">
                      Annual Solar Care Plan
                    </h3>
                    <p className="text-[11px] font-sans text-white/64 max-w-[260px]">
                      Full-service solar asset maintenance for Arlington
                      homeowners.
                    </p>
                  </div>

                  {/* Specs */}
                  <table className="font-mono text-[10px] text-white/80 border-separate border-spacing-x-4 border-spacing-y-1">
                    <tbody>
                      <tr>
                        <td className="text-right text-white/50">CLEANINGS:</td>
                        <td className="text-left font-medium text-white">
                          2 / YEAR
                        </td>
                      </tr>
                      <tr>
                        <td className="text-right text-white/50">
                          INSPECTION:
                        </td>
                        <td className="text-left font-medium text-white">
                          THERMAL
                        </td>
                      </tr>
                      <tr>
                        <td className="text-right text-white/50">GUTTERS:</td>
                        <td className="text-left font-medium text-white">
                          INCLUDED
                        </td>
                      </tr>
                      <tr>
                        <td className="text-right text-white/50">
                          PLAN PRICE:
                        </td>
                        <td className="text-left font-medium text-white">
                          $550–$850/YR
                        </td>
                      </tr>
                      <tr>
                        <td className="text-right text-white/50">GUARANTEE:</td>
                        <td className="text-left font-medium text-white">
                          MONEY BACK
                        </td>
                      </tr>
                      <tr>
                        <td className="text-right text-white/50">MARKET:</td>
                        <td className="text-left font-medium text-white">
                          ARLINGTON, VA
                        </td>
                      </tr>
                      <tr>
                        <td className="text-right text-white/50">DATA:</td>
                        <td className="text-left font-medium text-white">
                          NOVA SOILING
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex-1 w-full flex items-center justify-center">
                  <GoogleModelViewer
                    src="/solar_textured.glb"
                    autoRotate={true}
                    cameraControls={true}
                    shadowIntensity={1}
                    exposure={1}
                    environmentImage="neutral"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Page sections — relative + z-index to paint above the fixed canvas */}
      <div className="relative z-10">
        {/* ── SERVICES ─────────────────────────────────── */}
        <section id="services" className="py-28 px-6">
          <div className="max-w-5xl mx-auto flex flex-col gap-16">
            <Reveal>
              <span className="font-mono text-xs text-[#4ADE80] tracking-widest">
                SERVICES
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
              ].map(({ title, desc }) => (
                <Reveal key={title}>
                  <div className="border-t border-white/10 pt-6 flex flex-col gap-3">
                    <h3 className="text-white font-medium text-lg">{title}</h3>
                    <p className="text-white/55 text-[14px] leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────── */}
        <section id="pricing" className="py-28 px-6">
          <div className="max-w-5xl mx-auto flex flex-col gap-16">
            <Reveal>
              <span className="font-mono text-xs text-[#4ADE80] tracking-widest">
                PRICING
              </span>
              <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-medium text-white tracking-tight leading-[1.05]">
                Flat annual plans.
                <br />
                No surprise invoices.
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  plan: "Starter",
                  price: "$550",
                  sub: "Up to 20 panels",
                  features: [
                    "2× deionized wash",
                    "Thermal inspection",
                    "Gutter clearance",
                    "Production report",
                    "Money-back guarantee",
                  ],
                  highlight: false,
                },
                {
                  plan: "Standard",
                  price: "$690",
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
                  price: "$850",
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
              ].map(({ plan, price, sub, features, highlight }) => (
                <Reveal key={plan}>
                  <div
                    className={`flex flex-col gap-6 p-8 rounded-2xl border ${highlight ? "border-[#4ADE80]/40 bg-[#4ADE80]/5" : "border-white/10 bg-white/3"}`}
                  >
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
                    <ul className="flex flex-col gap-2">
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
          </div>
        </section>

        {/* ── OUR DATA ─────────────────────────────────── */}
        <section id="data" className="py-28 px-6">
          <div className="max-w-5xl mx-auto flex flex-col gap-16">
            <Reveal>
              <span className="font-mono text-xs text-[#4ADE80] tracking-widest">
                OUR DATA
              </span>
              <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-medium text-white tracking-tight leading-[1.05]">
                The NOVA Soiling Index.
              </h2>
              <p className="mt-4 text-white/55 text-[15px] leading-relaxed max-w-2xl">
                Since 2021 we have measured panel soiling rates at over 200
                residential sites across Arlington, Alexandria, and Fairfax
                County. Every service visit adds a data point. The result is the
                most granular soiling dataset available for Northern Virginia —
                published annually and freely shared with the community.
              </p>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12">
              {[
                { num: "200+", label: "Monitored sites" },
                { num: "21%", label: "Avg. summer energy loss from soiling" },
                { num: "4 yrs", label: "Continuous local data collection" },
                { num: "Free", label: "Annual report — no paywall" },
              ].map(({ num, label }) => (
                <Reveal key={num}>
                  <div className="flex flex-col gap-2">
                    <span className="text-[clamp(2rem,4vw,2.8rem)] font-bold text-white leading-none">
                      {num}
                    </span>
                    <span className="text-[11px] font-mono text-white/45 uppercase tracking-widest leading-relaxed">
                      {label}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT ────────────────────────────────────── */}
        <section id="about" className="py-28 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <Reveal>
              <span className="font-mono text-xs text-[#4ADE80] tracking-widest">
                ABOUT
              </span>
              <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-medium text-white tracking-tight leading-[1.05]">
                Built in Arlington.
                <br />
                For Arlington.
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="flex flex-col gap-6 text-white/60 text-[15px] leading-relaxed">
                <p>
                  SolarInsight was founded by a team of engineers and energy
                  analysts who noticed the same problem across Northern Virginia
                  neighborhoods: homeowners were investing $20,000–$30,000 in
                  solar systems and then doing almost nothing to maintain them.
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
                <div className="border-t border-white/10 pt-6 flex flex-col gap-1">
                  <p className="text-white font-medium">
                    Based in Arlington, Virginia
                  </p>
                  <p className="font-mono text-xs tracking-widest text-white/40">
                    SERVING ARLINGTON · ALEXANDRIA · FAIRFAX
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────── */}
        <section id="faq" className="py-28 px-6">
          <div className="max-w-3xl mx-auto flex flex-col gap-16">
            <Reveal>
              <span className="font-mono text-xs text-[#4ADE80] tracking-widest">
                FAQ
              </span>
              <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-medium text-white tracking-tight leading-[1.05]">
                Common questions.
              </h2>
            </Reveal>
            <div className="flex flex-col">
              {[
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
              ].map(({ q, a }) => (
                <Reveal key={q}>
                  <details className="border-t border-white/10 py-6 group">
                    <summary className="flex justify-between items-center cursor-pointer text-white font-medium text-[15px] list-none">
                      {q}
                      <span className="ml-4 text-[#4ADE80] text-xl leading-none transition-transform duration-200 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 text-white/55 text-[14px] leading-relaxed">
                      {a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────── */}
        <footer className="border-t border-white/8 py-12 px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center">
              <span className="text-3xl font-extrabold  leading-none">
                <span className="text-white">Solar</span>
                <span className="text-white">Insight</span>
              </span>
            </div>
            <p className="font-mono text-[11px] text-white/30 tracking-widest">
              © 2025 SOLARINSIGHT LLC · ARLINGTON, VA
            </p>
            <button
              onClick={() => setBookOpen(true)}
              className="font-mono text-xs text-[#4ADE80] hover:text-white tracking-widest transition-colors"
            >
              BOOK A FREE AUDIT →
            </button>
          </div>
        </footer>
      </div>
      {/* end relative z-10 bg-black wrapper */}

      {/* ── BOOK AUDIT MODAL ─────────────────────────── */}
      {bookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            className="absolute inset-0 bg-black/70 backdrop-blur-sm w-full cursor-default"
            aria-label="Close modal"
            onClick={() => setBookOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white/8 backdrop-blur-[80px] border border-white/15 rounded-2xl w-full max-w-lg p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setBookOpen(false)}
              className="absolute top-5 right-5 text-white/40 hover:text-white text-xl leading-none"
            >
              ✕
            </button>
            <div>
              <p className="font-mono text-xs text-[#4ADE80] tracking-widest">
                FREE AUDIT
              </p>
              <h3 className="mt-2 text-2xl font-medium text-white">
                Book your free solar audit
              </h3>
              <p className="mt-1 text-[13px] text-white/50">
                We'll assess your system and soiling exposure — no cost, no
                commitment.
              </p>
            </div>
            {formSent ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <span className="text-4xl">☀️</span>
                <p className="text-white font-medium">Request received!</p>
                <p className="text-white/50 text-sm">
                  We'll be in touch within one business day.
                </p>
              </div>
            ) : (
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormSent(true);
                }}
              >
                {[
                  {
                    id: "name",
                    label: "Full Name",
                    type: "text",
                    placeholder: "Jane Smith",
                  },
                  {
                    id: "email",
                    label: "Email",
                    type: "email",
                    placeholder: "jane@example.com",
                  },
                  {
                    id: "phone",
                    label: "Phone",
                    type: "tel",
                    placeholder: "(703) 555-0100",
                  },
                  {
                    id: "address",
                    label: "Property Address",
                    type: "text",
                    placeholder: "1234 Oak St, Arlington, VA",
                  },
                  {
                    id: "panels",
                    label: "Approx. Panel Count (optional)",
                    type: "text",
                    placeholder: "e.g. 24",
                  },
                ].map(({ id, label, type, placeholder }) => (
                  <div key={id} className="flex flex-col gap-1">
                    <label className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
                      {label}
                    </label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={formData[id as keyof typeof formData]}
                      onChange={(e) =>
                        setFormData((d) => ({ ...d, [id]: e.target.value }))
                      }
                      className="bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors"
                      required={id !== "panels"}
                    />
                  </div>
                ))}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="msg"
                    className="font-mono text-[10px] text-white/40 tracking-widest uppercase"
                  >
                    Message (optional)
                  </label>
                  <textarea
                    id="msg"
                    rows={3}
                    placeholder="Any details about your system or concerns..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((d) => ({ ...d, message: e.target.value }))
                    }
                    className="bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 bg-[#4ADE80] text-black font-mono text-xs font-bold tracking-widest py-4 rounded-lg hover:bg-[#22c55e] transition-colors"
                >
                  SUBMIT REQUEST
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}
