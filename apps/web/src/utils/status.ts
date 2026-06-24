import type { ProjectStatus } from '../types'

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  ALIGNMENT: 'Alinhamento',
  IN_PROGRESS: 'Em progresso',
  FINISHED: 'Finalizado',
}

export const STATUS_STYLES: Record<ProjectStatus, string> = {
  ALIGNMENT: 'bg-sky-100 text-sky-800 border-sky-200',
  IN_PROGRESS: 'bg-amber-100 text-amber-800 border-amber-200',
  FINISHED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
}

export function getStatusLabel(status: string) {
  return STATUS_LABELS[status as ProjectStatus] ?? status
}

export function getStatusStyle(status: string) {
  return STATUS_STYLES[status as ProjectStatus] ?? 'bg-background-light text-text-muted border-border-subtle'
}
