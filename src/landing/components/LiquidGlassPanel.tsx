import { RoundedBox } from '@react-three/drei'
import { LiquidGlassMaterial } from '@/landing/materials/LiquidGlassMaterial'
import type { ReactNode } from 'react'

interface LiquidGlassPanelProps {
  /** Panel width */
  width?: number
  /** Panel height */
  height?: number
  /** Panel depth (thickness) */
  depth?: number
  /** Corner radius */
  radius?: number
  /** Glass tint color */
  tintColor?: string
  /** Glass opacity (0-1) */
  opacity?: number
  /** Content to render on the panel surface */
  children?: ReactNode
  /** Z offset for children (how far in front of panel) */
  childrenZOffset?: number
  /** Position in 3D space */
  position?: [number, number, number]
  /** Rotation in radians */
  rotation?: [number, number, number]
  /** Uniform scale or per-axis scale */
  scale?: number | [number, number, number]
}

/**
 * LiquidGlassPanel - A glass panel wrapper component
 *
 * Combines RoundedBox geometry with LiquidGlassMaterial for a
 * frosted glass effect. Children are rendered slightly in front
 * of the panel surface.
 *
 * Usage:
 * <LiquidGlassPanel width={2} height={3} tintColor="#a855f7">
 *   <Text>Content on panel</Text>
 * </LiquidGlassPanel>
 */
export function LiquidGlassPanel({
  width = 2,
  height = 3,
  depth = 0.05,
  radius = 0.1,
  tintColor = '#ffffff',
  opacity = 0.5,
  children,
  childrenZOffset = 0.03,
  position,
  rotation,
  scale,
}: LiquidGlassPanelProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Glass panel */}
      <RoundedBox
        args={[width, height, depth]}
        radius={radius}
        smoothness={4}
      >
        <LiquidGlassMaterial
          tintColor={tintColor}
          opacity={opacity}
          fresnelPower={2.5}
          iridescenceIntensity={0.2}
        />
      </RoundedBox>

      {/* Children rendered on surface */}
      {children && (
        <group position={[0, 0, depth / 2 + childrenZOffset]}>
          {children}
        </group>
      )}
    </group>
  )
}
