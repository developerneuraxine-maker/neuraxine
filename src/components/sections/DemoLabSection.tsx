"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ChatbotDemo } from "@/components/demos/ChatbotDemo";
import { VoiceAgentDemo } from "@/components/demos/VoiceAgentDemo";
import { LeadGenDemo } from "@/components/demos/LeadGenDemo";
import { WhatsAppDemo } from "@/components/demos/WhatsAppDemo";
import { MarketingFunnelDemo } from "@/components/demos/MarketingFunnelDemo";

const NXMetalCoin = dynamic(
  () => import("@/components/3d/NXMetalCoin").then((m) => m.NXMetalCoin),
  { ssr: false, loading: () => <div style={{ width: 420, height: 420 }} /> }
);

const DEMOS = [
  { id: "chatbot",   label: "AI Chatbot",        component: ChatbotDemo },
  { id: "voice",     label: "Voice Agent",        component: VoiceAgentDemo },
  { id: "leads",     label: "Lead Generation",    component: LeadGenDemo },
  { id: "whatsapp",  label: "WhatsApp",           component: WhatsAppDemo },
  { id: "funnel",    label: "Marketing Funnel",   component: MarketingFunnelDemo },
];

export function DemoLabSection() {
  const [active, setActive] = useState("chatbot");
  const ActiveDemo = DEMOS.find((d) => d.id === active)?.component || ChatbotDemo;

  return (
    <section id="demos" className="relative">

      {/* ── COIN HERO — fills exactly one viewport height ── */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: "100vh" }}
      >
        {/* Full-screen atmospheric green glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(ellipse 75% 80% at 50% 50%, rgba(198,255,0,0.18) 0%, rgba(120,180,0,0.09) 38%, rgba(5,5,5,0.88) 68%, transparent 90%),
              radial-gradient(ellipse 90% 55% at 50% 115%, rgba(30,60,0,0.55) 0%, rgba(5,10,0,0.28) 52%, transparent 76%)
            `,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* NX coin — centered */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Suspense fallback={<div style={{ width: 420, height: 420 }} />}>
            <NXMetalCoin size={420} />
          </Suspense>
        </div>

        {/* Scroll-down hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 flex flex-col items-center gap-2"
          style={{ color: "rgba(255,255,255,0.40)", zIndex: 2 }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll to explore demos</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: "1px",
              height: "24px",
              background: "linear-gradient(to bottom, rgba(198,255,0,0.65), rgba(198,255,0,0.04))",
            }}
          />
        </motion.div>
      </div>

      {/* ── DEMO CONTENT — below the coin hero ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 pt-16"
        >
          <p className="text-xs tracking-[0.4em] text-neon/80 uppercase mb-4">Live Demo Lab</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Experience <span className="text-neon">AI In Action</span>
          </h2>
          <p className="mt-4 text-silver/60 max-w-xl mx-auto">
            Interactive demos of our automation systems. Try them yourself.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {DEMOS.map((demo) => (
            <button
              key={demo.id}
              onClick={() => setActive(demo.id)}
              className={`px-5 py-2 rounded-full text-xs tracking-wider uppercase transition-all ${
                active === demo.id
                  ? "bg-neon text-black font-medium"
                  : "bg-white/5 text-silver/60 border border-white/10 hover:border-neon/30 hover:text-neon"
              }`}
            >
              {demo.label}
            </button>
          ))}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-lg mx-auto"
        >
          <ActiveDemo />
        </motion.div>
      </div>
    </section>
  );
}
