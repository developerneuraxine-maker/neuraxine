"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface NXCoinProps {
  intensity?: number;
  spinning?: boolean;
}

export function NXCoin({ intensity = 1, spinning = false }: NXCoinProps) {
  const spinRef     = useRef<THREE.Group>(null);
  const backdropRef = useRef<THREE.MeshBasicMaterial>(null);
  const angleRef    = useRef(0);
  const timer = useRef(new THREE.Timer());

  const texture = useTexture("/logo.jpg");

  const backTexture = useMemo(() => {
    const t = texture.clone();
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.set(-1, 1);
    t.offset.set(1, 0);
    t.needsUpdate = true;
    return t;
  }, [texture]);

  useFrame((_, delta) => {
    if (!spinRef.current) return;
    timer.current.update();

    // Smooth backdrop fade-in when spinning starts
    if (backdropRef.current) {
      const target = spinning ? 0.82 * intensity : 0;
      backdropRef.current.opacity = THREE.MathUtils.lerp(
        backdropRef.current.opacity,
        target,
        delta * 5
      );
    }

    if (spinning) {
      angleRef.current += delta * 0.52; // ~12 s per full rotation
      spinRef.current.rotation.y = angleRef.current;
      spinRef.current.position.y = Math.sin(timer.current.getElapsed() * 0.4) * 0.06;
    } else {
      spinRef.current.rotation.y = 0;
      spinRef.current.position.y = 0;
    }
  });

  const radius = 1.5;

  return (
    <group ref={spinRef}>
      {/* Dark backdrop circle — fades in when coin starts spinning */}
      <mesh position={[0, 0, -0.15]}>
        <circleGeometry args={[radius + 0.55, 64]} />
        <meshBasicMaterial
          ref={backdropRef}
          color="#000000"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* Front face — logo toward camera */}
      <mesh position={[0, 0, 0.07]}>
        <circleGeometry args={[radius, 64]} />
        <meshBasicMaterial map={texture} side={THREE.FrontSide} />
      </mesh>

      {/* Back face — mirrored logo */}
      <mesh position={[0, 0, -0.07]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[radius, 64]} />
        <meshBasicMaterial map={backTexture} side={THREE.FrontSide} />
      </mesh>

      {/* Gold coin rim */}
      <mesh>
        <torusGeometry args={[radius, 0.055, 16, 100]} />
        <meshBasicMaterial color="#c8a843" />
      </mesh>

      {/* Neon glow rim */}
      <mesh>
        <torusGeometry args={[radius + 0.06, 0.022, 16, 120]} />
        <meshBasicMaterial
          color="#c6ff00"
          transparent
          opacity={0.6 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer soft ring */}
      <mesh>
        <torusGeometry args={[radius + 0.24, 0.009, 16, 120]} />
        <meshBasicMaterial
          color="#c6ff00"
          transparent
          opacity={0.2 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
