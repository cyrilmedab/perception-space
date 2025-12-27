import { useGLTF } from '@react-three/drei'
import { forwardRef } from 'react'
import type { Group } from 'three'

// Available headset model paths
export const HEADSET_MODELS = {
  quest3: '/assets/models/Quest3/scene.gltf',
  visionPro: '/assets/models/VisionPro/scene.gltf',
  pico4: '/assets/models/Pico4/scene.gltf',
} as const

export type HeadsetModelType = keyof typeof HEADSET_MODELS

interface HeadsetModelProps {
  /** Which headset model to display */
  modelType: HeadsetModelType
  /** Optional custom model path (overrides modelType) */
  modelPath?: string
  /** Position in 3D space */
  position?: [number, number, number]
  /** Rotation in radians */
  rotation?: [number, number, number]
  /** Uniform scale or per-axis scale */
  scale?: number | [number, number, number]
}

/**
 * HeadsetModel - Loads and displays XR headset GLTF models
 *
 * Usage:
 * <HeadsetModel modelType="quest3" scale={0.5} position={[0, 0, 0]} />
 */
export const HeadsetModel = forwardRef<Group, HeadsetModelProps>(
  ({ modelType, modelPath, position, rotation, scale }, ref) => {
    const path = modelPath ?? HEADSET_MODELS[modelType]
    const { scene } = useGLTF(path)

    return (
      <group ref={ref} position={position} rotation={rotation} scale={scale}>
        <primitive object={scene.clone()} />
      </group>
    )
  }
)

HeadsetModel.displayName = 'HeadsetModel'

// Preload all headset models for faster loading
useGLTF.preload(HEADSET_MODELS.quest3)
useGLTF.preload(HEADSET_MODELS.visionPro)
useGLTF.preload(HEADSET_MODELS.pico4)
