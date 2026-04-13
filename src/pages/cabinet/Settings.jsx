import { useState, useEffect } from 'react'
import { Button, Input, Chip } from '@heroui/react'
import { Copy, Pencil } from '@gravity-ui/icons'
import { motion } from 'motion/react'
import { useAuthStore } from '../../stores/authStore'
import { updateProfile, changePassword, deleteAccount, linkEmail, linkEmailVerify, linkTelegram, linkTelegramOidc, mergeAccountPreview, mergeAccountConfirm } from '../../api/auth'
import { useTelegramLogin } from '../../components/TelegramLoginWidget'
import MergeAccountModal from '../../components/cabinet/MergeAccountModal'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getMySubscription } from '../../api/subscriptions'

function getEffectiveTheme() {
  const saved = localStorage.getItem('eifavpn_theme')
  if (saved === 'light' || saved === 'dark') return saved
  return 'auto'
}

function applyTheme(choice) {
  localStorage.setItem('eifavpn_theme', choice)
  let resolved = choice
  if (choice === 'auto') {
    const tg = window.Telegram?.WebApp
    if (tg?.colorScheme) {
      resolved = tg.colorScheme
    } else {
      resolved = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
    }
  }
  document.documentElement.setAttribute('data-theme', resolved)
}

export default function Settings() {
  const { user, fetchMe, logout, loginWithTokens } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Theme
  const [theme, setThemeState] = useState(getEffectiveTheme)

  function setTheme(t) {
    setThemeState(t)
    applyTheme(t)
  }

  // Profile editing
  const [editingProfile, setEditingProfile] = useState(false)
  const [firstName, setFirstName] = useState(user?.first_name || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMsg, setProfileMsg] = useState(null)

  // Password
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdMsg, setPwdMsg] = useState(null)

  // Subscription URL
  const [subUrl, setSubUrl] = useState('')
  const [copiedSub, setCopiedSub] = useState(false)
  const [copiedRef, setCopiedRef] = useState(false)

  // Link email
  const [linkEmailStep, setLinkEmailStep] = useState(null) // null | 'email' | 'code'
  const [linkEmailValue, setLinkEmailValue] = useState('')
  const [linkEmailCode, setLinkEmailCode] = useState('')
  const [linkEmailLoading, setLinkEmailLoading] = useState(false)
  const [linkEmailMsg, setLinkEmailMsg] = useState(null)

  // Link message (for Google OAuth redirect)
  const [linkMsg, setLinkMsg] = useState(null)

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  // Merge state
  const [mergePreview, setMergePreview] = useState(null)
  const [mergeProvider, setMergeProvider] = useState(null)
  const [mergeLoading, setMergeLoading] = useState(false)
  const [mergeError, setMergeError] = useState(null)
  const [showMergeModal, setShowMergeModal] = useState(false)

  // Handle Google OAuth link redirect
  useEffect(() => {
    const linked = searchParams.get('linked')
    const error = searchParams.get('error')
    const access = searchParams.get('access')
    const refresh = searchParams.get('refresh')

    if (linked === 'google' && access && refresh) {
      loginWithTokens(access, refresh).then(() => {
        setLinkMsg({ type: 'success', text: 'Google аккаунт успешно привязан' })
      })
      // Clean URL
      searchParams.delete('linked')
      searchParams.delete('access')
      searchParams.delete('refresh')
      setSearchParams(searchParams, { replace: true })
    } else if (error === 'google_taken') {
      setLinkMsg({ type: 'error', text: 'Этот Google аккаунт уже привязан к другому пользователю' })
      searchParams.delete('error')
      setSearchParams(searchParams, { replace: true })
    } else if (error === 'google_already_linked') {
      setLinkMsg({ type: 'error', text: 'Google аккаунт уже привязан' })
      searchParams.delete('error')
      setSearchParams(searchParams, { replace: true })
    } else if (error === 'link_failed') {
      setLinkMsg({ type: 'error', text: 'Ошибка привязки Google аккаунта' })
      searchParams.delete('error')
      setSearchParams(searchParams, { replace: true })
    }
  }, [])

  useEffect(() => {
    getMySubscription()
      .then((data) => {
        if (data?.subscription?.subscription_url) {
          setSubUrl(data.subscription.subscription_url)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '')
      setAvatarUrl(user.avatar_url || '')
      if (user.subscription_url && !subUrl) {
        setSubUrl(user.subscription_url)
      }
    }
  }, [user])

  // Detection helpers
  const hasPlaceholderEmail = user?.email?.startsWith('tg_') && user?.email?.endsWith('@eifavpn.ru')
  const hasRealEmail = !hasPlaceholderEmail
  const canLinkEmail = hasPlaceholderEmail
  const canLinkGoogle = !user?.google_id
  const canLinkTelegram = !user?.telegram_id

  // Telegram OIDC login hook
  const { openTelegramLogin, sdkReady: tgReady, loading: tgLinkLoading } = useTelegramLogin(handleTelegramOidcAuth)

  async function handleLinkEmailSend() {
    setLinkEmailLoading(true)
    setLinkEmailMsg(null)
    try {
      await linkEmail(linkEmailValue)
      setLinkEmailStep('code')
      setLinkEmailMsg({ type: 'success', text: 'Код отправлен на email' })
    } catch (err) {
      setLinkEmailMsg({ type: 'error', text: err.message || 'Ошибка отправки кода' })
    } finally {
      setLinkEmailLoading(false)
    }
  }

  async function handleLinkEmailVerify() {
    setLinkEmailLoading(true)
    setLinkEmailMsg(null)
    try {
      await linkEmailVerify({ email: linkEmailValue, code: linkEmailCode })
      await fetchMe()
      setLinkEmailStep(null)
      setLinkEmailValue('')
      setLinkEmailCode('')
      setLinkEmailMsg({ type: 'success', text: 'Email успешно привязан' })
    } catch (err) {
      setLinkEmailMsg({ type: 'error', text: err.message || 'Неверный код' })
    } finally {
      setLinkEmailLoading(false)
    }
  }

  function handleLinkGoogle() {
    const token = localStorage.getItem('eifavpn_access')
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/api/auth/link-google/'
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'token'
    input.value = token
    form.appendChild(input)
    document.body.appendChild(form)
    form.submit()
  }

  async function handleLinkTelegram() {
    const tg = window.Telegram?.WebApp
    if (tg?.initData) {
      // Mini App context — use initData directly
      try {
        await linkTelegram(tg.initData)
        await fetchMe()
        setLinkMsg({ type: 'success', text: 'Telegram успешно привязан' })
      } catch (err) {
        if (err.data?.code === 'PROVIDER_ALREADY_LINKED' && err.data?.can_merge) {
          try {
            const preview = await mergeAccountPreview(err.data.secondary_user_id)
            setMergePreview(preview)
            setMergeProvider('telegram')
            setShowMergeModal(true)
          } catch (previewErr) {
            setLinkMsg({ type: 'error', text: previewErr.message || 'Ошибка получения данных для объединения' })
          }
        } else {
          setLinkMsg({ type: 'error', text: err.message || 'Ошибка привязки Telegram' })
        }
      }
    } else {
      // Web context — open Telegram OIDC popup
      openTelegramLogin()
    }
  }

  async function handleTelegramOidcAuth({ id_token }) {
    setLinkMsg(null)
    try {
      await linkTelegramOidc(id_token)
      await fetchMe()
      setLinkMsg({ type: 'success', text: 'Telegram успешно привязан' })
    } catch (err) {
      if (err.data?.code === 'PROVIDER_ALREADY_LINKED' && err.data?.can_merge) {
        try {
          const preview = await mergeAccountPreview(err.data.secondary_user_id)
          setMergePreview(preview)
          setMergeProvider('telegram')
          setShowMergeModal(true)
        } catch (previewErr) {
          setLinkMsg({ type: 'error', text: previewErr.message || 'Ошибка получения данных для объединения' })
        }
      } else {
        setLinkMsg({ type: 'error', text: err.message || 'Ошибка привязки Telegram' })
      }
    }
  }

  async function handleMergeConfirm() {
    if (!mergePreview?.merge_token) return
    setMergeLoading(true)
    setMergeError(null)
    try {
      const result = await mergeAccountConfirm(mergePreview.merge_token)
      if (result.tokens) {
        loginWithTokens(result.tokens.access, result.tokens.refresh)
      }
      await fetchMe()
      setShowMergeModal(false)
      setMergePreview(null)
      setLinkMsg({ type: 'success', text: 'Аккаунты успешно объединены' })
    } catch (err) {
      setMergeError(err.message || 'Ошибка объединения аккаунтов')
    } finally {
      setMergeLoading(false)
    }
  }

  async function handleSaveProfile() {
    setProfileLoading(true)
    setProfileMsg(null)
    try {
      await updateProfile({ first_name: firstName, avatar_url: avatarUrl })
      await fetchMe()
      setProfileMsg({ type: 'success', text: 'Профиль обновлён' })
      setEditingProfile(false)
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'Ошибка сохранения' })
    } finally {
      setProfileLoading(false)
    }
  }

  async function handleChangePassword() {
    setPwdMsg(null)

    if (newPassword.length < 6) {
      setPwdMsg({ type: 'error', text: 'Пароль должен быть не менее 6 символов' })
      return
    }
    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: 'error', text: 'Пароли не совпадают' })
      return
    }

    setPwdLoading(true)
    try {
      await changePassword({ old_password: oldPassword, new_password: newPassword })
      setPwdMsg({ type: 'success', text: 'Пароль изменён' })
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPwdMsg({ type: 'error', text: err.message || 'Ошибка смены пароля' })
    } finally {
      setPwdLoading(false)
    }
  }

  function copyToClipboard(text, setCopiedFn) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedFn(true)
      setTimeout(() => setCopiedFn(false), 2000)
    })
  }

  return (
    <div className="mx-auto max-w-3xl w-full space-y-3 overflow-hidden md:space-y-5">
      <h1 className="font-heading text-2xl font-bold text-foreground">Настройки</h1>

      {/* Theme selector */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="theme-card rounded-2xl border border-border bg-surface p-4 md:p-5"
      >
        <p className="mb-3 text-sm font-semibold text-foreground">Тема оформления</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={theme === 'light' ? undefined : 'outline'}
            onPress={() => setTheme('light')}
          >
            Светлая
          </Button>
          <Button
            size="sm"
            variant={theme === 'dark' ? undefined : 'outline'}
            onPress={() => setTheme('dark')}
          >
            Тёмная
          </Button>
          <Button
            size="sm"
            variant={theme === 'auto' ? undefined : 'outline'}
            onPress={() => setTheme('auto')}
          >
            Авто
          </Button>
        </div>
      </motion.div>

      {/* Profile section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="theme-card rounded-2xl border border-border bg-surface p-4 md:p-5"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Профиль</p>
          {!editingProfile && (
            <Button
              size="sm"
              variant="outline"
              startContent={<Pencil className="h-3.5 w-3.5" />}
              onPress={() => setEditingProfile(true)}
            >
              Изменить
            </Button>
          )}
        </div>

        <div className="mt-4 space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-accent/15">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Аватар"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              ) : (
                <span className="text-xl font-bold text-accent">
                  {(user?.first_name || user?.email || '?')[0].toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              {editingProfile ? (
                <Input
                  label="URL аватара"
                  placeholder="https://..."
                  value={avatarUrl}
                  onValueChange={setAvatarUrl}
                  size="sm"
                  classNames={{ inputWrapper: 'border-border bg-surface' }}
                />
              ) : (
                <p className="text-xs text-muted">
                  {avatarUrl || 'Аватар не установлен'}
                </p>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted">Имя</p>
            {editingProfile ? (
              <Input
                placeholder="Ваше имя"
                value={firstName}
                onValueChange={setFirstName}
                size="sm"
                classNames={{ inputWrapper: 'border-border bg-surface' }}
              />
            ) : (
              <p className="text-sm text-foreground">{user?.first_name || 'Не указано'}</p>
            )}
          </div>

          {/* Email (read-only) */}
          <div>
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted">Email</p>
            <p className="text-sm text-foreground">{user?.email}</p>
          </div>

          {/* Save/Cancel buttons */}
          {editingProfile && (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="glow-cyan font-semibold"
                onPress={handleSaveProfile}
                isPending={profileLoading}
              >
                Сохранить
              </Button>
              <Button
                size="sm"
                variant="outline"
                onPress={() => {
                  setEditingProfile(false)
                  setFirstName(user?.first_name || '')
                  setAvatarUrl(user?.avatar_url || '')
                }}
              >
                Отмена
              </Button>
            </div>
          )}

          {profileMsg && (
            <p className={`text-sm ${profileMsg.type === 'success' ? 'text-accent' : 'text-danger'}`}>
              {profileMsg.text}
            </p>
          )}
        </div>
      </motion.div>

      {/* Linked accounts */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="theme-card rounded-2xl border border-border bg-surface p-4 md:p-5"
      >
        <p className="mb-3 text-sm font-semibold text-foreground">Привязанные аккаунты</p>

        {linkMsg && (
          <p className={`mb-3 text-sm ${linkMsg.type === 'success' ? 'text-accent' : 'text-danger'}`}>
            {linkMsg.text}
          </p>
        )}

        <div className="space-y-3">
          {/* Email */}
          <div className="rounded-xl border border-border theme-subtle-bg px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-muted" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-[11px] text-muted">
                    {hasRealEmail ? user?.email : 'Не привязан'}
                  </p>
                </div>
              </div>
              {hasRealEmail ? (
                <Chip size="sm" className="bg-accent/15 text-[10px] font-semibold text-accent">
                  Привязан
                </Chip>
              ) : canLinkEmail ? (
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => setLinkEmailStep('email')}
                >
                  Привязать
                </Button>
              ) : (
                <Chip size="sm" className="bg-default text-[10px] text-muted">Нет</Chip>
              )}
            </div>

            {/* Link email inline form */}
            {linkEmailStep === 'email' && (
              <div className="mt-3 space-y-2">
                <Input
                  type="email"
                  placeholder="Введите email"
                  value={linkEmailValue}
                  onValueChange={setLinkEmailValue}
                  size="sm"
                  classNames={{ inputWrapper: 'border-border bg-surface' }}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="glow-cyan font-semibold"
                    onPress={handleLinkEmailSend}
                    isPending={linkEmailLoading}
                    isDisabled={!linkEmailValue}
                  >
                    Отправить код
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onPress={() => { setLinkEmailStep(null); setLinkEmailMsg(null) }}
                  >
                    Отмена
                  </Button>
                </div>
                {linkEmailMsg && (
                  <p className={`text-xs ${linkEmailMsg.type === 'success' ? 'text-accent' : 'text-danger'}`}>
                    {linkEmailMsg.text}
                  </p>
                )}
              </div>
            )}
            {linkEmailStep === 'code' && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-muted">Код отправлен на {linkEmailValue}</p>
                <Input
                  placeholder="Введите код"
                  value={linkEmailCode}
                  onValueChange={setLinkEmailCode}
                  size="sm"
                  classNames={{ inputWrapper: 'border-border bg-surface' }}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="glow-cyan font-semibold"
                    onPress={handleLinkEmailVerify}
                    isPending={linkEmailLoading}
                    isDisabled={!linkEmailCode}
                  >
                    Подтвердить
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onPress={() => { setLinkEmailStep(null); setLinkEmailMsg(null) }}
                  >
                    Отмена
                  </Button>
                </div>
                {linkEmailMsg && (
                  <p className={`text-xs ${linkEmailMsg.type === 'success' ? 'text-accent' : 'text-danger'}`}>
                    {linkEmailMsg.text}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Google */}
          <div className="flex items-center justify-between rounded-xl border border-border theme-subtle-bg px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">Google</p>
                <p className="text-[11px] text-muted">
                  {user?.google_id ? 'Привязан' : 'Не привязан'}
                </p>
              </div>
            </div>
            {user?.google_id ? (
              <Chip size="sm" className="bg-accent/15 text-[10px] font-semibold text-accent">
                Привязан
              </Chip>
            ) : canLinkGoogle ? (
              <Button size="sm" variant="outline" onPress={handleLinkGoogle}>
                Привязать
              </Button>
            ) : (
              <Chip size="sm" className="bg-default text-[10px] text-muted">Нет</Chip>
            )}
          </div>

          {/* Telegram */}
          <div className="flex items-center justify-between rounded-xl border border-border theme-subtle-bg px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#26A5E4]" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">Telegram</p>
                <p className="text-[11px] text-muted">
                  {user?.telegram_id ? `ID: ${user.telegram_id}` : 'Не привязан'}
                </p>
              </div>
            </div>
            {user?.telegram_id ? (
              <Chip size="sm" className="bg-accent/15 text-[10px] font-semibold text-accent">
                Привязан
              </Chip>
            ) : canLinkTelegram ? (
              <Button size="sm" variant="outline" onPress={handleLinkTelegram}>
                Привязать
              </Button>
            ) : (
              <Chip size="sm" className="bg-default text-[10px] text-muted">Нет</Chip>
            )}
          </div>
        </div>
      </motion.div>

      {/* Subscription URL */}
      {subUrl && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="theme-card rounded-2xl border border-border bg-surface p-4 md:p-5"
        >
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted md:text-[11px]">
            URL подписки
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-lg theme-code-bg px-3 py-2 font-mono text-xs text-accent">
              {subUrl}
            </code>
            <Button
              size="sm"
              variant={copiedSub ? undefined : 'outline'}
              className={copiedSub ? 'bg-accent text-accent-foreground' : ''}
              onPress={() => copyToClipboard(subUrl, setCopiedSub)}
              startContent={<Copy className="h-3.5 w-3.5" />}
            >
              {copiedSub ? 'Скопировано!' : 'Копировать'}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Referral code */}
      {user?.referral_code && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="theme-card rounded-2xl border border-border bg-surface p-4 md:p-5"
        >
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted md:text-[11px]">
            Реферальный код
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-lg theme-code-bg px-3 py-2 font-mono text-sm font-bold tracking-widest text-accent">
              {user.referral_code}
            </code>
            <Button
              size="sm"
              variant={copiedRef ? undefined : 'outline'}
              className={copiedRef ? 'bg-accent text-accent-foreground' : ''}
              onPress={() =>
                copyToClipboard(
                  `https://eifavpn.ru/register?ref=${user.referral_code}`,
                  setCopiedRef,
                )
              }
              startContent={<Copy className="h-3.5 w-3.5" />}
            >
              {copiedRef ? 'Скопировано!' : 'Ссылка'}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Change password */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="theme-card rounded-2xl border border-border bg-surface p-4 md:p-5"
      >
        <p className="mb-4 text-sm font-semibold text-foreground">Сменить пароль</p>
        <div className="space-y-3">
          <Input
            type="password"
            label="Текущий пароль"
            placeholder="Введите текущий пароль"
            value={oldPassword}
            onValueChange={setOldPassword}
            size="sm"
            classNames={{ inputWrapper: 'border-border bg-surface' }}
          />
          <Input
            type="password"
            label="Новый пароль"
            placeholder="Минимум 6 символов"
            value={newPassword}
            onValueChange={setNewPassword}
            size="sm"
            classNames={{ inputWrapper: 'border-border bg-surface' }}
          />
          <Input
            type="password"
            label="Подтвердите пароль"
            placeholder="Повторите новый пароль"
            value={confirmPassword}
            onValueChange={setConfirmPassword}
            size="sm"
            classNames={{ inputWrapper: 'border-border bg-surface' }}
          />
          <Button
            size="sm"
            variant="outline"
            onPress={handleChangePassword}
            isPending={pwdLoading}
            isDisabled={!newPassword || !confirmPassword}
          >
            Сменить пароль
          </Button>
          {pwdMsg && (
            <p className={`text-sm ${pwdMsg.type === 'success' ? 'text-accent' : 'text-danger'}`}>
              {pwdMsg.text}
            </p>
          )}
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-danger/20 bg-danger/[0.04] p-5"
      >
        <p className="mb-2 text-sm font-semibold text-danger">Опасная зона</p>
        <p className="mb-3 text-[13px] text-muted">
          Удаление аккаунта необратимо. Все данные, включая подписку и историю, будут потеряны.
        </p>
        <Button
          size="sm"
          color="danger"
          variant="outline"
          onPress={() => setShowDeleteConfirm(true)}
        >
          Удалить аккаунт
        </Button>
        {showDeleteConfirm && (
          <div className="mt-3 space-y-3 rounded-xl border border-danger/20 bg-danger/[0.04] p-4">
            <p className="text-sm text-foreground">Вы уверены? Все данные будут удалены безвозвратно.</p>
            {user?.has_usable_password !== false && (
              <Input
                type="password"
                placeholder="Введите пароль для подтверждения"
                value={deletePassword}
                onValueChange={setDeletePassword}
                size="sm"
                classNames={{ inputWrapper: 'border-border bg-surface' }}
              />
            )}
            {deleteError && <p className="text-sm text-danger">{deleteError}</p>}
            <div className="flex gap-2">
              <Button size="sm" color="danger" onPress={async () => {
                setDeleteLoading(true)
                setDeleteError(null)
                try {
                  await deleteAccount(deletePassword)
                  await logout()
                  navigate('/')
                } catch (err) {
                  setDeleteError(err.message || 'Ошибка удаления аккаунта')
                } finally {
                  setDeleteLoading(false)
                }
              }} isPending={deleteLoading}>
                Удалить навсегда
              </Button>
              <Button size="sm" variant="outline" onPress={() => { setShowDeleteConfirm(false); setDeletePassword(''); setDeleteError(null) }}>
                Отмена
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      <MergeAccountModal
        isOpen={showMergeModal}
        onClose={() => { setShowMergeModal(false); setMergePreview(null); setMergeError(null) }}
        preview={mergePreview}
        provider={mergeProvider}
        onConfirm={handleMergeConfirm}
        loading={mergeLoading}
        error={mergeError}
      />
    </div>
  )
}
