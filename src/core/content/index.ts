import type { Project, CareerRole, Meta, ContentData } from '@/core/types'
import projectsData from './projects.json'
import careerData from './career.json'
import metaData from './meta.json'

// Type-safe content exports
export const projects: Project[] = projectsData as Project[]
export const career: CareerRole[] = careerData as CareerRole[]
export const meta: Meta = metaData as Meta

// Combined content data
export const contentData: ContentData = {
  projects,
  career,
  meta,
}

// Helper to get project by ID
export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id)
}

// Helper to get career role by ID
export function getCareerById(id: string): CareerRole | undefined {
  return career.find((c) => c.id === id)
}
