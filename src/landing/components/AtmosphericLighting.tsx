import { useMemo } from 'react'
import * as THREE from 'three'
import { StudioLighting } from './StudioLighting'

/**
 * AtmosphericLighting - Main lighting system for the landing scene
 *
 * Uses studio-style lighting for professional appearance:
 * - Clean key/fill/rim light setup
 * - Subtle colored accents for visual interest
 * - No animated/pulsing lights for cleaner look
 */
export function AtmosphericLighting() {
  return (
    <>
      {/* Studio-style lighting setup */}
      <StudioLighting intensity={1} enableRimLights={true} />

      {/* Additional distant backlight for overall scene depth */}
      <pointLight
        position={[0, -15, -20]}
        intensity={0.15}
        color="#6366f1"
        distance={50}
        decay={1.5}
      />
    </>
  )
}

/**
 * MagicalFog - Clean fog and background
 *
 * Simplified version with:
 * - Clean dark fog: #0a0a12
 * - Solid background: #050508
 * - No aurora gradient for cleaner aesthetic
 */
export function MagicalFog() {
  const fogColor = useMemo(() => new THREE.Color('#0a0a12'), [])

  return (
    <>
      {/* Clean fog for depth */}
      <fog attach="fog" args={[fogColor, 8, 45]} />

      {/* Solid dark background */}
      <color attach="background" args={['#050508']} />
    </>
  )
}
