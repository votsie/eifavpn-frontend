import { useState, useEffect } from 'react'
import { Button, Input, Separator } from '@heroui/react'
import { useAuthStore } from '../../stores/authStore'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import TelegramWidget from './TelegramWidget'

export default function LoginForm() {
  const [value, setValue] = useState('')
  const { loginByShortUuid, loginByEmail, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const from = location.state?.from?.pathname || '/cabinet/overview'

  // Handle OAuth callback
  useEffect(() => {
    const auth = searchParams.get('auth')
    const shortUuid = searchParams.get('shortUuid')
    if (auth && shortUuid) {
      loginByShortUuid(shortUuid).then((success) => {
        if (success) navigate(from, { replace: true })
      })
    }
  }, [searchParams])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim()) return
    const isEmail = value.includes('@')
    const success = isEmail
      ? await loginByEmail(value.trim())
      : await loginByShortUuid(value.trim())
    if (success) navigate(from, { replace: true })
  }

  // Error messages
  const oauthError = searchParams.get('error')
  const oauthEmail = searchParams.get('email')
  const oauthTelegram = searchParams.get('telegram')

  let errorMessage = null
  if (oauthError === 'not_found') {
    errorMessage = oauthEmail
      ? `Подписка с email ${oauthEmail} не найдена`
      : oauthTelegram
        ? `Подписка с Telegram @${oauthTelegram} не найдена`
        : 'Подписка не найдена'
  } else if (oauthError) {
    errorMessage = 'Ошибка авторизации. Попробуйте ещё раз.'
  } else if (error === 'API error 404') {
    errorMessage = 'Подписка не найдена. Проверьте данные.'
  } else if (error) {
    errorMessage = error
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {/* OAuth buttons — same height, same width, same style */}
      <Button
        fullWidth
        size="lg"
        variant="outline"
        className="h-12 text-[14px] font-medium"
        onPress={() => { window.location.href = '/api/auth/google/' }}
        isDisabled={isLoading}
      >
        <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Войти через Google
      </Button>

      <TelegramWidget />

      {/* Divider */}
      <div className="flex items-center gap-4 py-1">
        <Separator className="flex-1" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted/60">или</span>
        <Separator className="flex-1" />
      </div>

      {/* Email / ID form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          label="Email или ID подписки"
          placeholder="your@email.com"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (errorMessage) clearError()
          }}
          isInvalid={!!errorMessage}
          size="lg"
          className="w-full"
        />

        {errorMessage && (
          <p className="text-[13px] text-danger">{errorMessage}</p>
        )}

        <Button
          type="submit"
          fullWidth
          size="lg"
          isPending={isLoading}
          className="glow-cyan h-12 text-[14px] font-semibold"
        >
          Войти
        </Button>
      </form>
    </div>
  )
}
