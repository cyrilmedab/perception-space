import { useState, useRef, useMemo } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
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

// ID12-13: Animation constants
const BREATHING_SCALE_MIN = 1.0
const BREATHING_SCALE_MAX = 1.015
const BREATHING_SPEED = 1.5
const MAX_TILT_DEGREES = 8 // Maximum tilt in degrees

// Color palette for focus area accents (aurora theme)
const FOCUS_COLORS: Record<string, string> = {
  'xr-systems': '#a855f7',    // Violet
  'networking': '#22d3ee',    // Cyan
  'performance': '#fb7185',   // Rose
  'spatial-ui': '#a855f7',    // Violet
  'experimental': '#22d3ee',  // Cyan
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

  // ID13: Track tilt for magnetic effect
  const targetTilt = useRef({ x: 0, y: 0 })
  const currentTilt = useRef({ x: 0, y: 0 })

  // ID12: Breathing animation state
  const breathingScale = useRef(1.0)

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

  // Animate sparkles, glow, breathing, and tilt
  useFrame((state, delta) => {
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

    // ID12: Card breathing animation (only when not hovered)
    if (groupRef.current) {
      if (!hovered) {
        // Gentle breathing pulse
        const breathPhase = Math.sin(t * BREATHING_SPEED) * 0.5 + 0.5
        const targetBreathScale = BREATHING_SCALE_MIN + (BREATHING_SCALE_MAX - BREATHING_SCALE_MIN) * breathPhase
        // Smooth interpolation
        breathingScale.current += (targetBreathScale - breathingScale.current) * 0.1
      } else {
        // When hovered, let spring animation handle scale
        breathingScale.current = 1.0
      }

      // ID13: Smooth tilt interpolation
      const lerpFactor = hovered ? 8 * delta : 12 * delta
      currentTilt.current.x += (targetTilt.current.x - currentTilt.current.x) * lerpFactor
      currentTilt.current.y += (targetTilt.current.y - currentTilt.current.y) * lerpFactor

      // Apply tilt rotation (convert degrees to radians)
      if (hovered) {
        groupRef.current.rotation.x = rotation[0] + currentTilt.current.x * (Math.PI / 180)
        groupRef.current.rotation.y = rotation[1] + currentTilt.current.y * (Math.PI / 180)
      } else {
        // Smoothly return to base rotation when not hovered
        groupRef.current.rotation.x = rotation[0] + currentTilt.current.x * (Math.PI / 180)
        groupRef.current.rotation.y = rotation[1] + currentTilt.current.y * (Math.PI / 180)
      }
    }
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
    // Reset tilt target when pointer leaves
    targetTilt.current = { x: 0, y: 0 }
  }

  // ID13: Magnetic tilt toward pointer
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!hovered || !e.uv) return

    // UV coordinates are 0-1, map to -1 to 1
    const offsetX = (e.uv.x - 0.5) * 2
    const offsetY = (e.uv.y - 0.5) * 2

    // Calculate tilt: tilt toward the pointer position
    // Tilting on X axis (up/down) based on Y offset
    // Tilting on Y axis (left/right) based on X offset
    targetTilt.current = {
      x: -offsetY * MAX_TILT_DEGREES, // Negative because looking down at card
      y: offsetX * MAX_TILT_DEGREES,
    }
  }

  // Combine hover scale with breathing scale
  const combinedScale = scale.to((s: number) => s * breathingScale.current)

  return (
    <animated.group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={combinedScale}
      position-z={cardZ}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerMove={handlePointerMove}
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
        color="#f0f0f5"
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
        color="#a0a0b0"
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
