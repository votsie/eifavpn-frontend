const API_BASE = '/api/proxy'

export class ApiError extends Error {
  constructor(message, status, errors = []) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(
      body.message || `API error ${res.status}`,
      res.status,
      body.errors || [],
    )
  }

  const data = await res.json()
  return data.response !== undefined ? data.response : data
}
