import { useThree } from '@react-three/fiber'
import { useMemo } from 'react'

interface ResponsiveValues {
  // Scale factor for 3D elements based on viewport
  scale: number
  // Adjusted camera distance
  cameraZ: number
  // Card spacing multiplier
  spacing: number
  // Whether we're in compact mode
  isCompact: boolean
  // Font size multiplier
  fontScale: number
}

export function useResponsive(): ResponsiveValues {
  const { size } = useThree()

  return useMemo(() => {
    const aspect = size.width / size.height
    const isPortrait = aspect < 1
    const isNarrow = size.width < 768

    // Base scale adjustments for different viewports
    let scale = 1
    let cameraZ = 8
    let spacing = 1
    let fontScale = 1

    if (isNarrow) {
      // Mobile: scale down, bring camera closer
      scale = 0.7
      cameraZ = 10
      spacing = 0.8
      fontScale = 1.2 // Larger text on mobile for readability
    } else if (isPortrait) {
      // Tablet portrait
      scale = 0.85
      cameraZ = 9
      spacing = 0.9
      fontScale = 1.1
    }

    return {
      scale,
      cameraZ,
      spacing,
      isCompact: isNarrow,
      fontScale,
    }
  }, [size.width, size.height])
}

// Hook for getting responsive card layout
export function useCardLayout(cardCount: number) {
  const { isCompact, spacing } = useResponsive()

  return useMemo(() => {
    if (isCompact) {
      // Single column on mobile
      return Array.from({ length: cardCount }, (_, i) => ({
        position: [0, -i * 3 * spacing, -2] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
      }))
    }

    // Two-column layout on larger screens
    return Array.from({ length: cardCount }, (_, i) => {
      const col = i % 2
      const row = Math.floor(i / 2)
      const x = col === 0 ? -2.5 * spacing : 2.5 * spacing
      const y = -row * 3.5 * spacing
      const z = -2 - (i % 3) * 1.5
      const rotationY = col === 0 ? 0.1 : -0.1

      return {
        position: [x, y, z] as [number, number, number],
        rotation: [0, rotationY, 0] as [number, number, number],
      }
    })
  }, [cardCount, isCompact, spacing])
}
