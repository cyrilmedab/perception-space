import { useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import {
  useExperienceStore,
  useSelectedProject,
} from '@/core/state/useExperienceStore'
import type { Mesh } from 'three'
import * as THREE from 'three'

interface SceneBlurOverlayProps {
  /** Maximum opacity when fully active */
  maxOpacity?: number
  /** Color of the overlay */
  color?: string
  /** Z position (should be between camera and content) */
  zPosition?: number
}

/**
 * SceneBlurOverlay - Darkens the scene when a detail panel is open
 *
 * Renders a full-screen plane that fades in when selectedProject is set.
 * This creates a visual focus effect, drawing attention to the detail panel.
 * ID-9: Clicking on the overlay closes the detail panel.
 *
 * Note: This component uses a simple dark overlay. For actual blur effects,
 * post-processing would be needed (EffectComposer with blur pass).
 */
export function SceneBlurOverlay({
  maxOpacity = 0.7,
  color = '#000000',
  zPosition = 3,
}: SceneBlurOverlayProps = {}) {
  const meshRef = useRef<Mesh>(null)
  const selectedProject = useSelectedProject()
  const setSelectedProject = useExperienceStore((s) => s.setSelectedProject)
  const setSelectedCardPosition = useExperienceStore((s) => s.setSelectedCardPosition)

  // Spring animation for smooth opacity transitions
  const { opacity } = useSpring({
    opacity: selectedProject ? maxOpacity : 0,
    config: {
      tension: 200,
      friction: 30,
    },
  })

  // ID-9: Close handler for click-outside-to-close
  const handleClose = useCallback(() => {
    if (selectedProject) {
      setSelectedProject(null)
      setSelectedCardPosition(null)
    }
  }, [selectedProject, setSelectedProject, setSelectedCardPosition])

  // Keep the overlay in front of camera (follows camera position)
  useFrame(({ camera }) => {
    if (meshRef.current) {
      // Position the overlay in front of the camera
      meshRef.current.position.copy(camera.position)
      meshRef.current.position.z -= zPosition

      // Match camera rotation so the plane always faces the camera
      meshRef.current.quaternion.copy(camera.quaternion)
    }
  })

  return (
    <animated.mesh
      ref={meshRef}
      // Render before other transparent objects
      renderOrder={-1}
      onClick={handleClose}
      onPointerOver={() => {
        if (selectedProject) {
          document.body.style.cursor = 'pointer'
        }
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Large plane to cover the viewport */}
      <planeGeometry args={[50, 50]} />
      <animated.meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </animated.mesh>
  )
}
