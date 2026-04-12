export default function handler(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://eifavpn.vercel.app'
  const redirectUri = `${appUrl}/api/auth/google/callback`

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'email profile',
    access_type: 'offline',
    prompt: 'select_account',
  })

  res.redirect(302, `https://accounts.google.com/o/oauth2/auth?${params}`)
}
