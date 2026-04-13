import { apiFetch } from './client'

export function getAdminStats() {
  return apiFetch('/admin/stats/')
}

export function getRegistrationChart() {
  return apiFetch('/admin/stats/chart/registrations/')
}

export function getRevenueChart() {
  return apiFetch('/admin/stats/chart/revenue/')
}

export function getAdminUsers(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiFetch(`/admin/users/?${query}`)
}

export function getAdminUser(id) {
  return apiFetch(`/admin/users/${id}/`)
}

export function updateAdminUser(id, data) {
  return apiFetch(`/admin/users/${id}/`, { method: 'PATCH', body: JSON.stringify(data) })
}

export function extendUserSubscription(id, days) {
  return apiFetch(`/admin/users/${id}/extend/`, { method: 'POST', body: JSON.stringify({ days }) })
}

export function getAdminSubscriptions(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiFetch(`/admin/subscriptions/?${query}`)
}
