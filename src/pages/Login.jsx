import LoginForm from '../components/auth/LoginForm'
import Background from '../components/Background'
import { motion } from 'motion/react'

export default function Login() {
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
        {/* Ambient glow behind card */}
        <div
          className="pointer-events-none absolute -inset-8 -z-10 rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
            opacity: 0.1,
            filter: 'blur(40px)',
          }}
        />

        <div className="rounded-[28px] border border-border bg-surface px-8 py-10 shadow-2xl">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center">
            <motion.img
              src="/logo.png"
              alt="EIFAVPN"
              className="mb-4 h-16 w-16 object-contain"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            />
            <h1 className="font-heading text-[22px] font-bold tracking-tight text-foreground">
              Личный кабинет
            </h1>
            <p className="mt-1.5 text-center text-[13px] leading-relaxed text-muted">
              Войдите через аккаунт или ID подписки
            </p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Footer */}
          <p className="mt-6 text-center text-[11px] leading-relaxed text-muted">
            Нажимая «Войти», вы соглашаетесь с{' '}
            <a href="/terms" className="text-muted underline decoration-muted/30 underline-offset-2 transition-colors hover:text-foreground">
              условиями использования
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
