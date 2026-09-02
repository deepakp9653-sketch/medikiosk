"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Children,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

export const revealEase = [0.2, 0.7, 0.2, 1] as const;

export function LineMaskReveal({
  lines,
  className = "",
}: {
  lines: string[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });

  return (
    <span ref={ref} className={`block ${className}`}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden">
          <motion.span
            className="block will-change-transform"
            initial={reduce ? false : { y: "100%" }}
            animate={inView || reduce ? { y: 0 } : { y: "100%" }}
            transition={{ duration: 0.6, delay: reduce ? 0 : i * 0.1, ease: revealEase }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function SectionIntro({
  eyebrow,
  children,
  className = "",
  light = false,
}: {
  eyebrow: string;
  children: ReactNode;
  className?: string;
  light?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className={className}>
      <motion.p
        className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] ${
          light ? "text-cornsilk/70" : "text-pine-teal"
        }`}
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={inView || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, ease: revealEase }}
      >
        {eyebrow}
      </motion.p>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={inView || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.55, delay: reduce ? 0 : 0.15, ease: revealEase }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function CountUp({
  to,
  className = "",
}: {
  to: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(Math.round(to));
      return;
    }
    const duration = 1200;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(to * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, reduce]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString("en-IN")}
    </span>
  );
}

export function StaggerGrid({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const items = Children.toArray(children);

  return (
    <div ref={ref} className={className}>
      {items.map((child, i) => (
        <motion.div
          key={i}
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={inView || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.1, ease: revealEase }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

export function DepthHeadline({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.4"],
  });
  const z = useTransform(scrollYProgress, [0, 1], [-80, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const blur = useTransform(scrollYProgress, [0, 1], [4, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className="[perspective:1000px]">
      <motion.div
        className={className}
        style={{ translateZ: z, scale, filter, transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function MockupTilt({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "center 0.55"],
  });
  const rotateXScroll = useTransform(scrollYProgress, [0, 1], [8, 0]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 180, damping: 22 });
  const sy = useSpring(my, { stiffness: 180, damping: 22 });
  const rotateX = useTransform([rotateXScroll, sy], (vals) => {
    const [scroll, hover] = vals as number[];
    return scroll + hover;
  });

  function onMove(e: MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    mx.set(px * 8);
    my.set(py * -8);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div ref={ref} className={`[perspective:1200px] ${className}`}>
      <motion.div
        className="will-change-transform"
        style={reduce ? undefined : { rotateX, rotateY: sx }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {children}
      </motion.div>
    </div>
  );
}
