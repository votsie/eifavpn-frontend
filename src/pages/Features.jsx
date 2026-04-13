import { ShieldCheck, Globe, Thunderbolt, Lock, Eye, CircleCheck } from '@gravity-ui/icons'
import { motion } from 'motion/react'

const features = [
  {
    icon: Thunderbolt,
    title: 'Молниеносная скорость',
    desc: 'Протокол VLESS маскирует трафик под обычный HTTPS, обходя блокировки.',
    accent: true,
  },
  {
    icon: Lock,
    title: 'TLS 1.3 шифрование',
    desc: 'Трафик защищён TLS 1.3 с AES-256-GCM. Провайдер не видит ваш трафик.',
  },
  {
    icon: Eye,
    title: 'Нулевые логи',
    desc: 'Строгая политика no-logs. Мы не храним, не отслеживаем, не продаём.',
  },
  {
    icon: Globe,
    title: '14 серверов',
    desc: 'Серверы в ключевых регионах. Обходите блокировки без ограничений.',
  },
  {
    icon: ShieldCheck,
    title: 'Блокировка рекламы',
    desc: 'Встроенный блокировщик рекламы и трекеров. Чистый интернет.',
  },
  {
    icon: CircleCheck,
    title: 'Все устройства',
    desc: 'Windows, macOS, iOS, Android, Linux. Один аккаунт — до 6 устройств.',
  },
]

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20 relative z-10 px-5 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-accent/15 bg-accent/8 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">
            Возможности
          </span>
          <h2 className="font-heading mt-4 text-2xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-[42px]">
            Защита без компромиссов
          </h2>
          <p className="mt-3 text-sm text-muted md:text-base">
            Всё что нужно для безопасного и свободного интернета
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:border-accent/20 md:p-6 ${
                f.accent
                  ? 'border-accent/12 bg-surface'
                  : 'border-border bg-surface'
              }`}
            >
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-shadow duration-300 bg-accent/12 text-accent`}>
                <f.icon className="h-[18px] w-[18px]" />
              </div>
              <h3 className="font-heading mb-1.5 text-[15px] font-bold text-foreground md:text-base">
                {f.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-muted md:text-sm">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
