export type Role = 'USER' | 'ADMIN'

export type ProjectStatus = 'ALIGNMENT' | 'IN_PROGRESS' | 'FINISHED'

export interface User {
  id: string
  name?: string | null
  email: string
  isActive: boolean
  roles: Role[]
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  accessToken: string
  user: User
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface BrandProject {
  id: string
  ownerId: string
  name: string
  slug: string
  description?: string | null
  status: ProjectStatus
  createdAt: string
  updatedAt: string
  assetCount?: number
  paletteCount?: number
  primaryColor?: string | null
}

export interface PaginatedProjects {
  items: BrandProject[]
  meta: PaginationMeta
}

export interface DashboardStats {
  totalProjects: number
  totalPalettes: number
  totalAssets: number
  totalTypographies: number
  recentProjects: BrandProject[]
}

export interface ColorPalette {
  id: string
  projectId: string
  name: string
  description?: string | null
  isPrimary: boolean
  createdAt: string
  updatedAt: string
  paletteColors?: PaletteColor[]
}

export interface PaletteColor {
  id: string
  paletteId: string
  name: string
  hexCode: string
  rgbValue?: string | null
  cmykValue?: string | null
  sortOrder: number
  createdAt: string
}

export interface Typography {
  id: string
  projectId: string
  name: string
  fontFamily: string
  provider: string
  category?: string | null
  weightMin?: number | null
  weightMax?: number | null
  createdAt: string
  updatedAt: string
}

export interface VisualAsset {
  id: string
  projectId: string
  uploadedById: string
  name: string
  assetType: string
  fileUrl: string
  fileKey: string
  mimeType?: string | null
  fileSizeBytes?: number | null
  createdAt: string
  updatedAt: string
}

export interface ApiSuccess<T> {
  success: true
  timestamp: string
  data: T
}

export interface ApiError {
  statusCode: number
  timestamp: string
  path: string
  message: string | string[]
}
