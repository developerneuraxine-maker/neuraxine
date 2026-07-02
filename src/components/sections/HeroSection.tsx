"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { BRAND } from "@/lib/constants";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const sectionHref = (hash: string) => (pathname === "/" ? hash : `/${hash}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Services", href: "#ecosystem" },
    { label: "Demos",    href: "#demos"     },
    { label: "Process",  href: "#process"   },
    { label: "Results",  href: "#results"   },
    { label: "Contact",  href: "#contact"   },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/5"
          : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href={pathname === "/" ? "#" : "/"} className="group flex items-center gap-2">
          <div style={{ perspective: "600px" }}>
            <motion.div
              animate={{ rotateY: [-12, 12] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
              className="relative h-10 w-10 rounded-xl overflow-hidden border border-white/10 group-hover:border-neon/40 bg-black"
              style={{ perspective: "600px" }}
            >
              <img src="/logo.jpg" alt="Neuraxine Logo" className="h-full w-full object-cover" />
            </motion.div>
          </div>
          <span className="text-sm font-semibold tracking-widest text-white group-hover:text-neon transition-colors">
            NEURAXINE
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={sectionHref(link.href)}
              className="text-xs tracking-wider text-silver/70 hover:text-neon transition-colors uppercase"
            >
              {link.label}
            </a>
          ))}
        </div>

        <MagneticButton
          href={sectionHref("#contact")}
          variant="primary"
          className="px-5! py-2! text-xs!"
        >
          Book Demo
        </MagneticButton>
      </div>
    </motion.nav>
  );
}

const PARTICLES = [
  { left: "8%",  top: "8%",  size: 4, delay: 0,   dur: 5.5 },
  { left: "20%", top: "22%", size: 5, delay: 1.2, dur: 6   },
  { left: "33%", top: "12%", size: 6, delay: 2,   dur: 4.5 },
  { left: "58%", top: "28%", size: 4, delay: 0.6, dur: 7   },
  { left: "72%", top: "9%",  size: 5, delay: 1.8, dur: 5   },
  { left: "84%", top: "19%", size: 4, delay: 3.2, dur: 6.5 },
  { left: "93%", top: "14%", size: 5, delay: 2.4, dur: 4.2 },
];

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6"
      style={{ overflow: "hidden" }}
    >
      {/* Subtle top atmospheric glow */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "55%",
        background: "radial-gradient(ellipse 60% 32% at 50% 0%, rgba(198,255,0,0.10) 0%, rgba(198,255,0,0.02) 55%, transparent 75%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Floating gold particles */}
      {PARTICLES.map((p, i) => (
        <div key={i} aria-hidden="true" style={{
          position: "absolute", left: p.left, top: p.top,
          width: p.size, height: p.size, borderRadius: "50%",
          background: "rgba(198,255,0,0.55)",
          boxShadow: "0 0 7px rgba(198,255,0,0.32)",
          animation: `goldFloatUp ${p.dur}s ease-in-out ${p.delay}s infinite`,
          pointerEvents: "none", zIndex: 0,
        }} />
      ))}

      {/* Diagonal laser streak */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "18%", left: "8%",
        width: "28%", height: "1px",
        background: "rgba(198,255,0,0.34)",
        transform: "rotate(-20deg)", transformOrigin: "left center",
        boxShadow: "0 0 5px rgba(198,255,0,0.18)",
        animation: "goldGlowPulse 3s ease-in-out infinite",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Heading, tagline, CTAs — vertically centered, nudged down past nav */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-3xl w-full text-center"
        style={{ marginTop: "64px" }}
      >
        <p className="mb-4 text-xs tracking-[0.4em] text-neon/80 uppercase">
          Next-Generation AI Automation
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white">
          Automate Your Business with{" "}
          <span className="text-neon">Neuraxine AI</span>
        </h1>
        <p className="mt-4 text-base md:text-lg text-silver/60 max-w-xl mx-auto leading-relaxed">
          {BRAND.tagline}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton href="#contact" variant="primary">Book Free Demo</MagneticButton>
          <MagneticButton href="#ecosystem" variant="secondary">Explore AI Systems</MagneticButton>
        </div>
      </motion.div>

      {/* Scroll to explore — pinned to bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-10 z-10 flex flex-col items-center gap-2"
        style={{ color: "rgba(255,255,255,0.50)" }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: "1px", height: "28px",
            background: "linear-gradient(to bottom, rgba(198,255,0,0.65), rgba(198,255,0,0.04))",
          }}
        />
      </motion.div>

      <div className="golden-dome" aria-hidden="true" />

    </section>
  );
}
