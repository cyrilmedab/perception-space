import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float, RoundedBox, Html } from '@react-three/drei'
import { meta } from '@/core/content'
import type { Group, Mesh } from 'three'
import * as THREE from 'three'

// Contact section at Y=-32
const SECTION_Y = -32

/**
 * Contact Section
 * Magical reveal with floating contact options and ethereal styling
 */
export function ContactSection() {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.08
    }
  })

  return (
    <group ref={groupRef} position={[0, SECTION_Y, 0]}>
      {/* Ethereal background glow */}
      <EtherealGlow />

      {/* Section header */}
      <Float speed={1.5} rotationIntensity={0.03} floatIntensity={0.15}>
        <Text
          position={[0, 2, 0]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
        >
          Let's Connect
        </Text>
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.12}
          color="#6a6a7a"
          anchorX="center"
          anchorY="middle"
        >
          Open to opportunities in XR/spatial computing
        </Text>
      </Float>

      {/* Contact cards */}
      <ContactLinks />

      {/* Floating decorative elements */}
      <FloatingOrbs />

      {/* Footer */}
      <Float speed={1} rotationIntensity={0.01} floatIntensity={0.08}>
        <Text
          position={[0, -3.5, 0]}
          fontSize={0.08}
          color="#4a4a5a"
          anchorX="center"
          anchorY="middle"
        >
          {meta.name} • {new Date().getFullYear()}
        </Text>
        <Text
          position={[0, -3.8, 0]}
          fontSize={0.06}
          color="#3a3a4a"
          anchorX="center"
          anchorY="middle"
        >
          Built with React Three Fiber
        </Text>
      </Float>
    </group>
  )
}

/**
 * Ethereal background glow effect
 */
function EtherealGlow() {
  const glowRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.04 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05)
    }
  })

  return (
    <mesh ref={glowRef} position={[0, 0, -8]}>
      <circleGeometry args={[6, 32]} />
      <meshBasicMaterial color="#4a9eff" transparent opacity={0.05} />
    </mesh>
  )
}

/**
 * Contact link cards with magical hover
 */
function ContactLinks() {
  const links = [
    {
      label: 'LinkedIn',
      icon: '💼',
      url: meta.links.linkedin,
      color: '#0077b5',
      position: [-2, 0, 0] as [number, number, number]
    },
    {
      label: 'GitHub',
      icon: '⚡',
      url: meta.links.github,
      color: '#7c3aed',
      position: [0, -0.3, 0.5] as [number, number, number]
    },
    {
      label: 'Email',
      icon: '✉️',
      url: `mailto:${meta.email}`,
      color: '#ec4899',
      position: [2, 0, 0] as [number, number, number]
    }
  ]

  return (
    <group position={[0, -0.5, 0]}>
      {links.map((link, index) => (
        <ContactCard
          key={link.label}
          {...link}
          index={index}
        />
      ))}
    </group>
  )
}

/**
 * Individual contact card with magical hover
 */
interface ContactCardProps {
  label: string
  icon: string
  url: string
  color: string
  position: [number, number, number]
  index: number
}

function ContactCard({ label, icon, url, color, position, index }: ContactCardProps) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<Group>(null)
  const glowRef = useRef<Mesh>(null)
  const ringRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (groupRef.current) {
      const targetScale = hovered ? 1.1 : 1
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15)
    }
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      const targetOpacity = hovered ? 0.5 : 0.2
      material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.1)
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5 + index
      const material = ringRef.current.material as THREE.MeshBasicMaterial
      material.opacity = hovered ? 0.6 : 0.2
    }
  })

  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Float speed={1.5 + index * 0.2} rotationIntensity={0.02} floatIntensity={0.12}>
      <group
        ref={groupRef}
        position={position}
        onClick={handleClick}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      >
        {/* Card background */}
        <RoundedBox args={[1.4, 1.4, 0.05]} radius={0.1} smoothness={4}>
          <meshStandardMaterial
            color={hovered ? '#1a1a2e' : '#0f0f18'}
            metalness={0.1}
            roughness={0.9}
          />
        </RoundedBox>

        {/* Glow effect */}
        <mesh ref={glowRef} position={[0, 0, -0.02]}>
          <circleGeometry args={[0.9, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>

        {/* Decorative ring */}
        <mesh ref={ringRef} position={[0, 0, 0.03]}>
          <ringGeometry args={[0.55, 0.58, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>

        {/* Icon (using HTML for emoji support) */}
        <Html position={[0, 0.15, 0.05]} center transform sprite>
          <div style={{
            fontSize: '2rem',
            filter: hovered ? 'brightness(1.3)' : 'brightness(1)',
            transition: 'filter 0.2s ease'
          }}>
            {icon}
          </div>
        </Html>

        {/* Label */}
        <Text
          position={[0, -0.4, 0.03]}
          fontSize={0.12}
          color={hovered ? color : '#8a8a9a'}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </Float>
  )
}

/**
 * Decorative floating orbs
 */
function FloatingOrbs() {
  const orbsRef = useRef<Group>(null)

  const orbs = useMemo(() => [
    { position: [-4, 1, -3], color: '#4a9eff', size: 0.15 },
    { position: [4, 0.5, -2], color: '#7c3aed', size: 0.12 },
    { position: [-3, -2, -4], color: '#ec4899', size: 0.1 },
    { position: [3.5, -1.5, -3], color: '#06b6d4', size: 0.08 },
    { position: [0, 2.5, -5], color: '#a855f7', size: 0.18 },
  ], [])

  useFrame((state) => {
    if (orbsRef.current) {
      orbsRef.current.children.forEach((orb, i) => {
        orb.position.y = orbs[i].position[1] + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.3
        orb.position.x = orbs[i].position[0] + Math.sin(state.clock.elapsedTime * 0.3 + i * 2) * 0.2
      })
    }
  })

  return (
    <group ref={orbsRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position as [number, number, number]}>
          <sphereGeometry args={[orb.size, 16, 16]} />
          <meshBasicMaterial color={orb.color} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  )
}
