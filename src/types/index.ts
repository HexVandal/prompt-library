export interface ComponentSpec {
  name: string
  type: string
  description: string
}

export interface PromptPatterns {
  colors: string[]
  fonts: string[]
  borderRadius: string[]
  shadows: string[]
  animations: string[]
  transitions: string[]
}

export interface LibraryPrompt {
  id: string
  title: string
  description: string
  content: string
  videoUrl?: string | null
  tags: string[]
  components: ComponentSpec[]
  patterns: PromptPatterns
  version: number
  createdAt: string
  updatedAt: string
  isArchived: boolean
}

export interface Prompt {
  id: string
  title: string
  description: string | null
  content: string
  version: number
  isArchived: boolean
  createdAt: any
  updatedAt: any
  tags?: any[]
  components?: any[]
}

export interface Tag {
  id: string
  name: string
  color: string | null
  category: TagCategory
  createdAt: any
  updatedAt: any
}

export type TagCategory = 'GENERAL' | 'COMPONENT' | 'PATTERN' | 'TECH_STACK' | 'DESIGN_SYSTEM'

export interface Component {
  id: string
  promptId: string
  type: string
  name: string
  spec: any
  extractedAt: any
}

export interface ExtractedComponent {
  type: string
  name: string
  spec: Record<string, unknown>
  confidence: number
}

export interface SearchHit {
  id: string
  title: string
  description: string | null
  content: string
  tags: string[]
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface ColorSpec {
  name: string
  value: string
  usage: string[]
}

export interface FontSpec {
  family: string
  usage: string[]
}

export interface DashboardStats {
  totalPrompts: number
  totalTags: number
  totalComponents: number
  recentPrompts: LibraryPrompt[]
  tagDistribution: Array<{ name: string; count: number }>
}