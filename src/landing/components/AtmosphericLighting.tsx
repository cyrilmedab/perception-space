import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Atmospheric Lighting System
 * Creates a magical, wonder-evoking environment with:
 * - Soft ambient fill
 * - Animated colored point lights for rim effects
 * - Subtle pulsing for life and magic
 */

// Light configuration for magical atmosphere
const LIGHTS_CONFIG = {
  // Main ambient - brighter base
  ambient: { intensity: 0.5, color: '#1a1a2e' },

  // Primary key light - warm white from above-right
  key: {
    position: [8, 15, 10] as [number, number, number],
    intensity: 1.0,
    color: '#fff5f0'
  },

  // Fill light - soft blue from left
  fill: {
    position: [-10, 5, 8] as [number, number, number],
    intensity: 0.5,
    color: '#4a7fff'
  },

  // Accent lights - magical colored rim lights
  accents: [
    { position: [6, 0, -5], color: '#7c3aed', intensity: 0.4 }, // Purple
    { position: [-6, -10, -3], color: '#06b6d4', intensity: 0.35 }, // Cyan
    { position: [0, -20, -8], color: '#ec4899', intensity: 0.3 }, // Pink
    { position: [-8, -30, -4], color: '#10b981', intensity: 0.25 }, // Emerald
  ] as Array<{ position: [number, number, number], color: string, intensity: number }>,
}

export function AtmosphericLighting() {
  const accentRefs = useRef<THREE.PointLight[]>([])
  const timeRef = useRef(0)

  // Animate accent lights with gentle pulsing and movement
  useFrame((_, delta) => {
    timeRef.current += delta

    accentRefs.current.forEach((light, i) => {
      if (light) {
        // Subtle intensity pulsing at different frequencies
        const pulseSpeed = 0.5 + i * 0.15
        const pulseAmount = 0.15
        const basIntensity = LIGHTS_CONFIG.accents[i].intensity
        light.intensity = basIntensity + Math.sin(timeRef.current * pulseSpeed) * pulseAmount

        // Gentle position drift for organic feel
        const driftSpeed = 0.2 + i * 0.05
        const driftAmount = 0.5
        const basePos = LIGHTS_CONFIG.accents[i].position
        light.position.x = basePos[0] + Math.sin(timeRef.current * driftSpeed) * driftAmount
        light.position.z = basePos[2] + Math.cos(timeRef.current * driftSpeed * 0.7) * driftAmount
      }
    })
  })

  return (
    <>
      {/* Soft ambient base */}
      <ambientLight
        intensity={LIGHTS_CONFIG.ambient.intensity}
        color={LIGHTS_CONFIG.ambient.color}
      />

      {/* Primary key light - soft directional */}
      <directionalLight
        position={LIGHTS_CONFIG.key.position}
        intensity={LIGHTS_CONFIG.key.intensity}
        color={LIGHTS_CONFIG.key.color}
        castShadow={false}
      />

      {/* Fill light - blue tint from the side */}
      <pointLight
        position={LIGHTS_CONFIG.fill.position}
        intensity={LIGHTS_CONFIG.fill.intensity}
        color={LIGHTS_CONFIG.fill.color}
        distance={30}
        decay={2}
      />

      {/* Magical accent lights */}
      {LIGHTS_CONFIG.accents.map((accent, i) => (
        <pointLight
          key={i}
          ref={(el) => { if (el) accentRefs.current[i] = el }}
          position={accent.position}
          intensity={accent.intensity}
          color={accent.color}
          distance={20}
          decay={2}
        />
      ))}

      {/* Distant backlight for depth */}
      <pointLight
        position={[0, -15, -20]}
        intensity={0.2}
        color="#4a9eff"
        distance={50}
        decay={1.5}
      />
    </>
  )
}

/**
 * Enhanced fog that shifts slightly based on scroll
 * Creates depth and mystery
 */
export function MagicalFog() {
  const fogRef = useRef<THREE.Fog>(null)

  // Color palette for fog - subtle gradient feel
  const fogColor = useMemo(() => new THREE.Color('#0a0a12'), [])

  useFrame(() => {
    // Could animate fog density/color based on scroll position
    // For now, keeping it static but ready for enhancement
  })

  return (
    <>
      <fog ref={fogRef} attach="fog" args={[fogColor, 6, 40]} />
      <color attach="background" args={['#050508']} />
      {/* Aurora gradient background */}
      <AuroraGradient />
    </>
  )
}

/**
 * Aurora Gradient Mesh
 * Slow-shifting violet/cyan/rose gradient in the background
 */
function AuroraGradient() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  // Custom shader for smooth gradient animation
  const shaderData = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#7c3aed') }, // Violet
      uColor2: { value: new THREE.Color('#06b6d4') }, // Cyan
      uColor3: { value: new THREE.Color('#ec4899') }, // Rose
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      varying vec2 vUv;

      void main() {
        // Slow-moving gradient based on time
        float t1 = sin(uTime * 0.1 + vUv.x * 2.0) * 0.5 + 0.5;
        float t2 = cos(uTime * 0.08 + vUv.y * 1.5) * 0.5 + 0.5;

        // Mix colors based on position and time
        vec3 color = mix(uColor1, uColor2, t1);
        color = mix(color, uColor3, t2 * 0.5);

        // Fade opacity towards edges for softer look
        float opacity = 0.08 * (1.0 - abs(vUv.y - 0.5) * 1.5);
        opacity *= (1.0 - abs(vUv.x - 0.5) * 1.2);

        gl_FragColor = vec4(color, opacity);
      }
    `,
  }), [])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh ref={meshRef} position={[0, -14, -25]} rotation={[0, 0, 0]}>
      <planeGeometry args={[60, 50, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        args={[shaderData]}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
