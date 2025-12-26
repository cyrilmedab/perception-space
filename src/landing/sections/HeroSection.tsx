import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
import { useSpring, animated, config } from '@react-spring/three'
import { meta } from '@/core/content'
import type { Group, Mesh } from 'three'
import * as THREE from 'three'

// Hero is at Y=0 in the scene
const HERO_Y = 0

export function HeroSection() {
  const groupRef = useRef<Group>(null)
  const glowRef = useRef<Mesh>(null)

  // Entrance animation
  const { scale } = useSpring({
    from: { scale: 0.9 },
    to: { scale: 1 },
    delay: 300,
    config: { ...config.gentle, tension: 80, friction: 20 },
  })

  // Subtle rotation and glow animation
  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.03
    }

    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.03 + Math.sin(t * 0.5) * 0.015
      glowRef.current.scale.setScalar(1 + Math.sin(t * 0.3) * 0.05)
    }
  })

  return (
    <animated.group
      ref={groupRef}
      position={[0, HERO_Y, 0]}
      scale={scale}
    >
      {/* Background ethereal glow */}
      <mesh ref={glowRef} position={[0, 0, -3]}>
        <circleGeometry args={[4, 32]} />
        <meshBasicMaterial color="#4a9eff" transparent opacity={0.04} />
      </mesh>

      {/* Secondary glow ring */}
      <mesh position={[0, 0, -4]} rotation={[0, 0, 0]}>
        <ringGeometry args={[3.5, 4.5, 64]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.02} />
      </mesh>

      {/* Floating container for gentle animation */}
      <Float speed={2} rotationIntensity={0.08} floatIntensity={0.25}>
        {/* Name with subtle glow effect */}
        <group>
          {/* Glow behind text */}
          <Text
            position={[0, 0.5, -0.1]}
            fontSize={0.85}
            color="#4a9eff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={-0.02}
          >
            {meta.name}
            <meshBasicMaterial transparent opacity={0.15} />
          </Text>
          {/* Main text */}
          <Text
            position={[0, 0.5, 0]}
            fontSize={0.8}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={-0.02}
          >
            {meta.name}
          </Text>
        </group>

        {/* Title with accent color */}
        <Text
          position={[0, -0.3, 0]}
          fontSize={0.22}
          color="#a78bfa"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.04}
        >
          {meta.title}
        </Text>

        {/* Location indicator */}
        <Text
          position={[0, -0.65, 0]}
          fontSize={0.12}
          color="#5a5a6a"
          anchorX="center"
          anchorY="middle"
        >
          {meta.location}
        </Text>

        {/* Decorative line */}
        <mesh position={[0, -0.9, 0]}>
          <planeGeometry args={[1.5, 0.003]} />
          <meshBasicMaterial color="#4a9eff" transparent opacity={0.3} />
        </mesh>

        {/* Scroll indicator with animation */}
        <ScrollIndicator />
      </Float>

      {/* Enhanced ambient particles */}
      <EnhancedParticles />

      {/* Orbital accent rings */}
      <OrbitalRings />
    </animated.group>
  )
}

/**
 * Animated scroll indicator
 */
function ScrollIndicator() {
  const groupRef = useRef<Group>(null)
  const arrowRef = useRef<Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (arrowRef.current) {
      // Bobbing animation
      arrowRef.current.position.y = -0.25 + Math.sin(t * 2) * 0.05
      // Fade pulse
      const material = arrowRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.4 + Math.sin(t * 2) * 0.2
    }
  })

  return (
    <group ref={groupRef} position={[0, -1.4, 0]}>
      <Text
        fontSize={0.1}
        color="#4a4a5a"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        scroll to explore
      </Text>
      {/* Animated arrow */}
      <mesh ref={arrowRef} position={[0, -0.25, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.04, 0.08, 3]} />
        <meshBasicMaterial color="#4a9eff" transparent opacity={0.5} />
      </mesh>
      {/* Trail effect */}
      <mesh position={[0, -0.15, 0]}>
        <planeGeometry args={[0.02, 0.15]} />
        <meshBasicMaterial color="#4a9eff" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

/**
 * Enhanced floating particles with variety
 */
function EnhancedParticles() {
  const particlesRef = useRef<Group>(null)

  const particles = useMemo(() => {
    const colors = ['#4a9eff', '#7c3aed', '#ec4899', '#06b6d4']
    return Array.from({ length: 30 }, () => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 6 - 2,
      ] as [number, number, number],
      scale: Math.random() * 0.04 + 0.01,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 0.2 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.03

      particlesRef.current.children.forEach((child, i) => {
        const data = particles[i]
        // Individual particle movement
        child.position.y = data.position[1] + Math.sin(t * data.speed + data.phase) * 0.3
        child.position.x = data.position[0] + Math.sin(t * data.speed * 0.5 + data.phase) * 0.2

        // Twinkle effect
        const mesh = child as Mesh
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshBasicMaterial
          mat.opacity = 0.2 + Math.sin(t * 2 + data.phase) * 0.15
        }
      })
    }
  })

  return (
    <group ref={particlesRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[p.scale, 8, 8]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  )
}

/**
 * Subtle orbital accent rings
 */
function OrbitalRings() {
  const ringsRef = useRef<Mesh[]>([])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    ringsRef.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.x = Math.PI / 2 + Math.sin(t * 0.3 + i) * 0.1
        ring.rotation.z = t * 0.1 * (i % 2 === 0 ? 1 : -1)

        const material = ring.material as THREE.MeshBasicMaterial
        material.opacity = 0.05 + Math.sin(t * 0.5 + i * 0.5) * 0.02
      }
    })
  })

  return (
    <group position={[0, 0, -1]}>
      {[2.5, 3.2, 4].map((radius, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) ringsRef.current[i] = el }}
          rotation={[Math.PI / 2 + i * 0.2, 0, 0]}
        >
          <ringGeometry args={[radius - 0.02, radius, 64]} />
          <meshBasicMaterial
            color={i === 0 ? '#4a9eff' : i === 1 ? '#7c3aed' : '#ec4899'}
            transparent
            opacity={0.06}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
