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
