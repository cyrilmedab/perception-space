import { create } from 'zustand'
import type { ExperienceMode } from '@/core/types'

interface ExperienceState {
  // Current experience mode
  mode: ExperienceMode

  // Selected project for detail view
  selectedProject: string | null

  // ID-1: World position of selected card for animation origin
  selectedCardPosition: [number, number, number] | null

  // ID-2: Whether hero physics has been activated (first click)
  heroPhysicsActive: boolean

  // Scroll lock state (auto-managed when project is selected)
  isScrollLocked: boolean

  // Scroll progress (0-1 normalized)
  scrollProgress: number

  // Loading state
  isLoading: boolean

  // Actions
  setMode: (mode: ExperienceMode) => void
  setSelectedProject: (id: string | null) => void
  setSelectedCardPosition: (pos: [number, number, number] | null) => void
  setHeroPhysicsActive: (active: boolean) => void
  setScrollProgress: (progress: number) => void
  setIsLoading: (loading: boolean) => void
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  // Initial state
  mode: 'landing',
  selectedProject: null,
  selectedCardPosition: null,
  heroPhysicsActive: false,
  isScrollLocked: false,
  scrollProgress: 0,
  isLoading: true,

  // Actions
  setMode: (mode) => set({ mode }),
  setSelectedProject: (id) =>
    set({
      selectedProject: id,
      isScrollLocked: id !== null,
    }),
  setSelectedCardPosition: (pos) => set({ selectedCardPosition: pos }),
  setHeroPhysicsActive: (active) => set({ heroPhysicsActive: active }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}))

// Selector hooks for optimized re-renders
export const useSelectedProject = () =>
  useExperienceStore((state) => state.selectedProject)
export const useSelectedCardPosition = () =>
  useExperienceStore((state) => state.selectedCardPosition)
export const useHeroPhysicsActive = () =>
  useExperienceStore((state) => state.heroPhysicsActive)
export const useScrollProgress = () =>
  useExperienceStore((state) => state.scrollProgress)
export const useIsLoading = () =>
  useExperienceStore((state) => state.isLoading)
export const useExperienceMode = () =>
  useExperienceStore((state) => state.mode)
export const useIsScrollLocked = () =>
  useExperienceStore((state) => state.isScrollLocked)
