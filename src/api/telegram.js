export async function telegramWebAppAuth(initData) {
  const res = await fetch('/api/auth/telegram-webapp/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initData }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Telegram auth failed')
  }

  return res.json()
}

export async function telegramOidcAuth(idToken) {
  const res = await fetch('/api/auth/telegram/callback/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: idToken }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Telegram auth failed')
  }

  return res.json()
}
