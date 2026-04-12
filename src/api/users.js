import { apiFetch } from './client'

export function getUserByShortUuid(shortUuid) {
  return apiFetch(`/users/by-short-uuid/${encodeURIComponent(shortUuid)}`)
}

export function getUserByEmail(email) {
  return apiFetch(`/users/by-email/${encodeURIComponent(email)}`)
}

export function getUser(uuid) {
  return apiFetch(`/users/${encodeURIComponent(uuid)}`)
}

export function updateUser(data) {
  return apiFetch('/users', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}
