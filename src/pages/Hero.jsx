import { useRef, useState, useEffect } from 'react'
import { Button } from '@heroui/react'
import { ArrowDown } from '@gravity-ui/icons'
import LiquidGlass from 'liquid-glass-react'
import { motion } from 'motion/react'

function ShieldBadge({ isDesktop, containerRef }) {
  const inner = (
    <div className="relative flex items-center justify-center rounded-3xl border border-accent/10 bg-white/[0.03] p-2">
      <img src="/logo.png" alt="EIFAVPN" className="h-14 w-14 object-contain md:h-16 md:w-16" />
      <div className="pulse-ring absolute inset-0 rounded-full border-2 border-accent/25" />
      <div className="pulse-ring absolute inset-0 rounded-full border-2 border-accent/15" style={{ animationDelay: '0.7s' }} />
    </div>
  )

  if (!isDesktop) {
    return <div className="rounded-3xl border border-accent/10 bg-surface/50 p-5 backdrop-blur-xl">{inner}</div>
  }

  return (
    <LiquidGlass
      cornerRadius={24}
      blurAmount={0.08}
      saturation={150}
      displacementScale={55}
      elasticity={0.25}
      aberrationIntensity={3}
      mouseContainer={containerRef}
      padding="20px"
    >
      {inner}
    </LiquidGlass>
  )
}

function StatsRibbon({ isDesktop, containerRef }) {
  const inner = (
    <div className="grid grid-cols-3 divide-x divide-white/[0.06] rounded-[20px] border border-white/[0.08] bg-white/[0.03] px-4 py-5 text-center">
      <div>
        <p className="font-heading text-2xl font-bold text-accent md:text-3xl">14</p>
        <p className="mt-1 text-xs text-muted md:text-sm">Серверов</p>
      </div>
      <div>
        <p className="font-heading text-2xl font-bold text-foreground md:text-3xl">50M+</p>
        <p className="mt-1 text-xs text-muted md:text-sm">Пользователей</p>
      </div>
      <div>
        <p className="font-heading text-2xl font-bold text-foreground md:text-3xl">0</p>
        <p className="mt-1 text-xs text-muted md:text-sm">Логов</p>
      </div>
    </div>
  )

  if (!isDesktop) {
    return <div className="backdrop-blur-xl">{inner}</div>
  }

  return (
    <LiquidGlass
      cornerRadius={20}
      blurAmount={0.06}
      saturation={130}
      displacementScale={45}
      elasticity={0.12}
      aberrationIntensity={2}
      mouseContainer={containerRef}
    >
      {inner}
    </LiquidGlass>
  )
}

export default function Hero() {
  const sectionRef = useRef(null)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-16"
    >
      {/* Shield */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        className="mb-10"
      >
        <ShieldBadge isDesktop={isDesktop} containerRef={sectionRef} />
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
        className="font-heading mb-5 text-center text-5xl font-extrabold leading-tight tracking-tight md:text-7xl"
      >
        <span className="text-foreground">Интернет без</span>
        <br />
        <span className="text-glow bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
          границ
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.32, 0.72, 0, 1] }}
        className="mb-10 max-w-lg text-center text-lg leading-relaxed text-muted md:text-xl"
      >
        VPN на протоколе VLESS с шифрованием TLS 1.3.
        <br className="hidden sm:block" />
        Ваши данные — только ваши.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="flex flex-col items-center gap-4 sm:flex-row"
      >
        <Button
          size="lg"
          className="glow-cyan px-8 text-base font-semibold"
          onPress={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Начать бесплатно
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="px-8 text-base font-medium"
          onPress={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Узнать больше
        </Button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="float absolute bottom-8"
      >
        <ArrowDown className="h-5 w-5 text-muted/50" />
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: [0.32, 0.72, 0, 1] }}
        className="mt-16 w-full max-w-3xl"
      >
        <StatsRibbon isDesktop={isDesktop} containerRef={sectionRef} />
      </motion.div>
    </section>
  )
}
