"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import * as THREE from "three";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  sortOrder: number;
}

interface FloatingModulesProps {
  services: Service[];
  scrollProgress: number;
  hoveredModule: string | null;
  onHover: (id: string | null) => void;
}

interface ModuleOrbProps {
  mod: Service & { angle: number; radius: number; yOffset: number };
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

function ModuleOrb({ mod, isHovered, onHover }: ModuleOrbProps) {
  const x = Math.cos(mod.angle) * mod.radius;
  const z = Math.sin(mod.angle) * mod.radius;

  const { scale, emissive, lightIntensity } = useSpring({
    scale: isHovered ? 1.6 : 1,
    emissive: isHovered ? 1.4 : 0.35,
    lightIntensity: isHovered ? 1.2 : 0.15,
    config: { tension: 280, friction: 20 },
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <a.group
        position={[x, mod.yOffset, z]}
        scale={scale}
        onPointerOver={() => onHover(mod.id)}
        onPointerOut={() => onHover(null)}
      >
        <mesh>
          <octahedronGeometry args={[0.35, 0]} />
          <a.meshStandardMaterial
            color="#111111"
            emissive="#C6FF00"
            emissiveIntensity={emissive}
            metalness={0.85}
            roughness={0.15}
          />
        </mesh>
        {isHovered && (
          <>
            <mesh scale={1.8}>
              <sphereGeometry args={[0.35, 16, 16]} />
              <meshBasicMaterial color="#C6FF00" transparent opacity={0.06} />
            </mesh>
            <Html center distanceFactor={8} position={[0, 0.85, 0]}>
              <div className="text-center text-[11px] font-semibold tracking-wide text-neon mb-1 whitespace-nowrap">
                {mod.title}
              </div>
            </Html>
            <Html center distanceFactor={8} position={[0, -0.9, 0]}>
              <div className="w-40 rounded-lg border border-neon/20 bg-black/80 px-3 py-2 text-[10px] leading-snug text-silver/80 backdrop-blur-md">
                {mod.description}
              </div>
            </Html>
          </>
        )}
        <a.pointLight color="#C6FF00" intensity={lightIntensity} distance={2.5} />
      </a.group>
    </Float>
  );
}

export function FloatingModules({ services, scrollProgress, hoveredModule, onHover }: FloatingModulesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const timer = useRef(new THREE.Timer());

  const modules = useMemo(() => {
    if (!services || services.length === 0) return [];
    return services.map((service, i) => {
      const angle = (i / services.length) * Math.PI * 2;
      const radius = 4;
      return {
        ...service,
        angle,
        radius,
        yOffset: Math.sin(i * 1.3) * 0.5,
      };
    });
  }, [services]);

  useFrame(() => {
    if (!groupRef.current) return;
    timer.current.update();
    const t = timer.current.getElapsed();
    groupRef.current.rotation.y = t * 0.08;
    const visible = scrollProgress > 0.15 && scrollProgress < 0.45;
    groupRef.current.visible = visible;
  });

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {modules.map((mod) => (
        <ModuleOrb
          key={mod.id}
          mod={mod}
          isHovered={hoveredModule === mod.id}
          onHover={onHover}
        />
      ))}
    </group>
  );
}
