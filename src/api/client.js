const API_BASE = '/api'

export class ApiError extends Error {
  constructor(message, status, data = {}) {
    super(message)
    this.status = status
    this.data = data
  }
}

let onUnauthorized = null

export function setOnUnauthorized(fn) {
  onUnauthorized = fn
}

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const token = localStorage.getItem('eifavpn_access')

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let retried = false
  let res = await fetch(url, { ...options, headers })

  // Auto-refresh on 401
  if (res.status === 401 && token && !retried) {
    retried = true
    const refreshed = await tryRefreshToken()
    if (refreshed) {
      headers['Authorization'] = `Bearer ${localStorage.getItem('eifavpn_access')}`
      res = await fetch(url, { ...options, headers })
    } else {
      onUnauthorized?.()
      throw new ApiError('Unauthorized', 401)
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(
      body.error || body.detail || body.message || `API error ${res.status}`,
      res.status,
      body,
    )
  }

  const text = await res.text()
  if (!text) return null
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new ApiError('Invalid JSON response', res.status, { raw: text.slice(0, 200) })
  }
  return data.response !== undefined ? data.response : data
}

async function tryRefreshToken() {
  const refresh = localStorage.getItem('eifavpn_refresh')
  if (!refresh) return false

  try {
    const res = await fetch(`${API_BASE}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    })

    if (!res.ok) return false

    const data = await res.json()
    localStorage.setItem('eifavpn_access', data.access)
    if (data.refresh) {
      localStorage.setItem('eifavpn_refresh', data.refresh)
    }
    return true
  } catch {
    return false
  }
}
