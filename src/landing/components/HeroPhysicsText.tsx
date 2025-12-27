import { type ReactNode } from 'react'
import { RigidBody } from '@react-three/rapier'
import { useDeviceCapabilities } from '@/core/hooks/useDeviceCapabilities'
import { useHeroPhysicsActive } from '@/core/state/useExperienceStore'

interface HeroPhysicsTextProps {
  /** Child elements to wrap with optional physics */
  children: ReactNode
  /** Position in 3D space */
  position?: [number, number, number]
}

/**
 * HeroPhysicsText - Conditional physics wrapper for hero text
 *
 * ID-4: Wraps hero text with physics behavior based on device and activation state
 * - Mobile: Always static (no physics) - reduces GPU load
 * - Desktop: Static until first click, then physics-enabled
 *
 * Uses light physics profile for playful but controlled motion:
 * - mass: 0.5 (light, responsive)
 * - linearDamping: 0.5 (moderate drag, smooth settling)
 * - angularDamping: 0.8 (controlled rotation)
 * - restitution: 0.7 (bouncy feel)
 */
export function HeroPhysicsText({ children, position = [0, 0, 0] }: HeroPhysicsTextProps) {
  const { isMobile } = useDeviceCapabilities()
  const heroPhysicsActive = useHeroPhysicsActive()

  // Mobile: Always render static (no physics overhead)
  if (isMobile) {
    return <group position={position}>{children}</group>
  }

  // Desktop: Static until physics is activated
  if (!heroPhysicsActive) {
    return <group position={position}>{children}</group>
  }

  // Desktop with physics active: Wrap in RigidBody with playful physics profile
  return (
    <RigidBody
      position={position}
      colliders="cuboid"
      mass={0.5}
      linearDamping={0.5}
      angularDamping={0.8}
      restitution={0.7}
      friction={0.3}
    >
      {children}
    </RigidBody>
  )
}
