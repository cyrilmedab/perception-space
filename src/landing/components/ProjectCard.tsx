import { useState, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, RoundedBox } from '@react-three/drei'
import { useSpring, animated, config } from '@react-spring/three'
import { useExperienceStore } from '@/core/state/useExperienceStore'
import type { Project } from '@/core/types'
import type { Group, Mesh } from 'three'
import * as THREE from 'three'

interface ProjectCardProps {
  project: Project
  position: [number, number, number]
  rotation?: [number, number, number]
  index?: number
}

// Card dimensions
const CARD_WIDTH = 2.5
const CARD_HEIGHT = 1.6
const CARD_DEPTH = 0.05

// Color palette for focus area accents
const FOCUS_COLORS: Record<string, string> = {
  'xr-systems': '#7c3aed',    // Purple
  'networking': '#06b6d4',    // Cyan
  'performance': '#10b981',   // Emerald
  'spatial-ui': '#ec4899',    // Pink
  'experimental': '#f59e0b',  // Amber
}

export function ProjectCard({
  project,
  position,
  rotation = [0, 0, 0],
  index = 0,
}: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<Group>(null)
  const glowRef = useRef<Mesh>(null)
  const sparkleRefs = useRef<Mesh[]>([])
  const setSelectedProject = useExperienceStore((s) => s.setSelectedProject)

  // Get accent color based on primary focus
  const accentColor = useMemo(() => {
    const primaryFocus = project.focus[0]
    return FOCUS_COLORS[primaryFocus] || '#4a9eff'
  }, [project.focus])

  // Spring animation for smooth, bouncy hover
  const { scale, glowOpacity, cardZ } = useSpring({
    scale: hovered ? 1.08 : 1,
    glowOpacity: hovered ? 0.5 : 0.15,
    cardZ: hovered ? 0.3 : 0,
    config: { ...config.wobbly, tension: 300, friction: 20 },
  })

  // Animate sparkles and glow
  useFrame((state) => {
    const t = state.clock.elapsedTime + index * 0.5

    // Pulsing glow border
    if (glowRef.current) {
      const basePulse = 0.02 + Math.sin(t * 2) * 0.01
      glowRef.current.scale.set(1 + basePulse, 1 + basePulse, 1)
    }

    // Animate sparkle particles when hovered
    sparkleRefs.current.forEach((sparkle, i) => {
      if (sparkle && hovered) {
        const angle = t * 2 + (i / 4) * Math.PI * 2
        const radius = 0.08 + Math.sin(t * 3 + i) * 0.02
        sparkle.position.x = Math.cos(angle) * radius * (CARD_WIDTH + 0.2)
        sparkle.position.y = Math.sin(angle) * radius * (CARD_HEIGHT + 0.2)
        sparkle.scale.setScalar(0.03 + Math.sin(t * 4 + i) * 0.015)
        const mat = sparkle.material as THREE.MeshBasicMaterial
        mat.opacity = 0.6 + Math.sin(t * 5 + i) * 0.3
      }
    })
  })

  const handleClick = () => {
    setSelectedProject(project.id)
  }

  const handlePointerOver = () => {
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setHovered(false)
    document.body.style.cursor = 'auto'
  }

  return (
    <animated.group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      position-z={cardZ}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Card background with glass-like material */}
      <RoundedBox
        args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]}
        radius={0.08}
        smoothness={4}
      >
        <meshStandardMaterial
          color={hovered ? '#1a1a2e' : '#0f0f18'}
          metalness={0.15}
          roughness={0.85}
          envMapIntensity={0.5}
        />
      </RoundedBox>

      {/* Inner glow layer */}
      <animated.mesh position={[0, 0, CARD_DEPTH / 2 + 0.002]}>
        <planeGeometry args={[CARD_WIDTH - 0.1, CARD_HEIGHT - 0.1]} />
        <animated.meshBasicMaterial
          color={accentColor}
          transparent
          opacity={glowOpacity.to((o) => o * 0.15)}
        />
      </animated.mesh>

      {/* Magical glow border */}
      <mesh ref={glowRef} position={[0, 0, -0.01]}>
        <planeGeometry args={[CARD_WIDTH + 0.15, CARD_HEIGHT + 0.15]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.15} />
      </mesh>

      {/* Sparkle particles (visible on hover) */}
      {hovered && [0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) sparkleRefs.current[i] = el }}
          position={[0, 0, CARD_DEPTH / 2 + 0.02]}
        >
          <circleGeometry args={[0.03, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Thumbnail placeholder with gradient feel */}
      <mesh position={[0, 0.25, CARD_DEPTH / 2 + 0.01]}>
        <planeGeometry args={[CARD_WIDTH - 0.3, 0.8]} />
        <meshStandardMaterial
          color="#1a1a2a"
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>

      {/* Thumbnail inner glow */}
      <mesh position={[0, 0.25, CARD_DEPTH / 2 + 0.015]}>
        <planeGeometry args={[CARD_WIDTH - 0.4, 0.7]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.05} />
      </mesh>

      {/* Project title */}
      <Text
        position={[0, -0.35, CARD_DEPTH / 2 + 0.01]}
        fontSize={0.14}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={CARD_WIDTH - 0.4}
      >
        {project.title}
      </Text>

      {/* Project subtitle */}
      <Text
        position={[0, -0.55, CARD_DEPTH / 2 + 0.01]}
        fontSize={0.09}
        color="#8a8a9a"
        anchorX="center"
        anchorY="middle"
        maxWidth={CARD_WIDTH - 0.4}
      >
        {project.subtitle || ''}
      </Text>

      {/* Awards indicator with glow */}
      {project.awards && project.awards.length > 0 && (
        <group position={[CARD_WIDTH / 2 - 0.2, CARD_HEIGHT / 2 - 0.15, CARD_DEPTH / 2 + 0.01]}>
          {/* Glow */}
          <mesh position={[0, 0, -0.01]}>
            <circleGeometry args={[0.12, 16]} />
            <meshBasicMaterial color="#ffd700" transparent opacity={0.2} />
          </mesh>
          {/* Core */}
          <mesh>
            <circleGeometry args={[0.06, 16]} />
            <meshBasicMaterial color="#ffd700" />
          </mesh>
          {/* Star shape */}
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.06}
            color="#000000"
            anchorX="center"
            anchorY="middle"
          >
            ★
          </Text>
        </group>
      )}

      {/* Focus tags with colored accents */}
      <group position={[-CARD_WIDTH / 2 + 0.25, -CARD_HEIGHT / 2 + 0.12, CARD_DEPTH / 2 + 0.01]}>
        {project.focus.slice(0, 2).map((tag, i) => (
          <group key={tag} position={[i * 0.7, 0, 0]}>
            {/* Tag background */}
            <mesh position={[0.25, 0, -0.005]}>
              <planeGeometry args={[0.55, 0.12]} />
              <meshBasicMaterial
                color={FOCUS_COLORS[tag] || '#4a9eff'}
                transparent
                opacity={0.15}
              />
            </mesh>
            <Text
              fontSize={0.055}
              color={FOCUS_COLORS[tag] || '#4a9eff'}
              anchorX="left"
              anchorY="middle"
            >
              {tag}
            </Text>
          </group>
        ))}
      </group>
    </animated.group>
  )
}
