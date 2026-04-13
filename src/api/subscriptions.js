import { apiFetch } from './client'

export function getPlans() {
  return apiFetch('/subscriptions/plans/', { skipAuth: true })
}

export function purchase({ plan, period, payment_method }) {
  return apiFetch('/subscriptions/purchase/', {
    method: 'POST',
    body: JSON.stringify({ plan, period, payment_method }),
  })
}

export function getMySubscription() {
  return apiFetch('/subscriptions/my/')
}

export function activateTrial() {
  return apiFetch('/subscriptions/trial/', { method: 'POST' })
}

export function purchaseTrialUpgrade(payment_method = 'stars') {
  return apiFetch('/subscriptions/trial-upgrade/', {
    method: 'POST',
    body: JSON.stringify({ payment_method }),
  })
}

export function getHwidDevices(uuid) {
  return apiFetch(`/proxy/api/hwid-user-devices/by-user/${uuid}`)
}

export function getAccessibleNodes(uuid) {
  return apiFetch(`/proxy/users/${uuid}/accessible-nodes`)
}
