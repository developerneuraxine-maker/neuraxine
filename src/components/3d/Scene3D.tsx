"use client";

import { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ParticleUniverse } from "./ParticleUniverse";
import { BackgroundSystem } from "./BackgroundSystem";
import { DataStreams } from "./DataStreams";
import { NeuralNetwork } from "./NeuralNetwork";
import { AICoreShader } from "./AICoreShader";
import { FloatingModules } from "./FloatingModules";
import { ProcessPathway } from "./ProcessPathway";
import { CaseStudyOrbs } from "./CaseStudyOrbs";

interface CameraControllerProps {
  scrollProgress: number;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

function CameraController({ scrollProgress, mouse }: CameraControllerProps) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0, z: 6, lookY: 0 });

  useFrame((_, delta) => {
    const cam = camera as THREE.PerspectiveCamera;
    const p = scrollProgress;

    const positions = [
      { x: 0, y: 0, z: 6, lookY: 0 },
      { x: 0, y: -0.8, z: 3.5, lookY: -0.5 },
      { x: 2.5, y: 0.2, z: 1, lookY: 0 },
      { x: 0, y: 1.2, z: -2, lookY: 0.5 },
      { x: -2.5, y: 0, z: -6, lookY: 0 },
      { x: 0, y: -1, z: -10, lookY: -0.3 },
      { x: 0, y: 0.5, z: -14, lookY: 0 },
    ];

    const segment = p * (positions.length - 1);
    const idx = Math.min(Math.floor(segment), positions.length - 2);
    const t = THREE.MathUtils.smoothstep(segment - idx, 0, 1);
    const from = positions[idx];
    const to = positions[idx + 1];

    target.current.x = THREE.MathUtils.lerp(from.x, to.x, t) + mouse.current.x * 0.6;
    target.current.y = THREE.MathUtils.lerp(from.y, to.y, t) + mouse.current.y * 0.35;
    target.current.z = THREE.MathUtils.lerp(from.z, to.z, t);
    target.current.lookY = THREE.MathUtils.lerp(from.lookY, to.lookY, t);

    const smooth = 1 - Math.pow(0.001, delta);
    cam.position.x = THREE.MathUtils.lerp(cam.position.x, target.current.x, smooth);
    cam.position.y = THREE.MathUtils.lerp(cam.position.y, target.current.y, smooth);
    cam.position.z = THREE.MathUtils.lerp(cam.position.z, target.current.z, smooth);
    cam.lookAt(mouse.current.x * 0.3, target.current.lookY, cam.position.z - 6);
  });

  return null;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  sortOrder: number;
}

interface Scene3DProps {
  services: Service[];
  scrollProgress: number;
  hoveredModule: string | null;
  onHoverModule: (id: string | null) => void;
  activeProcessStep: number;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

function SceneContent({
  services,
  scrollProgress,
  hoveredModule,
  onHoverModule,
  activeProcessStep,
  mouse,
}: Scene3DProps) {
  const heroOpacity = Math.max(0, 1 - scrollProgress * 5);

  return (
    <>
      <BackgroundSystem />
      <DataStreams />
      <ParticleUniverse count={1500} />

      <group>
        <NeuralNetwork mouse={mouse} intensity={heroOpacity} />
        <AICoreShader mouse={mouse} intensity={heroOpacity} />
      </group>

      <FloatingModules
        services={services}
        scrollProgress={scrollProgress}
        hoveredModule={hoveredModule}
        onHover={onHoverModule}
      />
      <ProcessPathway scrollProgress={scrollProgress} activeStep={activeProcessStep} />
      <CaseStudyOrbs scrollProgress={scrollProgress} />

      <CameraController scrollProgress={scrollProgress} mouse={mouse} />
    </>
  );
}

export function Scene3D(props: Scene3DProps) {
  const [webglError, setWebglError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      try {
        const gl =
          canvasRef.current.getContext("webgl2") ||
          canvasRef.current.getContext("webgl");
        if (!gl) setWebglError(true);
      } catch {
        setWebglError(true);
      }
    }
  }, []);

  if (webglError) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          background: "linear-gradient(135deg, #050505 0%, #0a1a0a 50%, #050505 100%)",
        }}
      />
    );
  }

  return (
    <Canvas
      ref={canvasRef}
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
      onCreated={(state) => {
        try {
          state.gl.info.reset?.();
        } catch {
          // non-critical
        }
      }}
    >
      <color attach="background" args={["#050505"]} />
      <Suspense fallback={null}>
        <SceneContent {...props} />
      </Suspense>
    </Canvas>
  );
}
