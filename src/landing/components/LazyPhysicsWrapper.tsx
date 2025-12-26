import { Physics } from '@react-three/rapier'
import { PhysicsPlayground } from './PhysicsPlayground'

/**
 * LazyPhysicsWrapper
 * Wrapper component for lazy loading the physics playground.
 * This keeps Rapier (~850KB gzipped) out of the initial bundle.
 */
export default function LazyPhysicsWrapper() {
  return (
    <Physics gravity={[0, -9.81, 0]}>
      <PhysicsPlayground />
    </Physics>
  )
}
