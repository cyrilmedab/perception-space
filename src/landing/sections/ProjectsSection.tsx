import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
import { ProjectCard } from '../components/ProjectCard'
import { projects } from '@/core/content'
import type { Group } from 'three'

// Projects section starts at Y=-10 in the scene
const SECTION_Y = -10

// Generate staggered 3D layout for cards
function getCardPosition(
  index: number
): { position: [number, number, number]; rotation: [number, number, number] } {
  // Two-column layout with stagger
  const col = index % 2
  const row = Math.floor(index / 2)

  // X position: left or right column
  const x = col === 0 ? -2.5 : 2.5

  // Y position: staggered rows
  const y = -row * 3.5

  // Z position: depth variation for parallax effect
  const z = -2 - (index % 3) * 1.5

  // Rotation: angle cards slightly toward center
  const rotationY = col === 0 ? 0.1 : -0.1

  return {
    position: [x, y, z],
    rotation: [0, rotationY, 0],
  }
}

export function ProjectsSection() {
  const groupRef = useRef<Group>(null)

  // Subtle ambient movement
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.x =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={[0, SECTION_Y, 0]}>
      {/* Section title */}
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <Text
          position={[0, 2, 0]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
        >
          Projects
        </Text>
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.12}
          color="#6a6a7a"
          anchorX="center"
          anchorY="middle"
        >
          XR systems, networking, and experimental work
        </Text>
      </Float>

      {/* Project cards in floating arrangement */}
      {projects.map((project, index) => {
        const { position, rotation } = getCardPosition(index)

        return (
          <Float
            key={project.id}
            speed={1.5 + index * 0.2}
            rotationIntensity={0.02}
            floatIntensity={0.15}
          >
            <ProjectCard
              project={project}
              position={position}
              rotation={rotation}
              index={index}
            />
          </Float>
        )
      })}

      {/* Decorative connecting lines between cards */}
      <ConnectionLines />
    </group>
  )
}

// Subtle decorative elements
function ConnectionLines() {
  return (
    <group>
      {/* Vertical guide line */}
      <mesh position={[0, -4, -3]}>
        <boxGeometry args={[0.01, 12, 0.01]} />
        <meshBasicMaterial color="#2a2a3a" transparent opacity={0.3} />
      </mesh>

      {/* Horizontal accents */}
      {[-2, -6, -10].map((y, i) => (
        <mesh key={i} position={[0, y, -3]}>
          <boxGeometry args={[6, 0.005, 0.005]} />
          <meshBasicMaterial color="#3a3a4a" transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  )
}
