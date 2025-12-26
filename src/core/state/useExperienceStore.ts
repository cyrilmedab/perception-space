import { create } from 'zustand'
import type { ExperienceMode } from '@/core/types'

interface ExperienceState {
  // Current experience mode
  mode: ExperienceMode

  // Selected project for detail view
  selectedProject: string | null

  // Scroll progress (0-1 normalized)
  scrollProgress: number

  // Loading state
  isLoading: boolean

  // Actions
  setMode: (mode: ExperienceMode) => void
  setSelectedProject: (id: string | null) => void
  setScrollProgress: (progress: number) => void
  setIsLoading: (loading: boolean) => void
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  // Initial state
  mode: 'landing',
  selectedProject: null,
  scrollProgress: 0,
  isLoading: true,

  // Actions
  setMode: (mode) => set({ mode }),
  setSelectedProject: (id) => set({ selectedProject: id }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}))

// Selector hooks for optimized re-renders
export const useSelectedProject = () =>
  useExperienceStore((state) => state.selectedProject)
export const useScrollProgress = () =>
  useExperienceStore((state) => state.scrollProgress)
export const useIsLoading = () =>
  useExperienceStore((state) => state.isLoading)
export const useExperienceMode = () =>
  useExperienceStore((state) => state.mode)
