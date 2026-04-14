import { apiFetch } from './client'

export function getPlans() {
  return apiFetch('/subscriptions/plans/', { skipAuth: true })
}

export function purchase({ plan, period, payment_method, promo_code, crypto_asset }) {
  return apiFetch('/subscriptions/purchase/', {
    method: 'POST',
    body: JSON.stringify({ plan, period, payment_method, promo_code, crypto_asset }),
  })
}

export function getExchangeRates(amount = 0) {
  return apiFetch(`/subscriptions/rates/?amount=${amount}`, { skipAuth: true })
}

export function validatePromo({ code, plan, period }) {
  return apiFetch('/subscriptions/validate-promo/', {
    method: 'POST',
    body: JSON.stringify({ code, plan, period }),
  })
}

export function activateGift(code) {
  return apiFetch('/subscriptions/activate-gift/', {
    method: 'POST',
    body: JSON.stringify({ code }),
  })
}

export function getPromoInfo(code) {
  return apiFetch(`/subscriptions/promo-info/?code=${encodeURIComponent(code)}`, { skipAuth: true })
}

export function applyPendingPromo(code) {
  return apiFetch('/auth/apply-pending-promo/', {
    method: 'POST',
    body: JSON.stringify({ code }),
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

export function getHwidDevices() {
  return apiFetch('/subscriptions/devices/')
}

export function deleteHwidDevice(hwid) {
  return apiFetch('/subscriptions/devices/', {
    method: 'DELETE',
    body: JSON.stringify({ hwid }),
  })
}

export function getAccessibleNodes(uuid) {
  return apiFetch(`/proxy/users/${uuid}/accessible-nodes`)
}
