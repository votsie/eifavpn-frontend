import { apiFetch } from './client'

export function getReferralInfo() {
  return apiFetch('/referral/my/')
}

export function getReferralList() {
  return apiFetch('/referral/list/')
}
