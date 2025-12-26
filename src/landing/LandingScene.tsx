import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, Preload } from '@react-three/drei'
import { CameraRig } from './CameraRig'
import { HeroSection } from './sections/HeroSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { CareerSection } from './sections/CareerSection'
import { ContactSection } from './sections/ContactSection'
import { AtmosphericLighting, MagicalFog } from './components/AtmosphericLighting'
import { MagicalParticles } from './components/MagicalParticles'
import { ProjectDetail } from './components/ProjectDetail'
import { PlayfulOrbs } from './components/PlayfulOrb'
import { useDeviceCapabilities } from '@/core/hooks/useDeviceCapabilities'

// Scene constants
const SCROLL_PAGES = 4
const SCROLL_DAMPING = 0.1

function SceneContent() {
  return (
    <>
      {/* Camera follows scroll */}
      <CameraRig />

      {/* Ambient magical particles floating throughout scene */}
      <MagicalParticles />

      {/* Interactive playful orbs */}
      <PlayfulOrbs />

      {/* Scrollable content container */}
      <Scroll>
        {/* Hero at Y=0 */}
        <HeroSection />

        {/* Projects at Y=-10 */}
        <ProjectsSection />

        {/* Career at Y=-25 */}
        <CareerSection />

        {/* Contact at Y=-32 */}
        <ContactSection />
      </Scroll>

      {/* Project detail panel (renders in front of camera when project selected) */}
      <ProjectDetail />
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
      {/* Magical fog and background */}
      <MagicalFog />

      {/* Enhanced atmospheric lighting system */}
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
