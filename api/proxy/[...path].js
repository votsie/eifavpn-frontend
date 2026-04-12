const REMNAWAVE_BASE = 'https://wavepanel.eifastore.ru/api'

// Only allow these endpoint prefixes
const ALLOWED_PREFIXES = [
  '/users/by-short-uuid/',
  '/users/by-email/',
  '/users/by-tag/',
  '/users/by-telegram-id/',
  '/nodes',
  '/hosts',
  '/system/stats',
  '/internal-squads',
]

export default async function handler(req, res) {
  const { path } = req.query
  const endpoint = '/' + (Array.isArray(path) ? path.join('/') : path)

  // Whitelist check
  const allowed = ALLOWED_PREFIXES.some((prefix) => endpoint.startsWith(prefix))

  // Allow PATCH /users only for specific safe fields
  if (req.method === 'PATCH' && endpoint === '/users') {
    // allowed — but we'll validate body below
  } else if (!allowed) {
    return res.status(403).json({ message: 'Endpoint not allowed' })
  }

  // For PATCH /users, strip dangerous fields
  if (req.method === 'PATCH' && endpoint === '/users') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const safeFields = ['uuid', 'email', 'telegramId', 'description']
    const filtered = {}
    for (const key of safeFields) {
      if (body[key] !== undefined) filtered[key] = body[key]
    }
    if (!filtered.uuid) {
      return res.status(400).json({ message: 'uuid is required' })
    }
    req.body = JSON.stringify(filtered)
  }

  const token = process.env.REMNAWAVE_BEARER_TOKEN
  if (!token) {
    return res.status(500).json({ message: 'Server misconfigured' })
  }

  try {
    const upstream = await fetch(`${REMNAWAVE_BASE}${endpoint}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      ...(req.method !== 'GET' && req.method !== 'HEAD'
        ? { body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body) }
        : {}),
    })

    const data = await upstream.text()
    res.status(upstream.status)
    res.setHeader('Content-Type', 'application/json')
    res.end(data)
  } catch (err) {
    res.status(502).json({ message: 'Upstream error', error: err.message })
  }
}
