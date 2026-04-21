import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import ScrollReveal from "../components/ScrollReveal";
import GoogleModelViewer from "../components/GoogleModelViewer";
import Nav from "../components/Nav";
import BookAuditModal from "../components/BookAuditModal";
import { Reveal, ScrollUnreveal } from "../components/animations";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 121;
const ZOOM_FACTOR = 1.0;

export default function Home() {
  const [arrowCycle, setArrowCycle] = useState(0);
  const [bookOpen, setBookOpen] = useState(false);

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

  const rotateX = useTransform(screen3Progress, [0, 0.8], [15, 0]);
  const y = useTransform(screen3Progress, [0, 0.8], [100, 0]);
  const cardOpacity = useTransform(screen3Progress, [0, 0.4], [0, 1]);

  // Preload frames
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/ezgif-frame-${i.toString().padStart(3, "0")}.jpg`;

      const handleLoad = () => {
        loadedCount++;
        setLoadedProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setIsLoaded(true);
        }
      };
      img.onload = handleLoad;
      img.onerror = handleLoad;
      images.push(img);
    }
  }, []);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const images = imagesRef.current;
    if (!canvas || !ctx || !images[index]) return;

    const img = images[index];
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth = canvas.width,
      drawHeight = canvas.height;
    let offsetX = 0,
      offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    const zoomedWidth = drawWidth * ZOOM_FACTOR;
    const zoomedHeight = drawHeight * ZOOM_FACTOR;
    const zoomOffsetX = offsetX - (zoomedWidth - drawWidth) / 2;
    const zoomOffsetY = offsetY - (zoomedHeight - drawHeight) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, zoomOffsetX, zoomOffsetY, zoomedWidth, zoomedHeight);
  };

  // Scroll + resize
  useEffect(() => {
    if (!isLoaded) return;

    resizeCanvas();
    drawFrame(0);

    const handleScroll = () => {
      if (!screen3Ref.current) return;
      const rect = screen3Ref.current.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;
      const isMobile = window.innerWidth < 1024;
      const stopScroll = Math.max(
        1,
        absoluteTop + window.innerHeight * (isMobile ? 0.05 : 0.15),
      );
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
      resizeCanvas();
      drawFrame(currentFrameRef.current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isLoaded]);

  // Mouse parallax
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;
    const canvas = canvasRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      gsap.to(canvas, { x: -x, y: -y, duration: 0.5, ease: "power2.out" });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isLoaded]);

  return (
    <>
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
        {/* Fixed canvas background */}
        <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden bg-black">
          <canvas
            ref={canvasRef}
            className="w-full h-full will-change-transform"
            style={{ scale: 1.05 }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60 pointer-events-none" />
        </div>

        <Nav />

        {/* Scrollable content */}
        <div className="relative z-10 w-full pointer-events-none">
          {/* Screen 1 — hero */}
          <div className="w-[90%] mx-auto h-screen flex flex-col py-8 md:py-12 lg:py-16 pb-12">
            <main className="flex-1 w-full pointer-events-auto flex flex-col justify-end md:grid md:grid-cols-12 md:grid-rows-[1fr_auto] gap-y-8 md:gap-y-0 md:gap-x-8 pb-8 md:pb-0">
              <div className="md:row-start-2 md:col-start-1 md:col-span-8 flex items-end">
                <ScrollUnreveal>
                  <Reveal delay={0.2}>
                    <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] font-medium tracking-tight text-white">
                      Maintain.
                      <br />
                      Monitor. Protect.
                    </h1>
                  </Reveal>
                </ScrollUnreveal>
              </div>

              <div className="md:row-start-1 md:col-start-8 md:col-span-5 flex flex-col justify-center items-start md:items-end text-left md:text-right">
                <ScrollUnreveal>
                  <Reveal delay={0.3}>
                    <p className="text-[clamp(1rem,1.6vw,1.375rem)] text-white/64 leading-[1.3] font-normal max-w-[460px]">
                      Your solar system is a $25,000 investment. We maintain,
                      monitor, and protect it —{" "}
                      <span className="font-semibold text-white">
                        backed by the most complete local soiling data in
                        Northern Virginia.
                      </span>
                    </p>
                  </Reveal>
                </ScrollUnreveal>
              </div>

              <div className="md:row-start-2 md:col-start-8 md:col-span-5 flex items-end justify-start md:justify-end">
                <div className="animate-fade-rise-delay-2">
                  <Link
                    to="/services"
                    className="flex items-stretch gap-1 group cursor-pointer"
                    onMouseEnter={() => setArrowCycle((c) => c + 1)}
                    onMouseLeave={() => setArrowCycle((c) => c + 1)}
                  >
                    <div className="flex items-center px-8 py-5 bg-white/8 backdrop-blur-[80px] group-hover:bg-white transition-colors duration-300">
                      <span className="font-mono text-[12px] tracking-[-0.01em] text-white/90 group-hover:text-black transition-colors duration-300">
                        CHECK OUR SERVICES
                      </span>
                    </div>
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
                  </Link>
                </div>
              </div>
            </main>
          </div>

          {/* Gap */}
          <div className="h-[200px] w-full" />

          {/* Screen 2 — scroll reveal text */}
          <div className="w-[90%] mx-auto min-h-screen flex flex-col justify-center py-8 md:py-12 lg:py-16 pointer-events-auto">
            <div className="max-w-[1200px] w-full">
              <ScrollReveal
                baseOpacity={0.1}
                enableBlur={true}
                baseRotation={3}
                blurStrength={4}
                textClassName="text-[clamp(1.5rem,4vw,4rem)] leading-[0.85] font-medium text-white w-full"
              >
                Neglect Makes Panels Degrade 3× Faster. Hot-Spots Void
                Warranties. We Maintain, Inspect, And Document — So You Never
                Find Out The Hard Way.
              </ScrollReveal>

              <div className="mt-24 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
                <Reveal
                  delay={0.1}
                  className="md:col-span-4 flex flex-col gap-6"
                >
                  <span className="text-3xl font-extrabold leading-none">
                    <span className="text-white">Solar</span>
                    <span>Insight</span>
                  </span>
                  <p className="text-[11px] font-mono tracking-widest text-white/60 uppercase leading-relaxed">
                    Solar asset maintenance
                    <br />
                    Arlington, Virginia
                  </p>
                </Reveal>

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

          {/* Gap */}
          <div className="h-[20vh] w-full" />

          {/* Screen 3 — 3D card */}
          <div
            ref={screen3Ref}
            className="w-full h-[300vh] pointer-events-auto relative"
          >
            <div
              className="sticky top-0 w-full h-screen flex items-start justify-center overflow-hidden"
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
                  <table className="font-mono text-[10px] text-white/80 border-separate border-spacing-x-4 border-spacing-y-1">
                    <tbody>
                      {[
                        ["CLEANINGS", "2 / YEAR"],
                        ["INSPECTION", "THERMAL"],
                        ["GUTTERS", "INCLUDED"],
                        ["PLAN PRICE", "$550–$850/YR"],
                        ["GUARANTEE", "MONEY BACK"],
                        ["MARKET", "ARLINGTON, VA"],
                        ["DATA", "NOVA SOILING"],
                      ].map(([k, v]) => (
                        <tr key={k}>
                          <td className="text-right text-white/50">{k}:</td>
                          <td className="text-left font-medium text-white">
                            {v}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex-1 w-full flex items-center justify-center relative">
                  <GoogleModelViewer
                    src="/solar_textured.glb"
                    autoRotate={true}
                    cameraControls={true}
                    shadowIntensity={1}
                    exposure={1}
                    environmentImage="neutral"
                  />
                  <button
                    className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 pointer-events-auto transition-colors hover:bg-white/20"
                    onClick={() =>
                      window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: "smooth",
                      })
                    }
                    aria-label="Scroll to bottom"
                  >
                    <ChevronDown className="w-4 h-4 text-white/80" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA strip before footer */}
      <div className="relative z-10 border-t border-white/8 py-20 px-6 text-center">
        <p className="font-mono text-xs text-white/40 tracking-widest mb-4">
          EXPLORE
        </p>
        <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-medium text-white mb-8">
          Everything your panels need.
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            ["SERVICES", "/services"],
            ["PRICING", "/pricing"],
            ["OUR DATA", "/data"],
            ["ABOUT", "/about"],
          ].map(([label, href]) => (
            <Link
              key={label}
              to={href}
              className="font-mono text-xs text-white/60 hover:text-white border border-white/15 hover:border-white/40 px-6 py-3 transition-colors duration-300"
            >
              {label} →
            </Link>
          ))}
        </div>
      </div>

      <footer className="relative z-10 border-t border-white/8 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <span className="text-3xl font-extrabold leading-none text-white">
            SolarInsight
          </span>
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

      <BookAuditModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </>
  );
}
