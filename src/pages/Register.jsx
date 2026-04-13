import { useState } from 'react'
import { Button, Input, Separator } from '@heroui/react'
import { useAuthStore } from '../stores/authStore'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { sendCode, verifyCode } from '../api/auth'
import { telegramOidcAuth } from '../api/telegram'
import { useTelegramLogin } from '../components/TelegramLoginWidget'
import Background from '../components/Background'
import { motion } from 'motion/react'

export default function Register() {
  const [step, setStep] = useState('form') // 'form' | 'code'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { loginWithData } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const referralCode = searchParams.get('ref') || ''
  const preselectedPlan = searchParams.get('plan') || ''
  const { openTelegramLogin, sdkReady: tgReady, loading: tgLoading, error: tgError } = useTelegramLogin(
    async ({ id_token }) => {
      setLoading(true)
      setError(null)
      try {
        const data = await telegramOidcAuth(id_token)
        if (data.tokens && data.user) {
          loginWithData(data.user, data.tokens)
          const redirect = preselectedPlan
            ? `/cabinet/purchase?plan=${preselectedPlan}`
            : '/cabinet/overview'
          navigate(redirect, { replace: true })
        }
      } catch (err) {
        setError(err.message || 'Ошибка авторизации через Telegram')
      } finally {
        setLoading(false)
      }
    }
  )

  async function handleSendCode(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    try {
      const result = await sendCode(email.trim())
      setStep('code')
      if (result?.code) setCode(result.code)
    } catch (err) {
      setError(err.message || 'Ошибка отправки кода')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyCode(e) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await verifyCode({
        email: email.trim(),
        code: code.trim(),
        password: password || undefined,
        name: name.trim(),
        referral_code: referralCode,
      })
      if (data.tokens) {
        loginWithData(data.user, data.tokens)
        const redirect = preselectedPlan
          ? `/cabinet/purchase?plan=${preselectedPlan}`
          : '/cabinet/overview'
        navigate(redirect, { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Неверный код')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5 py-12">
      <Background />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="relative z-10 w-full"
        style={{ maxWidth: '400px' }}
      >
        <div className="pointer-events-none absolute -inset-8 -z-10 rounded-full"
          style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(40px)' }} />

        <div className="rounded-[28px] border border-border bg-surface px-8 py-10 shadow-2xl">
          <div className="mb-8 flex flex-col items-center">
            <motion.img src="/logo.png" alt="EIFAVPN"
              className="mb-4 h-16 w-16 object-contain"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, duration: 0.5 }} />
            <h1 className="font-heading text-[22px] font-bold tracking-tight text-foreground">
              Создать аккаунт
            </h1>
            <p className="mt-1.5 text-center text-[13px] leading-relaxed text-muted">
              {step === 'form' ? 'Зарегистрируйтесь для доступа к VPN' : `Код отправлен на ${email}`}
            </p>
            {referralCode && (
              <p className="mt-2 rounded-lg bg-accent/10 px-3 py-1 text-xs text-accent">
                Реферальный код: {referralCode}
              </p>
            )}
          </div>

          {step === 'form' && (
            <div className="flex w-full flex-col gap-3">
              {/* OAuth */}
              <Button fullWidth size="lg" variant="outline" className="h-12 text-[14px] font-medium"
                onPress={() => { window.location.href = '/api/auth/google/' }} isDisabled={loading}>
                <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Продолжить с Google
              </Button>

              <Button fullWidth size="lg" variant="outline" className="h-12 text-[14px] font-medium"
                onPress={openTelegramLogin} isDisabled={loading || tgLoading || !tgReady} isPending={tgLoading}>
                <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" fill="#29B6F6"/>
                </svg>
                Продолжить с Telegram
              </Button>
              {tgError && <p className="text-center text-[13px] text-danger">{tgError}</p>}

              <div className="flex items-center gap-4 py-1">
                <Separator className="flex-1" />
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted">или по email</span>
                <Separator className="flex-1" />
              </div>

              <form onSubmit={handleSendCode} className="flex flex-col gap-3">
                <Input label="Имя" placeholder="Как вас зовут" value={name}
                  onChange={(e) => setName(e.target.value)} size="lg" />
                <Input label="Email" type="email" placeholder="your@email.com" value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null) }} isInvalid={!!error} size="lg" />
                <Input label="Пароль (необязательно)" type="password" placeholder="Минимум 6 символов"
                  value={password} onChange={(e) => setPassword(e.target.value)} size="lg" />

                {error && <p className="text-[13px] text-danger">{error}</p>}

                <Button type="submit" fullWidth size="lg" isPending={loading}
                  className="glow-cyan h-12 text-[14px] font-semibold">
                  Получить код
                </Button>
              </form>

              <p className="mt-1 text-center text-[13px] text-muted">
                Уже есть аккаунт?{' '}
                <Link to="/cabinet/login" className="font-medium text-accent transition-colors hover:text-accent/80">Войти</Link>
              </p>
            </div>
          )}

          {step === 'code' && (
            <form onSubmit={handleVerifyCode} className="flex w-full flex-col gap-3">
              <Input label="Код из письма" placeholder="123456" value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(null) }}
                isInvalid={!!error} size="lg" maxLength={6} />

              {error && <p className="text-[13px] text-danger">{error}</p>}

              <Button type="submit" fullWidth size="lg" isPending={loading}
                isDisabled={code.length < 6} className="glow-cyan h-12 text-[14px] font-semibold">
                Создать аккаунт
              </Button>

              <div className="flex items-center justify-between">
                <button type="button" onClick={() => { setStep('form'); setCode(''); setError(null) }}
                  className="text-[13px] text-muted transition-colors hover:text-foreground">← Назад</button>
                <button type="button" onClick={async () => {
                  setLoading(true); try { await sendCode(email.trim()) } catch {} finally { setLoading(false) }
                }} className="text-[13px] text-accent transition-colors hover:text-accent/80">Отправить снова</button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-[11px] leading-relaxed text-muted">
            Нажимая «Создать аккаунт», вы соглашаетесь с{' '}
            <a href="/terms" className="text-muted underline decoration-muted/30 underline-offset-2 transition-colors hover:text-foreground">
              условиями использования
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
