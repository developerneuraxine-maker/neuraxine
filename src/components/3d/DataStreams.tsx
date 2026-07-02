"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function DataStreams() {
  const groupRef = useRef<THREE.Group>(null);
  const timer = useRef(new THREE.Timer());

  const streams = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      x: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 20 - 5,
      speed: 0.5 + Math.random() * 1.5,
      height: 10 + Math.random() * 15,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    timer.current.update();
    const t = timer.current.getElapsed();
    groupRef.current.children.forEach((child, i) => {
      const stream = streams[i];
      child.position.y = ((t * stream.speed + stream.offset) % stream.height) - stream.height / 2;
    });
  });

  return (
    <group ref={groupRef}>
      {streams.map((stream, i) => (
        <mesh key={i} position={[stream.x, 0, stream.z]}>
          <cylinderGeometry args={[0.008, 0.008, 0.8, 4]} />
          <meshBasicMaterial color="#C6FF00" transparent opacity={0.15} />
        </mesh>
      ))}
    </group>
  );
}
