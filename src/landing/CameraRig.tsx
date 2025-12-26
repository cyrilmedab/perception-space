import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import type { Group } from 'three'

// Camera path constants
const CAMERA_START_Y = 0
const CAMERA_END_Y = -34
const CAMERA_Z = 8

export function CameraRig() {
  const groupRef = useRef<Group>(null)
  const scroll = useScroll()

  useFrame((state) => {
    // Scroll offset is 0-1, maps to camera Y position
    const offset = scroll.offset
    const targetY = CAMERA_START_Y + offset * (CAMERA_END_Y - CAMERA_START_Y)

    // Smoothly interpolate camera position
    state.camera.position.y += (targetY - state.camera.position.y) * 0.1
    state.camera.position.z = CAMERA_Z

    // Keep camera looking slightly ahead in the scroll direction
    state.camera.lookAt(0, state.camera.position.y - 2, 0)
  })

  return <group ref={groupRef} />
}
