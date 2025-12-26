import { useRef, useMemo } from 'react'
import { RigidBody, CuboidCollider, BallCollider } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Aurora accent colors
const AURORA_COLORS = [
  '#a855f7', // Violet
  '#22d3ee', // Cyan
  '#fb7185', // Rose
  '#a855f7', // Violet
  '#22d3ee', // Cyan
  '#fb7185', // Rose
  '#a855f7', // Violet
  '#22d3ee', // Cyan
]

interface PhysicsObjectProps {
  position: [number, number, number]
  color: string
  shape: 'cube' | 'sphere' | 'tetrahedron'
  size: number
  index: number
}

/**
 * PhysicsObject
 * Individual physics-enabled object with click-to-flick interaction
 */
function PhysicsObject({ position, color, shape, size, index }: PhysicsObjectProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const isFlicking = useRef(false)

  // Subtle rotation animation
  useFrame((state) => {
    if (meshRef.current && !isFlicking.current) {
      const t = state.clock.elapsedTime + index * 0.5
      // Very subtle idle rotation
      meshRef.current.rotation.x += Math.sin(t * 0.3) * 0.001
      meshRef.current.rotation.y += 0.002
    }
  })

  // ID11: Click-to-flick interaction
  const handleClick = () => {
    if (rigidBodyRef.current) {
      isFlicking.current = true

      // Random horizontal direction with strong upward force
      const impulseX = (Math.random() - 0.5) * 3
      const impulseY = 4 + Math.random() * 2 // Strong upward
      const impulseZ = (Math.random() - 0.5) * 3

      // Apply impulse at center of mass
      rigidBodyRef.current.applyImpulse(
        { x: impulseX, y: impulseY, z: impulseZ },
        true
      )

      // Add some torque for spin
      rigidBodyRef.current.applyTorqueImpulse(
        {
          x: (Math.random() - 0.5) * 0.5,
          y: (Math.random() - 0.5) * 0.5,
          z: (Math.random() - 0.5) * 0.5
        },
        true
      )

      setTimeout(() => {
        isFlicking.current = false
      }, 1000)
    }
  }

  const handlePointerOver = () => {
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto'
  }

  // Render appropriate geometry based on shape
  const renderGeometry = () => {
    switch (shape) {
      case 'sphere':
        return <sphereGeometry args={[size, 16, 16]} />
      case 'tetrahedron':
        return <tetrahedronGeometry args={[size * 1.2, 0]} />
      case 'cube':
      default:
        return <boxGeometry args={[size, size, size]} />
    }
  }

  // Get appropriate collider
  const renderCollider = () => {
    switch (shape) {
      case 'sphere':
        return <BallCollider args={[size]} />
      case 'tetrahedron':
        return <BallCollider args={[size * 0.9]} /> // Approximate with ball
      case 'cube':
      default:
        return <CuboidCollider args={[size / 2, size / 2, size / 2]} />
    }
  }

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      colliders={false}
      mass={0.5} // Light profile as specified
      linearDamping={0.5}
      angularDamping={0.5}
      restitution={0.7} // Bounce
      friction={0.3}
    >
      {renderCollider()}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
      >
        {renderGeometry()}
        <meshStandardMaterial
          color={color}
          metalness={0.6}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
    </RigidBody>
  )
}

/**
 * Bowl-shaped container to keep objects bounded
 */
function PhysicsBowl() {
  const bowlRadius = 2.5
  const bowlThickness = 0.1

  // Create segments for the bowl shape
  const segments = useMemo(() => {
    const segs = []
    const segmentCount = 12

    for (let i = 0; i < segmentCount; i++) {
      const angle = (i / segmentCount) * Math.PI * 2

      const x = Math.cos(angle) * bowlRadius
      const z = Math.sin(angle) * bowlRadius
      const rotationY = -angle + Math.PI / 2

      segs.push({
        position: [x, -0.3, z] as [number, number, number],
        rotation: [0, rotationY, -0.4] as [number, number, number],
        size: [0.8, bowlThickness, 1.5] as [number, number, number],
      })
    }

    return segs
  }, [bowlRadius])

  return (
    <group>
      {/* Bowl floor */}
      <RigidBody type="fixed" position={[0, -1, 0]}>
        <CuboidCollider args={[3, 0.1, 3]} />
        <mesh receiveShadow>
          <cylinderGeometry args={[bowlRadius, bowlRadius * 0.8, 0.2, 32]} />
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.2}
            roughness={0.8}
            transparent
            opacity={0.3}
          />
        </mesh>
      </RigidBody>

      {/* Bowl walls */}
      {segments.map((seg, i) => (
        <RigidBody
          key={i}
          type="fixed"
          position={seg.position}
          rotation={seg.rotation}
        >
          <CuboidCollider args={[seg.size[0] / 2, seg.size[1] / 2, seg.size[2] / 2]} />
        </RigidBody>
      ))}
    </group>
  )
}

/**
 * PhysicsPlayground
 * Collection of interactive physics objects with a bowl container
 * Positioned in the hero area for playful interaction
 */
export function PhysicsPlayground() {
  // Define 8 physics objects with varied shapes and colors
  const objects = useMemo(() => [
    { position: [0.5, 1.5, 0] as [number, number, number], shape: 'cube' as const, size: 0.35 },
    { position: [-0.5, 2, 0.3] as [number, number, number], shape: 'sphere' as const, size: 0.3 },
    { position: [0, 1.8, -0.5] as [number, number, number], shape: 'tetrahedron' as const, size: 0.35 },
    { position: [0.8, 2.2, -0.3] as [number, number, number], shape: 'cube' as const, size: 0.3 },
    { position: [-0.8, 1.6, 0] as [number, number, number], shape: 'sphere' as const, size: 0.25 },
    { position: [0.3, 2.5, 0.5] as [number, number, number], shape: 'tetrahedron' as const, size: 0.3 },
    { position: [-0.3, 1.9, -0.4] as [number, number, number], shape: 'cube' as const, size: 0.28 },
    { position: [0, 2.3, 0] as [number, number, number], shape: 'sphere' as const, size: 0.32 },
  ], [])

  return (
    <group position={[4, 0.5, -2]}>
      {/* Bowl container */}
      <PhysicsBowl />

      {/* Physics objects */}
      {objects.map((obj, i) => (
        <PhysicsObject
          key={i}
          position={obj.position}
          color={AURORA_COLORS[i]}
          shape={obj.shape}
          size={obj.size}
          index={i}
        />
      ))}

      {/* Subtle ambient glow beneath */}
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 32]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  )
}
