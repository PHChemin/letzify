import { api, unwrap } from './client'
import type {
  BrandProject,
  ColorPalette,
  DashboardStats,
  LoginResponse,
  PaginatedProjects,
  PaletteColor,
  Typography,
  User,
  VisualAsset,
} from '../types'

export const authApi = {
  login: (email: string, password: string) =>
    unwrap<LoginResponse>(api.post('/auth/login', { email, password })),
  register: (payload: { email: string; password: string; name?: string }) =>
    unwrap<User>(api.post('/auth/register', payload)),
}

export const usersApi = {
  me: () => unwrap<User>(api.get('/users/me')),
}

export const dashboardApi = {
  stats: () => unwrap<DashboardStats>(api.get('/dashboard/stats')),
}

export const adminApi = {
  welcome: () => unwrap<{ message: string }>(api.get('/admin')),
}

export const projectsApi = {
  list: (params?: { filter?: string; page?: number; limit?: number }) =>
    unwrap<PaginatedProjects>(api.get('/projects', { params })),
  get: (id: string) => unwrap<BrandProject>(api.get(`/projects/${id}`)),
  create: (payload: { name: string; description?: string; status?: string }) =>
    unwrap<BrandProject>(api.post('/projects', payload)),
  update: (id: string, payload: Partial<{ name: string; description?: string; status?: string }>) =>
    unwrap<BrandProject>(api.patch(`/projects/${id}`, payload)),
  remove: (id: string) => api.delete(`/projects/${id}`),
}

export const palettesApi = {
  list: (projectId: string) =>
    unwrap<ColorPalette[]>(api.get(`/projects/${projectId}/palettes`)),
  get: (projectId: string, id: string) =>
    unwrap<ColorPalette>(api.get(`/projects/${projectId}/palettes/${id}`)),
  create: (projectId: string, payload: { name: string; description?: string; isPrimary?: boolean }) =>
    unwrap<ColorPalette>(api.post(`/projects/${projectId}/palettes`, payload)),
  update: (projectId: string, id: string, payload: Partial<{ name: string; description?: string; isPrimary?: boolean }>) =>
    unwrap<ColorPalette>(api.patch(`/projects/${projectId}/palettes/${id}`, payload)),
  remove: (projectId: string, id: string) =>
    api.delete(`/projects/${projectId}/palettes/${id}`),
}

export const colorsApi = {
  list: (paletteId: string) =>
    unwrap<PaletteColor[]>(api.get(`/palettes/${paletteId}/colors`)),
  create: (paletteId: string, payload: { name: string; hexCode: string; rgbValue?: string; cmykValue?: string }) =>
    unwrap<PaletteColor>(api.post(`/palettes/${paletteId}/colors`, payload)),
  update: (paletteId: string, colorId: string, payload: Partial<{ name: string; hexCode: string; rgbValue?: string; cmykValue?: string }>) =>
    unwrap<PaletteColor>(api.patch(`/palettes/${paletteId}/colors/${colorId}`, payload)),
  reorder: (paletteId: string, colorIds: string[]) =>
    unwrap<PaletteColor[]>(api.patch(`/palettes/${paletteId}/colors/reorder`, { colorIds })),
  remove: (paletteId: string, colorId: string) =>
    api.delete(`/palettes/${paletteId}/colors/${colorId}`),
}

export const typographiesApi = {
  list: (projectId: string) =>
    unwrap<Typography[]>(api.get(`/projects/${projectId}/typographies`)),
  create: (projectId: string, payload: {
    name: string
    fontFamily: string
    provider: string
    category?: string
    weightMin?: number
    weightMax?: number
  }) => unwrap<Typography>(api.post(`/projects/${projectId}/typographies`, payload)),
  update: (projectId: string, id: string, payload: Partial<{
    name: string
    fontFamily: string
    provider: string
    category?: string
    weightMin?: number
    weightMax?: number
  }>) => unwrap<Typography>(api.patch(`/projects/${projectId}/typographies/${id}`, payload)),
  remove: (projectId: string, id: string) =>
    api.delete(`/projects/${projectId}/typographies/${id}`),
}

export const assetsApi = {
  list: (projectId: string) =>
    unwrap<VisualAsset[]>(api.get(`/projects/${projectId}/assets`)),
  upload: (projectId: string, file: File, name: string, assetType: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', name)
    formData.append('assetType', assetType)
    return unwrap<VisualAsset>(
      api.post(`/projects/${projectId}/assets/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    )
  },
  remove: (projectId: string, id: string) =>
    api.delete(`/projects/${projectId}/assets/${id}`),
}

export async function downloadAsset(fileKey: string, fileName: string) {
  const [projectId, filePart] = fileKey.split('/')
  const response = await api.get(`/files/${projectId}/${filePart}`, {
    responseType: 'blob',
  })
  const url = window.URL.createObjectURL(response.data)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  window.URL.revokeObjectURL(url)
}
