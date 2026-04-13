import { Button } from '@heroui/react'
import { ArrowDown } from '@gravity-ui/icons'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 pt-20 pb-12 md:px-6 md:pt-24 md:pb-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
          className="font-heading mb-4 text-center text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl lg:text-[68px]"
        >
          <span className="text-foreground">Интернет без</span>
          <br />
          <span className="text-foreground">
            границ
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28, ease: [0.32, 0.72, 0, 1] }}
          className="mb-8 max-w-md text-center text-base leading-relaxed text-muted md:max-w-lg md:text-lg"
        >
          VPN на протоколе VLESS с шифрованием TLS 1.3.
          <br className="hidden sm:block" />
          Ваши данные — только ваши.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button
            size="lg"
            className="glow-cyan px-8 text-[15px] font-semibold"
            onPress={() => navigate('/register')}
          >
            Начать бесплатно
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.32, 0.72, 0, 1] }}
          className="mt-14 w-full max-w-xl md:mt-16"
        >
          <div className="grid grid-cols-3 divide-x divide-separator rounded-2xl border border-border bg-surface px-2 py-4 text-center md:px-6 md:py-5">
            <div>
              <p className="font-heading text-xl font-bold text-accent md:text-2xl">14</p>
              <p className="mt-0.5 text-[11px] text-muted md:text-xs">Серверов</p>
            </div>
            <div>
              <p className="font-heading text-xl font-bold text-foreground md:text-2xl">700+</p>
              <p className="mt-0.5 text-[11px] text-muted md:text-xs">Пользователей</p>
            </div>
            <div>
              <p className="font-heading text-xl font-bold text-foreground md:text-2xl">0</p>
              <p className="mt-0.5 text-[11px] text-muted md:text-xs">Логов</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="float absolute bottom-6"
      >
        <ArrowDown className="h-4 w-4 text-muted" />
      </motion.div>
    </section>
  )
}
