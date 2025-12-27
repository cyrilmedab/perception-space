import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { useSpring, animated, config } from '@react-spring/three'
import { meta } from '@/core/content'
import { ExtrudedText } from '@/landing/components/ExtrudedText'
import { HeroPhysicsText } from '@/landing/components/HeroPhysicsText'
import { HeadsetModel } from '@/landing/components/models/HeadsetModel'
import { getHeroEntranceTargets } from '@/landing/animations/heroSequence'
import { useExperienceStore, useHeroPhysicsActive } from '@/core/state/useExperienceStore'
import { useDeviceCapabilities } from '@/core/hooks/useDeviceCapabilities'
import type { Group, Mesh } from 'three'
import * as THREE from 'three'

// Hero is at Y=0 in the scene
const HERO_Y = 0

// Get entrance animation targets
const entranceTargets = getHeroEntranceTargets()

// O-1: Performance constants for mobile vs desktop
const MOBILE_TEXT_LAYERS = 2
const DESKTOP_TEXT_LAYERS = 6

export function HeroSection() {
  const groupRef = useRef<Group>(null)
  const heroPhysicsActive = useHeroPhysicsActive()
  const setHeroPhysicsActive = useExperienceStore((s) => s.setHeroPhysicsActive)
  const { isMobile } = useDeviceCapabilities()

  // O-1: Use fewer text layers on mobile for better performance
  const textLayers = isMobile ? MOBILE_TEXT_LAYERS : DESKTOP_TEXT_LAYERS

  // ID-10: Activate hero physics on first click (desktop only)
  const handleHeroClick = () => {
    if (!isMobile && !heroPhysicsActive) {
      setHeroPhysicsActive(true)
    }
  }

  // Entrance animations for text
  const textSpring = useSpring({
    from: {
      positionZ: -2,
      scale: 0.8,
      opacity: 0,
    },
    to: {
      positionZ: entranceTargets.text.positionZ,
      scale: entranceTargets.text.scale,
      opacity: entranceTargets.text.opacity,
    },
    delay: 300,
    config: { ...config.gentle, tension: 60, friction: 20 },
  })

  // Entrance animations for headsets - staggered
  const visionProSpring = useSpring({
    from: {
      positionX: -3,
      positionY: -1,
      positionZ: -3,
      scale: 0,
    },
    to: {
      positionX: entranceTargets.visionPro.positionX,
      positionY: entranceTargets.visionPro.positionY,
      positionZ: entranceTargets.visionPro.positionZ,
      scale: entranceTargets.visionPro.scale,
    },
    delay: 600,
    config: { ...config.gentle, tension: 50, friction: 18 },
  })

  const quest3Spring = useSpring({
    from: {
      positionX: 0,
      positionY: 2,
      positionZ: -3,
      scale: 0,
    },
    to: {
      positionX: entranceTargets.quest3.positionX,
      positionY: entranceTargets.quest3.positionY,
      positionZ: entranceTargets.quest3.positionZ,
      scale: entranceTargets.quest3.scale,
    },
    delay: 750,
    config: { ...config.gentle, tension: 50, friction: 18 },
  })

  const pico4Spring = useSpring({
    from: {
      positionX: 3,
      positionY: -1,
      positionZ: -3,
      scale: 0,
    },
    to: {
      positionX: entranceTargets.pico4.positionX,
      positionY: entranceTargets.pico4.positionY,
      positionZ: entranceTargets.pico4.positionZ,
      scale: entranceTargets.pico4.scale,
    },
    delay: 900,
    config: { ...config.gentle, tension: 50, friction: 18 },
  })

  // Subtle idle animation
  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (groupRef.current) {
      // Very subtle breathing rotation
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.02
    }
  })

  return (
    <group ref={groupRef} position={[0, HERO_Y, 0]}>
      {/* Main "Cyril" text - extruded 3D effect */}
      {/* ID-10: Click handler for physics activation, wrapped in HeroPhysicsText */}
      <animated.group
        position-z={textSpring.positionZ}
        scale={textSpring.scale}
        onClick={handleHeroClick}
        onPointerOver={() => {
          // Only show pointer cursor on desktop where physics can be activated
          if (!isMobile) {
            document.body.style.cursor = 'pointer'
          }
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        {/* HeroPhysicsText: Static on mobile, physics-enabled on desktop after click */}
        <HeroPhysicsText position={[0, 0.3, 0]}>
          <ExtrudedText
            text={meta.name}
            fontSize={1.2}
            color="#f0f0f5"
            layers={textLayers}
            depthStep={0.025}
            backColor="#1a1a2e"
          />
        </HeroPhysicsText>

        {/* Title below name */}
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.18}
          color="#a855f7"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
        >
          {meta.title}
        </Text>

        {/* Location */}
        <Text
          position={[0, -0.95, 0]}
          fontSize={0.1}
          color="#a0a0b0"
          anchorX="center"
          anchorY="middle"
        >
          {meta.location}
        </Text>
      </animated.group>

      {/* Headset models in arc formation */}
      {/* O-1: Mobile shows only Quest 3 at center for performance */}
      {!isMobile && (
        /* Vision Pro - Left (desktop only) */
        <animated.group
          position-x={visionProSpring.positionX}
          position-y={visionProSpring.positionY}
          position-z={visionProSpring.positionZ}
          scale={visionProSpring.scale}
        >
          <HeadsetWithFloat
            modelType="visionPro"
            rotationY={entranceTargets.visionPro.rotationY}
            floatOffset={0}
          />
        </animated.group>
      )}

      {/* Quest 3 - Center (always shown, repositioned on mobile) */}
      <animated.group
        position-x={isMobile ? 0 : quest3Spring.positionX}
        position-y={isMobile ? 0.8 : quest3Spring.positionY}
        position-z={quest3Spring.positionZ}
        scale={isMobile ? 0.8 : quest3Spring.scale}
      >
        <HeadsetWithFloat
          modelType="quest3"
          rotationY={isMobile ? 0 : entranceTargets.quest3.rotationY}
          floatOffset={1}
        />
      </animated.group>

      {!isMobile && (
        /* Pico 4 - Right (desktop only) */
        <animated.group
          position-x={pico4Spring.positionX}
          position-y={pico4Spring.positionY}
          position-z={pico4Spring.positionZ}
          scale={pico4Spring.scale}
        >
          <HeadsetWithFloat
            modelType="pico4"
            rotationY={entranceTargets.pico4.rotationY}
            floatOffset={2}
          />
        </animated.group>
      )}

      {/* Scroll indicator */}
      <ScrollIndicator />
    </group>
  )
}

