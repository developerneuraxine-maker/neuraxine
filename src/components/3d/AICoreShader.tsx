"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Glow disc: Gaussian radial-gradient via GLSL ─── */
const glowVert = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const glowFrag = `
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float d = length(uv);
    if (d >= 1.0) { gl_FragColor = vec4(0.0); return; }
    float glow = exp(-d * d * 2.0) * uIntensity;
    vec3 color = vec3(0.776, 1.0, 0.0) * glow;
    gl_FragColor = vec4(color, glow * 0.9);
  }
`;

/* ─── Core icosahedron Fresnel ─── */
const coreVert = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const coreFrag = `
  uniform float uIntensity;
  uniform vec2  uMouse;
  varying vec3 vNormal;
  void main() {
    vec3  neon    = vec3(0.776, 1.0, 0.0);
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0,0.0,1.0))), 1.6);
    float mg      = 1.0 + uMouse.x * 0.25 + uMouse.y * 0.15;
    float alpha   = fresnel * 0.9 * uIntensity;
    gl_FragColor  = vec4(neon * fresnel * mg * uIntensity, alpha);
  }
`;

interface AICoreShaderProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  intensity?: number;
}

export function AICoreShader({ mouse, intensity = 1 }: AICoreShaderProps) {
  const coreRef  = useRef<THREE.Mesh>(null);
  const glowRef1 = useRef<THREE.Mesh>(null);
  const glowRef2 = useRef<THREE.Mesh>(null);

  const coreUniforms = useMemo(() => ({
    uIntensity: { value: intensity },
    uMouse:     { value: new THREE.Vector2(0, 0) },
  }), [intensity]);

  const glow1Uniforms = useMemo(() => ({ uIntensity: { value: intensity } }), [intensity]);
  const glow2Uniforms = useMemo(() => ({ uIntensity: { value: intensity * 0.45 } }), [intensity]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (coreRef.current) {
      const m = coreRef.current.material as THREE.ShaderMaterial;
      m.uniforms.uIntensity.value = intensity;
      m.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
      coreRef.current.rotation.y = t * 0.12;
      coreRef.current.rotation.x = t * 0.07;
    }
    if (glowRef1.current) {
      (glowRef1.current.material as THREE.ShaderMaterial).uniforms.uIntensity.value = intensity;
    }
    if (glowRef2.current) {
      (glowRef2.current.material as THREE.ShaderMaterial).uniforms.uIntensity.value = intensity * 0.45;
    }
  });

  return (
    <group>
      {/* Large outer glow disc (billboard) */}
      <mesh ref={glowRef2}>
        <planeGeometry args={[18, 18]} />
        <shaderMaterial
          vertexShader={glowVert}
          fragmentShader={glowFrag}
          uniforms={glow2Uniforms}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner tight glow disc (billboard) */}
      <mesh ref={glowRef1}>
        <planeGeometry args={[8, 8]} />
        <shaderMaterial
          vertexShader={glowVert}
          fragmentShader={glowFrag}
          uniforms={glow1Uniforms}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Core spinning icosahedron with Fresnel rim */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.9, 4]} />
        <shaderMaterial
          vertexShader={coreVert}
          fragmentShader={coreFrag}
          uniforms={coreUniforms}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      <pointLight color="#C6FF00" intensity={4 * intensity} distance={15} />
    </group>
  );
}
