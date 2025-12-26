import { useRef, useMemo } from 'react'
import { RigidBody, CuboidCollider, BallCollider } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Aurora accent colors (5 objects)
const AURORA_COLORS = [
  '#a855f7', // Violet
  '#22d3ee', // Cyan
  '#fb7185', // Rose
  '#22d3ee', // Cyan
  '#a855f7', // Violet
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

  // ID11: Click-to-flick interaction (gentler impulse to keep objects bounded)
  const handleClick = () => {
    if (rigidBodyRef.current) {
      isFlicking.current = true

      // Gentler impulse - random horizontal with moderate upward force
      const impulseX = (Math.random() - 0.5) * 1.2
      const impulseY = 1.5 + Math.random() * 0.8 // Moderate upward
      const impulseZ = (Math.random() - 0.5) * 1.2

      // Apply impulse at center of mass
      rigidBodyRef.current.applyImpulse(
        { x: impulseX, y: impulseY, z: impulseZ },
        true
      )

      // Add some torque for spin (gentler)
      rigidBodyRef.current.applyTorqueImpulse(
        {
          x: (Math.random() - 0.5) * 0.2,
          y: (Math.random() - 0.5) * 0.2,
          z: (Math.random() - 0.5) * 0.2
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
      linearDamping={0.8} // Higher damping to slow objects faster
      angularDamping={0.8}
      restitution={0.4} // Reduced bounce to keep objects calmer
      friction={0.5}
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
 * Enclosed container to keep objects absolutely bounded
 * Smaller, tighter enclosure with walls on all sides and a ceiling
 */
function PhysicsBowl() {
  const containerWidth = 1.8 // Smaller container
  const containerDepth = 1.8
  const containerHeight = 2.5 // Height of walls
  const wallThickness = 0.1

  return (
    <group>
      {/* Floor */}
      <RigidBody type="fixed" position={[0, -0.5, 0]}>
        <CuboidCollider args={[containerWidth / 2, wallThickness / 2, containerDepth / 2]} />
        <mesh receiveShadow>
          <boxGeometry args={[containerWidth, wallThickness, containerDepth]} />
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.2}
            roughness={0.8}
            transparent
            opacity={0.25}
          />
        </mesh>
      </RigidBody>

      {/* Left wall (-X) */}
      <RigidBody type="fixed" position={[-containerWidth / 2, containerHeight / 2 - 0.5, 0]}>
        <CuboidCollider args={[wallThickness / 2, containerHeight / 2, containerDepth / 2]} />
      </RigidBody>

      {/* Right wall (+X) */}
      <RigidBody type="fixed" position={[containerWidth / 2, containerHeight / 2 - 0.5, 0]}>
        <CuboidCollider args={[wallThickness / 2, containerHeight / 2, containerDepth / 2]} />
      </RigidBody>

      {/* Back wall (-Z) */}
      <RigidBody type="fixed" position={[0, containerHeight / 2 - 0.5, -containerDepth / 2]}>
        <CuboidCollider args={[containerWidth / 2, containerHeight / 2, wallThickness / 2]} />
      </RigidBody>

      {/* Front wall (+Z) - invisible but present */}
      <RigidBody type="fixed" position={[0, containerHeight / 2 - 0.5, containerDepth / 2]}>
        <CuboidCollider args={[containerWidth / 2, containerHeight / 2, wallThickness / 2]} />
      </RigidBody>

      {/* Ceiling - prevents objects from escaping upward */}
      <RigidBody type="fixed" position={[0, containerHeight - 0.5, 0]}>
        <CuboidCollider args={[containerWidth / 2, wallThickness / 2, containerDepth / 2]} />
      </RigidBody>

      {/* Visual container outline (subtle) */}
      <mesh position={[0, containerHeight / 2 - 0.5, 0]}>
        <boxGeometry args={[containerWidth - 0.02, containerHeight - 0.02, containerDepth - 0.02]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.03}
          wireframe
        />
      </mesh>
    </group>
  )
}

/**
 * PhysicsPlayground
 * Collection of interactive physics objects with an enclosed container
 * Positioned centered below the hero name (X=0, Y=-1.5)
 */
export function PhysicsPlayground() {
  // Define 5 physics objects with varied shapes and colors (reduced from 8)
  // Positions are relative to container, starting above the floor
  const objects = useMemo(() => [
    { position: [0.3, 0.5, 0.2] as [number, number, number], shape: 'cube' as const, size: 0.22 },
    { position: [-0.3, 0.8, -0.2] as [number, number, number], shape: 'sphere' as const, size: 0.2 },
    { position: [0, 1.1, 0] as [number, number, number], shape: 'tetrahedron' as const, size: 0.22 },
    { position: [-0.4, 0.6, 0.3] as [number, number, number], shape: 'sphere' as const, size: 0.18 },
    { position: [0.4, 0.9, -0.1] as [number, number, number], shape: 'cube' as const, size: 0.2 },
  ], [])

  return (
    // Centered below hero name: X=0, Y=-1.5 (below title at Y=-0.3, above scroll indicator)
    <group position={[0, -1.5, 0]}>
      {/* Enclosed container */}
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
      <mesh position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.06}
        />
      </mesh>
    </group>
  )
}
