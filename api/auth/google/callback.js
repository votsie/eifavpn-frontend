const REMNAWAVE_BASE = 'https://wavepanel.eifastore.ru/api'

export default async function handler(req, res) {
  const { code } = req.query
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://eifavpn.vercel.app'
  const redirectUri = `${appUrl}/api/auth/google/callback`

  if (!code) {
    return res.redirect(302, `${appUrl}/cabinet/login?error=no_code`)
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenRes.ok) {
      return res.redirect(302, `${appUrl}/cabinet/login?error=token_exchange`)
    }

    const tokens = await tokenRes.json()

    // Get user info
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    if (!userInfoRes.ok) {
      return res.redirect(302, `${appUrl}/cabinet/login?error=userinfo`)
    }

    const userInfo = await userInfoRes.json()
    const email = userInfo.email

    if (!email) {
      return res.redirect(302, `${appUrl}/cabinet/login?error=no_email`)
    }

    // Look up user in Remnawave by email
    const rmnRes = await fetch(`${REMNAWAVE_BASE}/users/by-email/${encodeURIComponent(email)}`, {
      headers: {
        Authorization: `Bearer ${process.env.REMNAWAVE_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!rmnRes.ok) {
      return res.redirect(302, `${appUrl}/cabinet/login?error=not_found&email=${encodeURIComponent(email)}`)
    }

    const data = await rmnRes.json()
    const user = data.response || data

    // Redirect to frontend with shortUuid for session
    res.redirect(302, `${appUrl}/cabinet/login?auth=google&shortUuid=${encodeURIComponent(user.shortUuid)}`)
  } catch (err) {
    res.redirect(302, `${appUrl}/cabinet/login?error=server&message=${encodeURIComponent(err.message)}`)
  }
}
