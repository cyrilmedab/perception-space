import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float, RoundedBox } from '@react-three/drei'
import { career } from '@/core/content'
import type { Group } from 'three'
import * as THREE from 'three'

// Career section at Y=-18
const SECTION_Y = -18

// Timeline configuration
const CARD_WIDTH = 3.2
const CARD_HEIGHT = 1.8
const CARD_DEPTH = 0.04
const CARD_SPACING = 4

/**
 * Career Section
 * Displays work experience as a floating timeline with magical styling
 */
export function CareerSection() {
  const groupRef = useRef<Group>(null)

  // Subtle ambient motion
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={[0, SECTION_Y, 0]}>
      {/* Section header */}
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <Text
          position={[0, 3, 0]}
          fontSize={0.4}
          color="#f0f0f5"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
        >
          Experience
        </Text>
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.12}
          color="#a0a0b0"
          anchorX="center"
          anchorY="middle"
        >
          Building the future of spatial computing
        </Text>
      </Float>

      {/* Glowing timeline line */}
      <TimelineLine />

      {/* Career cards */}
      {career.map((role, index) => (
        <CareerCard
          key={role.id}
          role={role}
          index={index}
          position={[
            index % 2 === 0 ? -2.2 : 2.2,
            -index * CARD_SPACING,
            -1.5 - index * 0.5
          ]}
          isLeft={index % 2 === 0}
        />
      ))}
    </group>
  )
}

/**
 * Glowing timeline line
 */
function TimelineLine() {
  const lineRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.15 + Math.sin(state.clock.elapsedTime) * 0.05
    }
  })

  return (
    <group position={[0, -CARD_SPACING * (career.length - 1) / 2, -2]}>
      {/* Main line */}
      <mesh ref={lineRef}>
        <boxGeometry args={[0.02, CARD_SPACING * career.length + 2, 0.02]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.4} />
      </mesh>

      {/* Glow effect */}
      <mesh ref={glowRef}>
        <boxGeometry args={[0.08, CARD_SPACING * career.length + 2, 0.02]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.15} />
      </mesh>

      {/* Timeline nodes */}
      {career.map((_, index) => (
        <TimelineNode
          key={index}
          position={[0, -index * CARD_SPACING + (CARD_SPACING * (career.length - 1) / 2), 0.01]}
        />
      ))}
    </group>
  )
}

/**
 * Individual timeline node marker
 */
function TimelineNode({ position }: { position: [number, number, number] }) {
  const nodeRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (nodeRef.current) {
      nodeRef.current.rotation.z = state.clock.elapsedTime * 0.5
    }
    if (ringRef.current) {
      const material = ringRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      ringRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1)
    }
  })

  return (
    <group position={position}>
      {/* Core diamond */}
      <mesh ref={nodeRef}>
        <octahedronGeometry args={[0.08, 0]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>
      {/* Pulsing ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.12, 0.15, 16]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

/**
 * Individual career card with hover effects
 */
interface CareerCardProps {
  role: typeof career[0]
  index: number
  position: [number, number, number]
  isLeft: boolean
}

function CareerCard({ role, index, position, isLeft }: CareerCardProps) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  // Smooth hover animation
  useFrame((state) => {
    if (groupRef.current) {
      const targetScale = hovered ? 1.03 : 1
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      const targetOpacity = hovered ? 0.4 : 0.15
      material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.1)

      // Gentle pulsing
      glowRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.02
    }
  })

  // Format period
  const formatPeriod = () => {
    const start = new Date(role.period.start)
    const end = new Date(role.period.end)
    const startStr = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    const endStr = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    return `${startStr} — ${endStr}`
  }

  return (
    <Float speed={1.2 + index * 0.1} rotationIntensity={0.02} floatIntensity={0.1}>
      <group
        ref={groupRef}
        position={position}
        rotation={[0, isLeft ? 0.08 : -0.08, 0]}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      >
        {/* Card background */}
        <RoundedBox
          args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]}
          radius={0.06}
          smoothness={4}
        >
          <meshStandardMaterial
            color={hovered ? '#1a1a2e' : '#0f0f18'}
            metalness={0.1}
            roughness={0.9}
          />
        </RoundedBox>

        {/* Glow border */}
        <mesh ref={glowRef} position={[0, 0, -0.01]}>
          <planeGeometry args={[CARD_WIDTH + 0.1, CARD_HEIGHT + 0.1]} />
          <meshBasicMaterial
            color={index === 0 ? '#a855f7' : index === 1 ? '#22d3ee' : '#fb7185'}
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Role title */}
        <Text
          position={[0, 0.5, CARD_DEPTH / 2 + 0.01]}
          fontSize={0.14}
          color="#f0f0f5"
          anchorX="center"
          anchorY="middle"
          maxWidth={CARD_WIDTH - 0.4}
        >
          {role.title}
        </Text>

        {/* Company */}
        <Text
          position={[0, 0.2, CARD_DEPTH / 2 + 0.01]}
          fontSize={0.12}
          color={index === 0 ? '#a855f7' : index === 1 ? '#22d3ee' : '#fb7185'}
          anchorX="center"
          anchorY="middle"
        >
          {role.company}
        </Text>

        {/* Period and location */}
        <Text
          position={[0, -0.05, CARD_DEPTH / 2 + 0.01]}
          fontSize={0.08}
          color="#a0a0b0"
          anchorX="center"
          anchorY="middle"
        >
          {formatPeriod()} • {role.location}
        </Text>

        {/* Highlights */}
        {role.highlights.slice(0, 2).map((highlight, i) => (
          <Text
            key={i}
            position={[-CARD_WIDTH / 2 + 0.25, -0.35 - i * 0.2, CARD_DEPTH / 2 + 0.01]}
            fontSize={0.07}
            color="#a0a0b0"
            anchorX="left"
            anchorY="middle"
            maxWidth={CARD_WIDTH - 0.5}
          >
            • {highlight}
          </Text>
        ))}

        {/* Decorative corner accent */}
        <mesh position={[CARD_WIDTH / 2 - 0.1, CARD_HEIGHT / 2 - 0.1, CARD_DEPTH / 2 + 0.01]}>
          <circleGeometry args={[0.04, 8]} />
          <meshBasicMaterial
            color={index === 0 ? '#a855f7' : index === 1 ? '#22d3ee' : '#fb7185'}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>
    </Float>
  )
}
