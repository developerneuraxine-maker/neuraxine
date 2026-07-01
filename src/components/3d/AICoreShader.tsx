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
  varying vec3 vPosition;

  void main() {
    vec3 neon = vec3(0.776, 1.0, 0.0);
    float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
    float mouseGlow = 1.0 + uMouse.x * 0.3 + uMouse.y * 0.2;
    vec3 color = neon * fresnel * mouseGlow * uIntensity;
    float alpha = fresnel * 0.6 * uIntensity;
    gl_FragColor = vec4(color, alpha);
  }
`;

interface AICoreShaderProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  intensity?: number;
}

export function AICoreShader({ mouse, intensity = 1 }: AICoreShaderProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uIntensity: { value: intensity },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    [intensity]
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uIntensity.value = intensity;
    mat.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <mesh ref={meshRef} scale={1.15}>
      <icosahedronGeometry args={[0.65, 4]} />
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
  );
}
