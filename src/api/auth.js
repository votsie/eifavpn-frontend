import { apiFetch } from './client'

export function sendCode(email) {
  return apiFetch('/auth/send-code/', {
    method: 'POST',
    body: JSON.stringify({ email }),
    skipAuth: true,
  })
}

export function verifyCode({ email, code, password, name, referral_code }) {
  return apiFetch('/auth/verify-code/', {
    method: 'POST',
    body: JSON.stringify({ email, code, password, name, referral_code }),
    skipAuth: true,
  })
}

export function register({ email, password, name, referral_code }) {
  return apiFetch('/auth/register/', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, referral_code }),
    skipAuth: true,
  })
}

export function login({ email, password }) {
  return apiFetch('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  })
}

export function getMe() {
  return apiFetch('/auth/me/')
}

export function updateProfile(data) {
  return apiFetch('/auth/me/', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function logout(refresh) {
  return apiFetch('/auth/logout/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  }).catch(() => {})
}

export function changePassword({ old_password, new_password }) {
  return apiFetch('/auth/change-password/', {
    method: 'POST',
    body: JSON.stringify({ old_password, new_password }),
  })
}

export function deleteAccount(password) {
  return apiFetch('/auth/delete-account/', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
}
