import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getServiceBySlug, getAllServiceSlugs } from "@/data/services";
import { Navigation } from "@/components/sections/HeroSection";
import { ServiceImage } from "@/components/ServiceImage";
import { BRAND } from "@/lib/constants";

export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.fullDescription.slice(0, 155),
    openGraph: {
      title: `${service.title} | ${BRAND.name}`,
      description: service.tagline,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const { title, tagline, fullDescription, features, stats, useCases, icon, accent } = service;

  return (
    <>
      <Navigation />
      <main className="min-h-screen" style={{ background: "#050505", paddingTop: "80px" }}>

        {/* Hero */}
        <section className="relative py-24 px-6 text-center overflow-hidden">
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${accent}18 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />
          <div className="relative z-10 mx-auto max-w-4xl">
            <Link
              href="/#ecosystem"
              className="inline-flex items-center gap-2 text-xs text-silver/50 hover:text-neon tracking-widest uppercase mb-10 transition-colors"
            >
              ← Back to Services
            </Link>

            <div className="mb-8 flex justify-center">
              <div
                className="rounded-2xl flex items-center justify-center"
                style={{
                  background: `${accent}12`,
                  border: `1px solid ${accent}30`,
                  width: 100,
                  height: 100,
                }}
              >
                <ServiceImage slug={slug} emoji={icon} size={64} />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {title}
            </h1>
            <p className="text-lg font-semibold mb-6" style={{ color: accent }}>
              {tagline}
            </p>
            <p className="text-silver/60 max-w-2xl mx-auto leading-relaxed text-base">
              {fullDescription}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="rounded-full px-8 py-3 font-bold text-black text-sm transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(198,255,0,0.4)]"
                style={{ background: "#C6FF00" }}
              >
                Get This For My Business
              </Link>
              <Link
                href="/#ecosystem"
                className="rounded-full px-8 py-3 font-medium text-sm border transition-all hover:border-neon/60 hover:text-neon"
                style={{ color: "#C6FF00", borderColor: `${accent}40` }}
              >
                ← All Services
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-6 py-8">
          <div className="mx-auto max-w-3xl grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-6 text-center"
                style={{
                  background: `${accent}08`,
                  border: `1px solid ${accent}20`,
                }}
              >
                <div className="text-3xl font-bold mb-1" style={{ color: accent }}>
                  {stat.value}
                </div>
                <div className="text-xs text-silver/50 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              What&apos;s Included
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((f) => (
                <div
                  key={f}
                  className="flex items-start gap-3 rounded-xl p-4"
                  style={{ background: "#161616", border: "1px solid #2a2a2a" }}
                >
                  <span
                    className="mt-0.5 shrink-0 text-xs font-bold"
                    style={{ color: accent }}
                  >
                    ✓
                  </span>
                  <span className="text-sm text-silver/70">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="px-6 py-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              Who Uses This
            </h2>
            <div className="space-y-4">
              {useCases.map((uc) => (
                <div
                  key={uc}
                  className="flex items-start gap-4 rounded-xl p-5"
                  style={{
                    background: "#0d0d0d",
                    border: `1px solid ${accent}18`,
                  }}
                >
                  <span className="shrink-0 font-bold" style={{ color: accent }}>
                    →
                  </span>
                  <span className="text-silver/70">{uc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20">
          <div
            className="mx-auto max-w-3xl rounded-3xl p-10 text-center"
            style={{
              background: `${accent}08`,
              border: `1px solid ${accent}25`,
            }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to automate your business?
            </h2>
            <p className="text-silver/60 mb-8 max-w-md mx-auto">
              Book a free demo and we&apos;ll show you exactly how {title} can work for your
              business.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3 font-bold text-black text-sm transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(198,255,0,0.4)]"
              style={{ background: "#C6FF00" }}
            >
              Book Free Demo →
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}
