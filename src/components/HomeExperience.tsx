"use client";

import { useState, Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navigation, HeroSection } from "@/components/sections/HeroSection";
import { EcosystemSection } from "@/components/sections/EcosystemSection";
import { DemoLabSection } from "@/components/sections/DemoLabSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { CaseStudiesSection } from "@/components/sections/CaseStudiesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { SmoothScrollProvider, useScrollContext } from "@/components/providers/SmoothScrollProvider";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { useActiveSection } from "@/hooks/useScrollProgress";
import { useMousePosition } from "@/hooks/useMousePosition";
import { SERVICES } from "@/lib/constants";

const Scene3D = dynamic(
  () => import("@/components/3d/Scene3D").then((m) => m.Scene3D),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          background: "linear-gradient(135deg, #050505 0%, #1a1a2e 50%, #050505 100%)",
        }}
      />
    ),
  }
);

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  sortOrder: number;
}

interface ExperienceContentProps {
  services: Service[];
  form: {
    name: string;
    phone: string;
    businessName: string;
    service: string;
    message: string;
  };
  setForm: React.Dispatch<React.SetStateAction<{
    name: string;
    phone: string;
    businessName: string;
    service: string;
    message: string;
  }>>;
}

function ExperienceContent({ services, form, setForm }: ExperienceContentProps) {
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const scrollProgress = useScrollContext();
  const mouse = useMousePosition();
  
  // Navigation active section tracking (removed pricing)
  const activeSection = useActiveSection(["hero", "ecosystem", "demos", "process", "results", "contact"]);
  const processStep = activeSection === 3 ? Math.min(Math.floor((scrollProgress - 0.55) * 8), 3) : activeSection > 3 ? 3 : 0;

  return (
    <>
      <Suspense fallback={null}>
        <Scene3D
          services={services}
          scrollProgress={scrollProgress}
          hoveredModule={hoveredModule}
          onHoverModule={setHoveredModule}
          activeProcessStep={Math.max(0, processStep)}
          mouse={mouse}
        />
      </Suspense>

      <Navigation />

      <main className="relative z-10">
        <HeroSection />
        <EcosystemSection services={services} hoveredModule={hoveredModule} onHoverModule={setHoveredModule} />
        <DemoLabSection />
        <ProcessSection activeStep={Math.max(0, processStep)} />
        <CaseStudiesSection />
        <ContactSection services={services} form={form} setForm={setForm} />
      </main>

      <footer className="relative z-10 border-t border-white/10 py-8 text-center">
        <p className="text-xs text-silver/60 tracking-wider">
          © {new Date().getFullYear()} Neuraxine AI. All rights reserved.
        </p>
      </footer>
    </>
  );
}

export function HomeExperience() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    businessName: "",
    service: "",
    message: "",
  });

  const [services, setServices] = useState<Service[]>([]);
  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (err) {
        console.error("Failed to load services:", err);
      }
    };
    loadServices();
  }, []);

  const displayServices = services && services.length > 0
    ? services
    : SERVICES.map((s) => ({ ...s, enabled: true, sortOrder: 0 }));

  return (
    <SmoothScrollProvider>
      <CursorGlow />
      <ExperienceContent services={displayServices} form={form} setForm={setForm} />
      <WhatsAppButton form={form} />
    </SmoothScrollProvider>
  );
}
