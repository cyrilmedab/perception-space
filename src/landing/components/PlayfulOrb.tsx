import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useSpring, animated, config } from '@react-spring/three'
import type { Group, Mesh } from 'three'
import * as THREE from 'three'

/**
 * PlayfulOrb
 * A magical crystal orb that responds to hover and click interactions
 * Creates a sense of wonder and playfulness in the scene
 */

interface PlayfulOrbProps {
  position: [number, number, number]
  size?: number
  color?: string
  secondaryColor?: string
}

export function PlayfulOrb({
  position,
  size = 0.4,
  color = '#7c3aed',
  secondaryColor = '#4a9eff',
}: PlayfulOrbProps) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const groupRef = useRef<Group>(null)
  const coreRef = useRef<Mesh>(null)
  const ringsRef = useRef<Mesh[]>([])
  const particlesRef = useRef<Mesh[]>([])

  // Spring animations
  const { scale, rotationSpeed, glowIntensity } = useSpring({
    scale: clicked ? 1.5 : hovered ? 1.2 : 1,
    rotationSpeed: clicked ? 3 : hovered ? 1.5 : 0.5,
    glowIntensity: clicked ? 0.8 : hovered ? 0.5 : 0.3,
    config: clicked ? config.wobbly : config.gentle,
  })

  // Generate orbital particles
  const orbitalParticles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * Math.PI * 2,
      radius: size * 1.5 + Math.random() * size * 0.5,
      speed: 0.5 + Math.random() * 0.5,
      size: 0.02 + Math.random() * 0.03,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [size])

  // Animation
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const currentRotSpeed = rotationSpeed.get()

    // Rotate core
    if (coreRef.current) {
      coreRef.current.rotation.y = t * currentRotSpeed
      coreRef.current.rotation.x = Math.sin(t * 0.5) * 0.2
    }

    // Animate rings
    ringsRef.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.x = Math.PI / 2 + Math.sin(t * 0.5 + i) * 0.3
        ring.rotation.y = t * currentRotSpeed * (i % 2 === 0 ? 1 : -1) * 0.5
        ring.rotation.z = t * 0.3 + i * (Math.PI / 3)

        const material = ring.material as THREE.MeshBasicMaterial
        material.opacity = 0.2 + Math.sin(t * 2 + i) * 0.1
      }
    })

    // Animate orbital particles
    particlesRef.current.forEach((particle, i) => {
      if (particle) {
        const data = orbitalParticles[i]
        const angle = data.angle + t * data.speed * currentRotSpeed
        particle.position.x = Math.cos(angle) * data.radius
        particle.position.y = Math.sin(angle) * data.radius * 0.5
        particle.position.z = Math.sin(angle) * data.radius * 0.3

        const pulseScale = data.size * (1 + Math.sin(t * 4 + data.phase) * 0.3)
        particle.scale.setScalar(pulseScale * (hovered ? 1.5 : 1))

        const material = particle.material as THREE.MeshBasicMaterial
        material.opacity = 0.4 + Math.sin(t * 3 + data.phase) * 0.3
      }
    })

    // Subtle group float
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.1
    }
  })

  const handleClick = () => {
    setClicked(true)
    setTimeout(() => setClicked(false), 800)
  }

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
      <animated.group
        ref={groupRef}
        position={position}
        scale={scale}
        onClick={handleClick}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      >
        {/* Outer glow */}
        <animated.mesh>
          <sphereGeometry args={[size * 2, 16, 16]} />
          <animated.meshBasicMaterial
            color={color}
            transparent
            opacity={glowIntensity.to((i) => i * 0.15)}
            depthWrite={false}
          />
        </animated.mesh>

        {/* Inner glow layer */}
        <mesh>
          <sphereGeometry args={[size * 1.3, 16, 16]} />
          <meshBasicMaterial
            color={secondaryColor}
            transparent
            opacity={0.1}
            depthWrite={false}
          />
        </mesh>

        {/* Crystal core */}
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[size, 1]} />
          <meshStandardMaterial
            color={color}
            metalness={0.8}
            roughness={0.2}
            emissive={color}
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Inner bright core */}
        <mesh>
          <icosahedronGeometry args={[size * 0.6, 0]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>

        {/* Orbital rings */}
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            ref={(el) => { if (el) ringsRef.current[i] = el }}
          >
            <ringGeometry args={[size * (1.2 + i * 0.3), size * (1.25 + i * 0.3), 32]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? color : secondaryColor}
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        {/* Orbital particles */}
        {orbitalParticles.map((_, i) => (
          <mesh
            key={i}
            ref={(el) => { if (el) particlesRef.current[i] = el }}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? color : secondaryColor}
              transparent
              opacity={0.5}
            />
          </mesh>
        ))}
      </animated.group>
    </Float>
  )
}

/**
 * Collection of playful orbs placed throughout the scene
 */
export function PlayfulOrbs() {
  return (
    <>
      {/* Hero area orb - larger, prominent */}
      <PlayfulOrb
        position={[3.5, 1, -2]}
        size={0.35}
        color="#7c3aed"
        secondaryColor="#ec4899"
      />

      {/* Projects section accent */}
      <PlayfulOrb
        position={[-4, -12, -3]}
        size={0.25}
        color="#06b6d4"
        secondaryColor="#4a9eff"
      />

      {/* Career section accent */}
      <PlayfulOrb
        position={[4.5, -26, -2.5]}
        size={0.3}
        color="#10b981"
        secondaryColor="#a855f7"
      />
    </>
  )
}