/**
 * Headset wrapper with subtle floating animation
 */
interface HeadsetWithFloatProps {
  modelType: 'quest3' | 'visionPro' | 'pico4'
  rotationY: number
  floatOffset: number
}

function HeadsetWithFloat({ modelType, rotationY, floatOffset }: HeadsetWithFloatProps) {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (groupRef.current) {
      // Gentle floating motion - each headset has different phase
      const phase = floatOffset * 0.8
      groupRef.current.position.y = Math.sin(t * 0.5 + phase) * 0.05
      groupRef.current.rotation.y = rotationY + Math.sin(t * 0.3 + phase) * 0.05
    }
  })

  return (
    <group ref={groupRef} rotation={[0, rotationY, 0]}>
      <HeadsetModel modelType={modelType} />
    </group>
  )
}

/**
 * Animated scroll indicator
 */
function ScrollIndicator() {
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
    <group position={[0, -1.6, 0]}>
      <Text
        fontSize={0.08}
        color="#a0a0b0"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
      >
        scroll to explore
      </Text>
      {/* Animated arrow */}
      <mesh ref={arrowRef} position={[0, -0.25, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.03, 0.06, 3]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} />
      </mesh>
      {/* Trail effect */}
      <mesh position={[0, -0.15, 0]}>
        <planeGeometry args={[0.015, 0.12]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}
