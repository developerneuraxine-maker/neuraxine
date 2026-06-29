"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SERVICE_DETAILS } from "@/lib/constants";
import { SLUG_MAP } from "@/data/services";
import { ServiceImage } from "@/components/ServiceImage";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  sortOrder: number;
}

interface EcosystemSectionProps {
  services: Service[];
  hoveredModule: string | null;
  onHoverModule: (id: string | null) => void;
}

export function EcosystemSection({ services, hoveredModule, onHoverModule }: EcosystemSectionProps) {
  return (
    <section id="ecosystem" className="relative py-32 px-6">
      <div className="relative z-10 mx-auto max-w-7xl w-full">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-xs tracking-[0.4em] text-neon/80 uppercase mb-4">What We Build</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Complete <span className="text-neon">AI Automation</span> Services
          </h2>
          <p className="mt-4 text-silver/60 max-w-2xl mx-auto text-base leading-relaxed">
            From WhatsApp to voice calls, lead generation to CRM — every system is custom-built
            for your business and runs fully on autopilot.
          </p>
        </motion.div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const details = SERVICE_DETAILS[service.id];
            const isHovered = hoveredModule === service.id;
            const accent = details?.accent ?? "#C6FF00";
            const slug = SLUG_MAP[service.id] ?? service.id;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.55 }}
                onMouseEnter={() => onHoverModule(service.id)}
                onMouseLeave={() => onHoverModule(null)}
              >
                <Link
                  href={`/services/${slug}`}
                  className={`block rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isHovered
                      ? "border-[rgba(198,255,0,0.4)] shadow-[0_0_20px_rgba(198,255,0,0.1)]"
                      : "border-[#2a2a2a] hover:border-[rgba(198,255,0,0.25)]"
                  }`}
                  style={{
                    background: "#161616",
                    boxShadow: isHovered
                      ? `0 0 60px ${accent}18, inset 0 0 60px ${accent}08`
                      : undefined,
                    textDecoration: "none",
                  }}
                >
                  {/* Coloured visual banner */}
                  <div
                    className="relative h-36 flex items-center justify-center overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${accent}22 0%, ${accent}08 50%, transparent 100%)`,
                      borderBottom: `1px solid ${accent}20`,
                    }}
                  >
                    {/* Dot pattern overlay */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `radial-gradient(circle, ${accent}55 1px, transparent 1px)`,
                        backgroundSize: "20px 20px",
                      }}
                    />

                    {/* Stats floating badges */}
                    {details && (
                      <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                        {details.stats.slice(0, 2).map((stat) => (
                          <div
                            key={stat.label}
                            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                            style={{
                              background: `${accent}18`,
                              border: `1px solid ${accent}35`,
                              color: accent,
                            }}
                          >
                            <span className="font-bold">{stat.value}</span>
                            <span className="opacity-70">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Service image with emoji fallback */}
                    <div className="relative">
                      <ServiceImage slug={slug} emoji={service.icon} size={130} />
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-6">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-lg font-bold text-white leading-tight">{service.title}</h3>
                      <span
                        className="mt-0.5 shrink-0 text-xl leading-none"
                        style={{ color: accent }}
                      >
                        →
                      </span>
                    </div>

                    {/* Tagline */}
                    {details && (
                      <p className="text-xs font-medium mb-3" style={{ color: accent }}>
                        {details.tagline}
                      </p>
                    )}

                    {/* Short description */}
                    <p className="text-sm text-silver/60 leading-relaxed">
                      {service.description}
                    </p>

                    {/* View details hint */}
                    <p
                      className="mt-4 text-xs font-medium"
                      style={{ color: `${accent}70` }}
                    >
                      View full details →
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-silver/30 tracking-wider mt-10"
        >
          Click any service card to explore full details, features &amp; real-world results
        </motion.p>
      </div>
    </section>
  );
}
