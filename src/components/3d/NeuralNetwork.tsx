"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NEON = new THREE.Color("#C6FF00");

interface NeuralNetworkProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  intensity?: number;
}

export function NeuralNetwork({ mouse, intensity = 1 }: NeuralNetworkProps) {
  const groupRef = useRef<THREE.Group>(null);
  const timer = useRef(new THREE.Timer());
  const nodeCount = 80;
  const connectionCount = 120;

  const { nodes, connections } = useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = 1.2 + Math.random() * 0.8;
      nodes.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        )
      );
    }

    const connections: [number, number][] = [];
    for (let i = 0; i < connectionCount; i++) {
      const a = Math.floor(Math.random() * nodeCount);
      let b = Math.floor(Math.random() * nodeCount);
      while (b === a) b = Math.floor(Math.random() * nodeCount);
      if (nodes[a].distanceTo(nodes[b]) < 2.5) {
        connections.push([a, b]);
      }
    }
    return { nodes, connections };
  }, []);

  const lineGeometry = useMemo(() => {
    const positions: number[] = [];
    connections.forEach(([a, b]) => {
      positions.push(nodes[a].x, nodes[a].y, nodes[a].z);
      positions.push(nodes[b].x, nodes[b].y, nodes[b].z);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [nodes, connections]);

  const nodePositions = useMemo(() => {
    const arr = new Float32Array(nodeCount * 3);
    nodes.forEach((n, i) => {
      arr[i * 3] = n.x;
      arr[i * 3 + 1] = n.y;
      arr[i * 3 + 2] = n.z;
    });
    return arr;
  }, [nodes]);

  useFrame(() => {
    if (!groupRef.current) return;
    timer.current.update();
    const t = timer.current.getElapsed();
    groupRef.current.rotation.y = t * 0.15 + mouse.current.x * 0.3;
    groupRef.current.rotation.x = mouse.current.y * 0.2;
  });

  return (
    <group ref={groupRef} scale={intensity}>
      <mesh>
        <icosahedronGeometry args={[0.6, 2]} />
        <meshStandardMaterial
          color="#050505"
          emissive={NEON}
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.1}
          wireframe
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial
          color={NEON}
          emissive={NEON}
          emissiveIntensity={0.8}
          transparent
          opacity={0.15}
        />
      </mesh>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={NEON} transparent opacity={0.25} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={NEON} size={0.04} transparent opacity={0.9} sizeAttenuation />
      </points>
      <pointLight color={NEON} intensity={2 * intensity} distance={8} />
      <pointLight color="#ffffff" intensity={0.5} distance={6} position={[2, 2, 2]} />
    </group>
  );
}
