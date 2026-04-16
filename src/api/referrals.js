import { apiFetch } from './client'

export function getReferralInfo() {
  return apiFetch('/referral/my/')
}

export function getReferralList() {
  return apiFetch('/referral/list/')
}

export function prepareShare() {
  return apiFetch('/referral/prepare-share/', { method: 'POST' })
}

export function getReferralStats() {
  return apiFetch('/referral/stats/')
}
