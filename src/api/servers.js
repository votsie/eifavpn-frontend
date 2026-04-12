import { apiFetch } from './client'

export function getNodes() {
  return apiFetch('/nodes')
}

export function getHosts() {
  return apiFetch('/hosts')
}
