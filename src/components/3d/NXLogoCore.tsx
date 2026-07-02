"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface NXLogoCoreProps {
  intensity?: number;
}

export function NXLogoCore({ intensity = 1 }: NXLogoCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const timer = useRef(new THREE.Timer());
  const texture = useTexture("/logo.jpg");

  // Mirrored clone for the back face so the logo reads correctly from both sides
  const backTexture = useMemo(() => {
    const t = texture.clone();
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.set(-1, 1);
    t.offset.set(1, 0);
    t.needsUpdate = true;
    return t;
  }, [texture]);

  useFrame(() => {
    if (!groupRef.current) return;
    timer.current.update();
    // ~12 seconds per full rotation
    groupRef.current.rotation.y = timer.current.getElapsed() * 0.52;
  });

  const size = 2.4;

  return (
    <group ref={groupRef}>
      {/* Front face */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={intensity}
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </mesh>

      {/* Back face — mirrored texture so logo reads correctly */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, 0, -0.01]}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          map={backTexture}
          transparent
          opacity={intensity}
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </mesh>

      {/* Inner glow ring */}
      <mesh>
        <torusGeometry args={[size * 0.54, 0.014, 16, 120]} />
        <meshBasicMaterial
          color="#c6ff00"
          transparent
          opacity={0.55 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer glow ring */}
      <mesh>
        <torusGeometry args={[size * 0.68, 0.007, 16, 120]} />
        <meshBasicMaterial
          color="#c6ff00"
          transparent
          opacity={0.22 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
