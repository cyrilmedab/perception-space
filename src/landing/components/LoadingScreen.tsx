import { useProgress } from '@react-three/drei'
import { useEffect } from 'react'
import { useExperienceStore } from '@/core/state/useExperienceStore'

export function LoadingScreen() {
  const { progress, active } = useProgress()
  const setIsLoading = useExperienceStore((s) => s.setIsLoading)

  useEffect(() => {
    if (!active && progress === 100) {
      // Small delay for smooth transition
      const timeout = setTimeout(() => {
        setIsLoading(false)
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [active, progress, setIsLoading])

  const isLoading = useExperienceStore((s) => s.isLoading)

  if (!isLoading) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#0a0a0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        transition: 'opacity 0.5s ease-out',
        opacity: active ? 1 : 0,
        pointerEvents: active ? 'auto' : 'none',
      }}
    >
      <div
        style={{
          fontSize: '1.5rem',
          color: '#ffffff',
          marginBottom: '1rem',
          fontFamily: 'system-ui, sans-serif',
          letterSpacing: '0.1em',
        }}
      >
        Loading
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '200px',
          height: '2px',
          background: '#2a2a3a',
          borderRadius: '1px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: '#4a9eff',
            transition: 'width 0.3s ease-out',
          }}
        />
      </div>

      <div
        style={{
          marginTop: '0.5rem',
          fontSize: '0.75rem',
          color: '#6a6a7a',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {Math.round(progress)}%
      </div>
    </div>
  )
}
