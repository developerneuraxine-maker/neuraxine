"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";
import { CASE_STUDIES } from "@/lib/constants";

interface CaseStudyOrbsProps {
  scrollProgress: number;
}

export function CaseStudyOrbs({ scrollProgress }: CaseStudyOrbsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const timer = useRef(new THREE.Timer());

  useFrame(() => {
    if (!groupRef.current) return;
    timer.current.update();
    const visible = scrollProgress > 0.72 && scrollProgress < 0.88;
    groupRef.current.visible = visible;
    groupRef.current.rotation.y = timer.current.getElapsed() * 0.05;
  });

  return (
    <group ref={groupRef} position={[0, 1, -16]}>
      {CASE_STUDIES.map((study, i) => {
        const angle = (i / CASE_STUDIES.length) * Math.PI * 2;
        const x = Math.cos(angle) * 5;
        const z = Math.sin(angle) * 5;
        const y = Math.sin(i * 1.7) * 0.8;

        return (
          <Float key={study.label} speed={1.5} rotationIntensity={0.1} floatIntensity={0.4}>
            <group position={[x, y, z]}>
              <mesh>
                <boxGeometry args={[1.2, 0.8, 0.05]} />
                <meshStandardMaterial
                  color="#111111"
                  emissive="#C6FF00"
                  emissiveIntensity={0.3}
                  metalness={0.9}
                  roughness={0.1}
                  transparent
                  opacity={0.85}
                />
              </mesh>
              <Html
                position={[0, 0, 0.04]}
                center
                style={{ pointerEvents: "none", textAlign: "center", width: "120px" }}
              >
                <div style={{ color: "#C6FF00", fontSize: "14px", fontWeight: 600, lineHeight: 1.2 }}>
                  {study.metric}
                </div>
                <div style={{ color: "#C0C0C0", fontSize: "8px", marginTop: "4px", letterSpacing: "0.05em" }}>
                  {study.label}
                </div>
              </Html>
              <pointLight color="#C6FF00" intensity={0.3} distance={3} />
            </group>
          </Float>
        );
      })}
    </group>
  );
}
