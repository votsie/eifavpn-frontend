import { useRef, useState, useEffect } from 'react'
import { Button } from '@heroui/react'
import { ArrowDown } from '@gravity-ui/icons'
import LiquidGlass from 'liquid-glass-react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

function ShieldBadge({ isDesktop, containerRef }) {
  const inner = (
    <div className="relative flex items-center justify-center rounded-2xl border border-accent/10 bg-white/[0.02] p-3">
      <img src="/logo.png" alt="" className="h-12 w-12 object-contain md:h-14 md:w-14" />
      <div className="pulse-ring absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent/20 md:h-20 md:w-20" />
      <div className="pulse-ring absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent/10 md:h-20 md:w-20" style={{ animationDelay: '0.7s' }} />
    </div>
  )

  if (!isDesktop) {
    return <div className="rounded-2xl border border-accent/10 bg-surface/40 p-5 backdrop-blur-xl">{inner}</div>
  }

  return (
    <LiquidGlass cornerRadius={20} blurAmount={0.07} saturation={140} displacementScale={50} elasticity={0.2} aberrationIntensity={2} mouseContainer={containerRef} padding="16px">
      {inner}
    </LiquidGlass>
  )
}

function StatsRibbon({ isDesktop, containerRef }) {
  const stats = [
    { value: '14', label: 'Серверов', accent: true },
    { value: '50M+', label: 'Пользователей' },
    { value: '0', label: 'Логов' },
  ]

  const inner = (
    <div className="grid grid-cols-3 divide-x divide-white/[0.05] rounded-2xl border border-white/[0.06] bg-white/[0.02] px-2 py-4 text-center md:px-6 md:py-5">
      {stats.map((s) => (
        <div key={s.label}>
          <p className={`font-heading text-xl font-bold md:text-2xl ${s.accent ? 'text-accent' : 'text-foreground'}`}>{s.value}</p>
          <p className="mt-0.5 text-[11px] text-muted md:text-xs">{s.label}</p>
        </div>
      ))}
    </div>
  )

  if (!isDesktop) return inner

  return (
    <LiquidGlass cornerRadius={16} blurAmount={0.05} saturation={125} displacementScale={40} elasticity={0.1} aberrationIntensity={1.5} mouseContainer={containerRef}>
      {inner}
    </LiquidGlass>
  )
}

export default function Hero() {
  const sectionRef = useRef(null)
  const navigate = useNavigate()
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section ref={sectionRef} className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 pt-20 pb-12 md:px-6 md:pt-24 md:pb-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="mb-8"
        >
          <ShieldBadge isDesktop={isDesktop} containerRef={sectionRef} />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
          className="font-heading mb-4 text-center text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl lg:text-[68px]"
        >
          <span className="text-foreground">Интернет без</span>
          <br />
          <span className="text-glow bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
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
          <Button
            size="lg"
            variant="outline"
            className="px-8 text-[15px] font-medium"
            onPress={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Узнать больше
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.32, 0.72, 0, 1] }}
          className="mt-14 w-full max-w-xl md:mt-16"
        >
          <StatsRibbon isDesktop={isDesktop} containerRef={sectionRef} />
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="float absolute bottom-6"
      >
        <ArrowDown className="h-4 w-4 text-muted/40" />
      </motion.div>
    </section>
  )
}
