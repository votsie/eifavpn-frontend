import LoginForm from '../components/auth/LoginForm'
import Background from '../components/Background'
import { motion } from 'motion/react'

export default function Login() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <Background />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="rounded-3xl border border-white/[0.08] bg-surface/70 p-8 backdrop-blur-xl">
          <div className="mb-6 flex flex-col items-center gap-3">
            <img src="/logo.png" alt="EIFAVPN" className="h-14 w-14 object-contain" />
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Личный кабинет
            </h1>
            <p className="text-center text-sm text-muted">
              Войдите с помощью ID подписки или email
            </p>
          </div>
          <LoginForm />
        </div>
      </motion.div>
    </div>
  )
}
