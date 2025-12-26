import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Magical Floating Particles
 * Creates dreamy, wonder-evoking ambient particles throughout the scene
 * - Orbs of varying sizes with soft glow
 * - Gentle floating motion with organic randomness
 * - Color shifts and subtle pulsing
 */

interface ParticleData {
  position: THREE.Vector3
  basePosition: THREE.Vector3
  velocity: THREE.Vector3
  scale: number
  color: THREE.Color
  phase: number
  speed: number
  glowIntensity: number
}

// Particle configuration
const CONFIG = {
  count: 60,
  spread: { x: 15, y: 40, z: 15 },
  yOffset: -15, // Center the particles around middle of scene
  minScale: 0.02,
  maxScale: 0.08,
  colors: [
    '#4a9eff', // Electric blue (primary)
    '#7c3aed', // Purple
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#a855f7', // Violet
    '#3b82f6', // Blue
  ],
}

export function MagicalParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const particlesRef = useRef<ParticleData[]>([])
  const timeRef = useRef(0)

  // Initialize particles
  const particles = useMemo(() => {
    const result: ParticleData[] = []
    const colorOptions = CONFIG.colors.map((c) => new THREE.Color(c))

    for (let i = 0; i < CONFIG.count; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * CONFIG.spread.x,
        (Math.random() - 0.5) * CONFIG.spread.y + CONFIG.yOffset,
        (Math.random() - 0.5) * CONFIG.spread.z - 5
      )

      result.push({
        position: position.clone(),
        basePosition: position.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.02
        ),
        scale: CONFIG.minScale + Math.random() * (CONFIG.maxScale - CONFIG.minScale),
        color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.4,
        glowIntensity: 0.3 + Math.random() * 0.7,
      })
    }

    particlesRef.current = result
    return result
  }, [])

  // Dummy for matrix updates
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const tempColor = useMemo(() => new THREE.Color(), [])

  // Animate particles
  useFrame((_state, delta) => {
    if (!meshRef.current) return
    timeRef.current += delta

    particles.forEach((particle, i) => {
      // Organic floating motion
      const t = timeRef.current * particle.speed + particle.phase

      // Combine base position with sinusoidal drift
      particle.position.x = particle.basePosition.x + Math.sin(t * 0.5) * 0.8
      particle.position.y = particle.basePosition.y + Math.sin(t * 0.3) * 0.4 + Math.cos(t * 0.7) * 0.2
      particle.position.z = particle.basePosition.z + Math.cos(t * 0.4) * 0.6

      // Scale pulsing for magical glow effect
      const pulsedScale = particle.scale * (1 + Math.sin(t * 2) * 0.2)

      // Update instance matrix
      dummy.position.copy(particle.position)
      dummy.scale.setScalar(pulsedScale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)

      // Update color with subtle shifts
      const colorShift = Math.sin(t * 0.5) * 0.1
      tempColor.copy(particle.color)
      tempColor.offsetHSL(colorShift * 0.05, 0, colorShift * 0.1)
      meshRef.current!.setColorAt(i, tempColor)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, CONFIG.count]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial transparent opacity={0.6} toneMapped={false} />
    </instancedMesh>
  )
}

/**
 * Sparkle trail effect for emphasis
 * Used near interactive elements
 */
interface SparkleProps {
  position: [number, number, number]
  count?: number
  spread?: number
  color?: string
}

export function Sparkles({ position, count = 15, spread = 2, color = '#4a9eff' }: SparkleProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const timeRef = useRef(0)

  const sparkleData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      offset: new THREE.Vector3(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread
      ),
      phase: Math.random() * Math.PI * 2,
      speed: 1 + Math.random() * 2,
      scale: 0.02 + Math.random() * 0.03,
    }))
  }, [count, spread])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((_state, delta) => {
    if (!meshRef.current) return
    timeRef.current += delta

    sparkleData.forEach((sparkle, i) => {
      const t = timeRef.current * sparkle.speed + sparkle.phase

      // Twinkle effect - appear and disappear
      const visibility = Math.pow(Math.sin(t) * 0.5 + 0.5, 2)
      const scale = sparkle.scale * visibility

      dummy.position.set(
        position[0] + sparkle.offset.x + Math.sin(t * 0.5) * 0.1,
        position[1] + sparkle.offset.y + Math.sin(t * 0.7) * 0.1,
        position[2] + sparkle.offset.z
      )
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} toneMapped={false} />
    </instancedMesh>
  )
}

/**
 * Ethereal ring effect
 * Animated concentric rings that pulse outward
 */
interface EtherealRingProps {
  position: [number, number, number]
  color?: string
  size?: number
}

export function EtherealRing({ position, color = '#4a9eff', size = 3 }: EtherealRingProps) {
  const ringRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (!ringRef.current) return
    timeRef.current += delta

    // Rotate slowly
    ringRef.current.rotation.x = Math.PI * 0.5 + Math.sin(timeRef.current * 0.3) * 0.1
    ringRef.current.rotation.z = timeRef.current * 0.1

    // Pulse opacity
    const material = ringRef.current.material as THREE.MeshBasicMaterial
    material.opacity = 0.1 + Math.sin(timeRef.current) * 0.05
  })

  return (
    <mesh ref={ringRef} position={position}>
      <ringGeometry args={[size * 0.9, size, 64]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
