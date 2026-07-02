"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NEON = new THREE.Color("#C6FF00");

function LoaderCore() {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const timer = useRef(new THREE.Timer());

  const nodes = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const phi = Math.acos(2 * (i / 24) - 1);
      const theta = (i / 24) * Math.PI * 2 * 3;
      const r = 1.1;
      return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    });
  }, []);

  const lineGeometry = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const next = (i + 3) % nodes.length;
      positions.push(nodes[i].x, nodes[i].y, nodes[i].z);
      positions.push(nodes[next].x, nodes[next].y, nodes[next].z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [nodes]);

  useFrame(() => {
    timer.current.update();
    const t = timer.current.getElapsed();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.35;
      groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.15;
    }
    if (pulseRef.current) {
      const scale = 1 + Math.sin(t * 3) * 0.08;
      pulseRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={pulseRef}>
        <icosahedronGeometry args={[0.55, 2]} />
        <meshStandardMaterial color="#050505" emissive={NEON} emissiveIntensity={0.6} wireframe />
      </mesh>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={NEON} transparent opacity={0.5} />
      </lineSegments>
      {nodes.map((node, i) => (
        <mesh key={i} position={node}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color={NEON} />
        </mesh>
      ))}
      <pointLight color={NEON} intensity={3} distance={6} />
    </group>
  );
}

export function LoaderNeuralScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      style={{ width: 128, height: 128 }}
    >
      <ambientLight intensity={0.2} />
      <LoaderCore />
    </Canvas>
  );
}
