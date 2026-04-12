import { apiFetch } from './client'

export function getSystemStats() {
  return apiFetch('/system/stats')
}
