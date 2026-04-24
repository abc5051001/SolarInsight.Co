import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

export default function CountUp({
  to,
  suffix = "",
  duration = 1.8,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const isMobile = globalThis.window !== undefined && globalThis.window.innerWidth < 768;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(isMobile ? to : 0);

  useEffect(() => {
    if (isMobile || !inView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * to));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration, isMobile]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
