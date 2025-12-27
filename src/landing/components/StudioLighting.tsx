/**
 * StudioLighting - Professional studio-style lighting setup
 *
 * Provides clean, professional lighting with:
 * - Key light (main illumination)
 * - Fill light (reduce harsh shadows)
 * - Rim lights (purple and cyan accents for visual interest)
 * - Soft ambient base
 */

interface StudioLightingProps {
  /** Intensity multiplier for all lights (default: 1) */
  intensity?: number
  /** Enable rim lights (default: true) */
  enableRimLights?: boolean
}

export function StudioLighting({
  intensity = 1,
  enableRimLights = true,
}: StudioLightingProps = {}) {
  return (
    <>
      {/* Soft ambient base - prevents pure black areas */}
      <ambientLight intensity={0.2 * intensity} color="#e8e8f0" />

      {/* Key light - main illumination from upper-left-front */}
      <directionalLight
        position={[-3, 4, 5]}
        intensity={1.2 * intensity}
        color="#ffffff"
        castShadow={false}
      />

      {/* Fill light - softer, cooler from upper-right */}
      <pointLight
        position={[3, 2, 4]}
        intensity={0.5 * intensity}
        color="#e8f0ff"
        distance={15}
        decay={2}
      />

      {/* Rim lights - colored accents for depth and visual interest */}
      {enableRimLights && (
        <>
          {/* Purple rim light - left side */}
          <pointLight
            position={[-4, 0, -2]}
            intensity={0.35 * intensity}
            color="#a855f7"
            distance={12}
            decay={2}
          />

          {/* Cyan rim light - right side */}
          <pointLight
            position={[4, 0, -2]}
            intensity={0.35 * intensity}
            color="#22d3ee"
            distance={12}
            decay={2}
          />

          {/* Subtle back light for silhouette definition */}
          <pointLight
            position={[0, -1, -5]}
            intensity={0.2 * intensity}
            color="#6366f1"
            distance={15}
            decay={2}
          />
        </>
      )}
    </>
  )
}
