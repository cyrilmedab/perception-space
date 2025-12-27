import { RigidBody, CuboidCollider } from '@react-three/rapier'

/**
 * PhysicsPlayground (ID-11: Cleaned up)
 *
 * Previously contained primitive physics objects and a visible bounding box.
 * Now provides only the physics world floor plane for potential future use
 * with hero physics text activation.
 *
 * The primitive shapes (cubes, spheres, tetrahedrons) and visible bounding
 * box have been removed per ID-11 requirements.
 */
export function PhysicsPlayground() {
  return (
    <group position={[0, -3, 0]}>
      {/* Invisible floor plane - catches physics objects if they fall */}
      <RigidBody type="fixed" position={[0, 0, 0]}>
        <CuboidCollider args={[10, 0.1, 10]} />
      </RigidBody>
    </group>
  )
}
