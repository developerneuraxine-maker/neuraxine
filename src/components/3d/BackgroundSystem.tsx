"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function BackgroundSystem() {
  const shapesRef = useRef<THREE.Group>(null);
  const beamsRef = useRef<THREE.Group>(null);
  const timer = useRef(new THREE.Timer());

  const shapes = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20 - 10,
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      scale: 0.3 + Math.random() * 0.8,
      type: i % 3,
    }));
  }, []);

  useFrame(() => {
    timer.current.update();
    const t = timer.current.getElapsed();
    if (shapesRef.current) {
      shapesRef.current.rotation.y = t * 0.01;
      shapesRef.current.children.forEach((child, i) => {
        child.rotation.x = t * 0.1 * (i % 2 === 0 ? 1 : -1);
        child.rotation.z = t * 0.05;
      });
    }
    if (beamsRef.current) {
      beamsRef.current.rotation.z = t * 0.02;
    }
  });

  return (
    <>
      <fog attach="fog" args={["#050505", 8, 35]} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} color="#ffffff" />
      <directionalLight position={[-5, -3, -5]} intensity={0.2} color="#C6FF00" />

      <group ref={shapesRef}>
        {shapes.map((shape, i) => (
          <mesh key={i} position={shape.position} rotation={shape.rotation} scale={shape.scale}>
            {shape.type === 0 && <torusGeometry args={[1, 0.05, 8, 32]} />}
            {shape.type === 1 && <boxGeometry args={[0.5, 0.5, 0.5]} />}
            {shape.type === 2 && <tetrahedronGeometry args={[0.6, 0]} />}
            <meshStandardMaterial
              color="#111111"
              emissive="#C6FF00"
              emissiveIntensity={0.1}
              wireframe
              transparent
              opacity={0.3}
            />
          </mesh>
        ))}
      </group>

      <group ref={beamsRef}>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i / 6) * Math.PI]}>
            <planeGeometry args={[0.02, 40]} />
            <meshBasicMaterial color="#C6FF00" transparent opacity={0.03} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </>
  );
}
