import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from 'troika-three-text'
import type { Group } from 'three'
import * as THREE from 'three'

interface ExtrudedTextProps {
  /** The text to display */
  text: string
  /** Font size in world units */
  fontSize?: number
  /** Main text color */
  color?: string
  /** Number of layers for depth effect (desktop default: 5, reduce for mobile) */
  layers?: number
  /** Depth offset between layers */
  depthStep?: number
  /** Back layer color */
  backColor?: string
  /** Opacity for back layers */
  backOpacity?: number
  /** Font URL (optional, uses default sans-serif if not provided) */
  font?: string
  /** Letter spacing */
  letterSpacing?: number
  /** Position in 3D space */
  position?: [number, number, number]
  /** Rotation in radians */
  rotation?: [number, number, number]
  /** Uniform scale or per-axis scale */
  scale?: number | [number, number, number]
}

/**
 * ExtrudedText - Creates a 3D extruded text effect using troika-three-text
 * Uses layered SDF text at different Z offsets to create depth
 */
export function ExtrudedText({
  text,
  fontSize = 1,
  color = '#f0f0f5',
  layers = 5,
  depthStep = 0.02,
  backColor = '#1a1a2e',
  backOpacity = 0.8,
  font,
  letterSpacing = -0.02,
  position,
  rotation,
  scale,
}: ExtrudedTextProps) {
  const groupRef = useRef<Group>(null)

  // Create text mesh instances
  const textMeshes = useMemo(() => {
    return Array.from({ length: layers }, (_, i) => {
      const textMesh = new Text()
      textMesh.text = text
      textMesh.fontSize = fontSize
      textMesh.anchorX = 'center'
      textMesh.anchorY = 'middle'
      textMesh.letterSpacing = letterSpacing

      if (font) {
        textMesh.font = font
      }

      // Front layer is the main color, back layers fade to backColor
      const isFrontLayer = i === layers - 1
      const layerProgress = i / (layers - 1)

      if (isFrontLayer) {
        textMesh.color = new THREE.Color(color)
        textMesh.material = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 1,
          depthWrite: true,
        })
      } else {
        // Interpolate between backColor and a slightly lighter version
        const layerColor = new THREE.Color(backColor)
        layerColor.lerp(new THREE.Color(color), layerProgress * 0.3)
        textMesh.color = layerColor
        textMesh.material = new THREE.MeshBasicMaterial({
          color: layerColor,
          transparent: true,
          opacity: backOpacity * (0.5 + layerProgress * 0.5),
          depthWrite: false,
        })
      }

      // Position each layer at increasing Z depth
      const zOffset = -(layers - 1 - i) * depthStep
      textMesh.position.z = zOffset

      // Sync the text mesh
      textMesh.sync()

      return textMesh
    })
  }, [text, fontSize, color, layers, depthStep, backColor, backOpacity, font, letterSpacing])

  // Handle cleanup
  useMemo(() => {
    return () => {
      textMeshes.forEach((mesh) => {
        mesh.dispose()
      })
    }
  }, [textMeshes])

  // Subtle animation for depth effect
  useFrame((state) => {
    if (groupRef.current) {
      // Very subtle breathing animation
      const t = state.clock.elapsedTime
      groupRef.current.position.z = (position?.[2] ?? 0) + Math.sin(t * 0.5) * 0.02
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {textMeshes.map((textMesh, i) => (
        <primitive key={i} object={textMesh} />
      ))}
    </group>
  )
}
