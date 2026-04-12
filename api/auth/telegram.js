import crypto from 'crypto'

const REMNAWAVE_BASE = 'https://wavepanel.eifastore.ru/api'

export default async function handler(req, res) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://eifavpn.vercel.app'
  const botToken = process.env.TELEGRAM_BOT_TOKEN

  // Telegram sends auth data as query parameters
  const { id, first_name, username, auth_date, hash, ...rest } = req.query

  if (!id || !hash) {
    return res.redirect(302, `${appUrl}/cabinet/login?error=no_telegram_data`)
  }

  // Verify Telegram auth data
  const secret = crypto.createHash('sha256').update(botToken).digest()
  const checkFields = Object.entries({ id, first_name, username, auth_date, ...rest })
    .filter(([key]) => key !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => `${key}=${val}`)
    .join('\n')

  const hmac = crypto.createHmac('sha256', secret).update(checkFields).digest('hex')

  if (hmac !== hash) {
    return res.redirect(302, `${appUrl}/cabinet/login?error=telegram_invalid`)
  }

  // Check auth_date is not too old (allow 5 minutes)
  if (Date.now() / 1000 - Number(auth_date) > 300) {
    return res.redirect(302, `${appUrl}/cabinet/login?error=telegram_expired`)
  }

  try {
    // Look up user in Remnawave by Telegram ID
    const rmnRes = await fetch(`${REMNAWAVE_BASE}/users/by-telegram-id/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.REMNAWAVE_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!rmnRes.ok) {
      return res.redirect(302, `${appUrl}/cabinet/login?error=not_found&telegram=${encodeURIComponent(username || id)}`)
    }

    const data = await rmnRes.json()
    const user = data.response || data

    res.redirect(302, `${appUrl}/cabinet/login?auth=telegram&shortUuid=${encodeURIComponent(user.shortUuid)}`)
  } catch (err) {
    res.redirect(302, `${appUrl}/cabinet/login?error=server`)
  }
}
