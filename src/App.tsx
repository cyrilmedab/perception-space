import { LandingScene } from '@/landing/LandingScene'
import { LoadingScreen } from '@/landing/components/LoadingScreen'
import { ProjectModal } from '@/landing/components/ProjectModal'
import { useSelectedProject } from '@/core/state/useExperienceStore'

function App() {
  const selectedProject = useSelectedProject()

  return (
    <>
      <LoadingScreen />
      <LandingScene />
      {/* ID6: Render ProjectModal outside Canvas when project is selected */}
      {selectedProject && <ProjectModal />}
    </>
  )
}

export default App
