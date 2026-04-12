import Background from '../components/Background'
import { Button } from '@heroui/react'
import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className="relative min-h-screen px-5 py-20">
      <Background />
      <div className="relative z-10 mx-auto max-w-3xl">
        <Button as={Link} to="/" variant="outline" size="sm" className="mb-6">
          ← На главную
        </Button>

        <div className="rounded-2xl border border-white/[0.06] bg-surface/60 p-8 backdrop-blur-xl">
          <h1 className="font-heading mb-6 text-3xl font-bold text-foreground">Условия использования</h1>

          <div className="space-y-5 text-sm leading-relaxed text-muted">
            <section>
              <h2 className="mb-2 text-base font-semibold text-foreground">1. Общие положения</h2>
              <p>EIFAVPN предоставляет услуги виртуальной частной сети (VPN) на основе протокола VLESS. Используя наш сервис, вы соглашаетесь с настоящими условиями.</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold text-foreground">2. Использование сервиса</h2>
              <p>Сервис предназначен для защиты конфиденциальности в интернете. Запрещается использование VPN для незаконной деятельности, распространения вредоносного ПО, атак на другие сервисы.</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold text-foreground">3. Политика конфиденциальности</h2>
              <p>Мы не храним логи вашей активности. Собираются только данные необходимые для работы сервиса: email, объём трафика, дата истечения подписки.</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold text-foreground">4. Оплата и возврат</h2>
              <p>Оплата производится через Telegram Stars, криптовалюту или банковские карты. Возврат средств возможен в течение 30 дней с момента покупки при условии использования менее 500 МБ трафика.</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold text-foreground">5. Ограничение ответственности</h2>
              <p>Сервис предоставляется «как есть». Мы не гарантируем 100% доступность и не несём ответственности за перебои в работе по причинам, не зависящим от нас.</p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-semibold text-foreground">6. Контакты</h2>
              <p>По всем вопросам: <a href="mailto:support@eifavpn.ru" className="text-accent underline">support@eifavpn.ru</a></p>
            </section>
          </div>

          <p className="mt-8 text-xs text-muted/40">Последнее обновление: апрель 2026</p>
        </div>
      </div>
    </div>
  )
}
