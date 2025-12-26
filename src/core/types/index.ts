// Project focus areas
export type ProjectFocus =
  | 'xr-systems'
  | 'networking'
  | 'performance'
  | 'spatial-ui'
  | 'experimental'

// Project content structure
export interface ProjectContent {
  problem: string
  solution: string
  technical: string[]
}

// Project links
export interface ProjectLinks {
  github?: string | null
  devpost?: string | null
  live?: string | null
}

// Project media
export interface ProjectMedia {
  images: string[]
  video?: string | null
}

// Full project type
export interface Project {
  id: string
  title: string
  subtitle?: string
  focus: ProjectFocus[]
  thumbnail: string
  media: ProjectMedia
  content: ProjectContent
  links: ProjectLinks
  awards?: string[]
}

// Career period
export interface CareerPeriod {
  start: string
  end: string
}

// Career role
export interface CareerRole {
  id: string
  title: string
  company: string
  location: string
  period: CareerPeriod
  highlights: string[]
}

// Education entry
export interface Education {
  credential: string
  institution: string
  year: string
}

// Skills grouped by category
export interface Skills {
  languages: string[]
  engineFrameworks: string[]
  networking: string[]
  xr3d: string[]
  performance: string[]
  platforms: string[]
  tools: string[]
}

// Social/professional links
export interface MetaLinks {
  linkedin: string
  github: string
  portfolio: string
}

// Meta information about the person
export interface Meta {
  name: string
  title: string
  location: string
  email: string
  phone: string
  links: MetaLinks
  education: Education[]
  skills: Skills
}

// Full content data structure
export interface ContentData {
  projects: Project[]
  career: CareerRole[]
  meta: Meta
}

// Experience mode
export type ExperienceMode = 'landing' | 'xr'

// Device capabilities
export interface DeviceCapabilities {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  supportsXR: boolean
  supportsTouch: boolean
  pixelRatio: number
}
