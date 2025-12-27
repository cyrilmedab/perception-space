import { Suspense, lazy, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, Preload } from '@react-three/drei'
import { CameraRig } from './CameraRig'
import { HeroSection } from './sections/HeroSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { CareerSection } from './sections/CareerSection'
import { ContactSection } from './sections/ContactSection'
import { AtmosphericLighting, MagicalFog } from './components/AtmosphericLighting'
import { SceneBlurOverlay } from './components/SceneBlurOverlay'
import { ProjectDetailPanel3D } from './components/ProjectDetailPanel3D'
import { useDeviceCapabilities } from '@/core/hooks/useDeviceCapabilities'

// Lazy load physics to reduce initial bundle size (~850KB saved)
const LazyPhysicsPlayground = lazy(() => import('./components/LazyPhysicsWrapper'))

// Scene constants
const SCROLL_PAGES = 4
const SCROLL_DAMPING = 0.1

// Deferred physics loading - loads after initial render
function DeferredPhysics() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Delay physics loading to prioritize initial render
    const timer = setTimeout(() => setShouldLoad(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!shouldLoad) return null

  return (
    <Suspense fallback={null}>
      <LazyPhysicsPlayground />
    </Suspense>
  )
}

function SceneContent() {
  return (
    <>
      {/* Camera follows scroll */}
      <CameraRig />

      {/* Scene blur overlay - darkens when detail panel is open */}
      <SceneBlurOverlay />

      {/* 3D Detail panel for selected projects */}
      <ProjectDetailPanel3D />

      {/* Physics playground - lazy loaded after initial render */}
      <DeferredPhysics />

      {/* Scrollable content container */}
      <Scroll>
        {/* Hero at Y=0 */}
        <HeroSection />

        {/* Projects at Y=-6 */}
        <ProjectsSection />

        {/* Career at Y=-18 */}
        <CareerSection />

        {/* Contact at Y=-28 */}
        <ContactSection />
      </Scroll>
    </>
  )
}

export function LandingScene() {
  const { pixelRatio } = useDeviceCapabilities()

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={pixelRatio}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'fixed', top: 0, left: 0 }}
    >
      {/* Clean fog and background */}
      <MagicalFog />

      {/* Studio-style atmospheric lighting */}
      <AtmosphericLighting />

      {/* Scroll-controlled scene */}
      <ScrollControls pages={SCROLL_PAGES} damping={SCROLL_DAMPING}>
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </ScrollControls>

      {/* Preload assets */}
      <Preload all />
    </Canvas>
  )
}
