import { ShieldCheck, Globe, Thunderbolt, Lock, Eye, CircleCheck } from '@gravity-ui/icons'
import { motion } from 'motion/react'

const features = [
  {
    icon: Thunderbolt,
    title: 'Молниеносная скорость',
    desc: 'Протокол VLESS маскирует трафик под обычный HTTPS, обходя блокировки. Стримьте, играйте, работайте без задержек.',
    accent: true,
  },
  {
    icon: Lock,
    title: 'TLS 1.3 шифрование',
    desc: 'Трафик защищён TLS 1.3 с AES-256-GCM. Даже провайдер не видит ваш трафик.',
  },
  {
    icon: Eye,
    title: 'Нулевые логи',
    desc: 'Строгая политика no-logs. Мы не храним, не отслеживаем, не продаём ваши данные.',
  },
  {
    icon: Globe,
    title: '14 серверов',
    desc: 'Серверы в ключевых регионах. Обходите блокировки и получайте контент без ограничений.',
  },
  {
    icon: ShieldCheck,
    title: 'Блокировка рекламы',
    desc: 'Встроенный блокировщик рекламы и трекеров. Чистый интернет без раздражающих баннеров.',
  },
  {
    icon: CircleCheck,
    title: 'Все устройства',
    desc: 'Windows, macOS, iOS, Android, Linux, роутеры. Один аккаунт — до 6 устройств.',
  },
]

export default function Features() {
  return (
    <section id="features" className="relative z-10 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
            Возможности
          </span>
          <h2 className="font-heading mt-4 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Защита без компромиссов
          </h2>
          <p className="mt-4 text-lg text-muted">
            Всё что нужно для безопасного и свободного интернета
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group relative overflow-hidden rounded-3xl border bg-surface/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-accent/20 hover:bg-surface/80 ${
                f.accent ? 'border-accent/15' : 'border-white/[0.06]'
              }`}
            >
              {f.accent && (
                <div
                  className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-60"
                  style={{
                    background: 'radial-gradient(circle, oklch(0.80 0.155 180 / 15%) 0%, transparent 70%)',
                  }}
                />
              )}
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-shadow duration-300 ${
                f.accent
                  ? 'bg-accent/15 text-accent group-hover:shadow-[0_0_20px_oklch(0.80_0.155_180/25%)]'
                  : 'bg-default text-foreground'
              }`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-heading mb-2 text-lg font-bold text-foreground">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
