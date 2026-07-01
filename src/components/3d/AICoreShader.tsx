"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uIntensity;
  uniform vec2 uMouse;
  varying vec3 vNormal;

  void main() {
    vec3 neon = vec3(0.776, 1.0, 0.0);
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.8);
    float mouseGlow = 1.0 + uMouse.x * 0.3 + uMouse.y * 0.2;
    vec3 color = neon * fresnel * mouseGlow * uIntensity;
    float alpha = fresnel * 0.85 * uIntensity;
    gl_FragColor = vec4(color, alpha);
  }
`;

interface AICoreShaderProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  intensity?: number;
}

export function AICoreShader({ mouse, intensity = 1 }: AICoreShaderProps) {
  const groupRef = useRef<THREE.Group>(null);

  const uniforms = useMemo(
    () => ({
      uIntensity: { value: intensity },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    [intensity]
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const innerMesh = groupRef.current.children[0] as THREE.Mesh;
    if (innerMesh?.material) {
      const mat = innerMesh.material as THREE.ShaderMaterial;
      mat.uniforms.uIntensity.value = intensity;
      mat.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
    }
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Core icosahedron with Fresnel shader */}
      <mesh>
        <icosahedronGeometry args={[0.9, 4]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glow ring 1 — tight */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#C6FF00"
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glow ring 2 — medium */}
      <mesh>
        <sphereGeometry args={[3.0, 32, 32]} />
        <meshBasicMaterial
          color="#C6FF00"
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glow ring 3 — large atmosphere */}
      <mesh>
        <sphereGeometry args={[5.5, 32, 32]} />
        <meshBasicMaterial
          color="#C6FF00"
          transparent
          opacity={0.018}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer atmosphere haze — camera is inside this sphere */}
      <mesh>
        <sphereGeometry args={[8.5, 32, 32]} />
        <meshBasicMaterial
          color="#C6FF00"
          transparent
          opacity={0.007}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      <pointLight color="#C6FF00" intensity={3 * intensity} distance={12} />
    </group>
  );
}
