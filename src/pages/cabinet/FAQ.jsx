import { useState } from 'react'
import { Input } from '@heroui/react'
import { Magnifier } from '@gravity-ui/icons'
import { motion, AnimatePresence } from 'motion/react'

const CATEGORIES = [
  { id: 'all', label: 'Все' },
  { id: 'connection', label: 'Подключение' },
  { id: 'payment', label: 'Оплата' },
  { id: 'account', label: 'Аккаунт' },
  { id: 'speed', label: 'Скорость' },
  { id: 'security', label: 'Безопасность' },
]

const FAQ_DATA = [
  // Подключение
  {
    category: 'connection',
    q: 'Как подключиться к VPN?',
    a: 'Скачайте приложение Hiddify (рекомендуем) или любой VLESS-совместимый клиент. В разделе "Инструкция" вашего кабинета скопируйте ссылку подписки или отсканируйте QR-код. Импортируйте в приложение — готово.',
  },
  {
    category: 'connection',
    q: 'Какое приложение скачать?',
    a: 'Рекомендуем Hiddify — работает на iOS, Android, Windows, macOS и Linux. Также подойдут: v2rayN (Windows), v2rayNG (Android), Shadowrocket (iOS, платный), Nekoray (Linux).',
  },
  {
    category: 'connection',
    q: 'VPN не подключается, что делать?',
    a: '1) Проверьте, что подписка активна (раздел "Обзор"). 2) Попробуйте другой сервер — зайдите в "Серверы" и выберите с наименьшей нагрузкой. 3) Переключите протокол в настройках клиента (Reality → VLESS). 4) Перезагрузите приложение. Если не помогает — напишите в поддержку.',
  },
  {
    category: 'connection',
    q: 'Как подключить несколько устройств?',
    a: 'Скопируйте ссылку подписки из кабинета и импортируйте её на каждом устройстве. Лимит устройств зависит от тарифа: Standard — 3, Pro — 4, Max — 6. Управлять устройствами можно в разделе "Устройства".',
  },
  {
    category: 'connection',
    q: 'Что делать если сервер заблокирован?',
    a: 'Переключитесь на другой сервер из списка. Мы постоянно добавляем новые серверы и ротируем IP. Если все серверы недоступны — обновите подписку в приложении (pull-to-refresh или переимпортируйте ссылку).',
  },

  // Оплата
  {
    category: 'payment',
    q: 'Какие способы оплаты доступны?',
    a: 'Три способа: 1) Telegram Stars — оплата прямо в Telegram. 2) Криптовалюта — USDT или TON через CryptoPay. 3) Банковская карта — Visa, Mastercard, МИР через СБП/карту.',
  },
  {
    category: 'payment',
    q: 'Как работает авто-продление?',
    a: 'Включите в Настройках → Авто-продление. За 1 день до истечения подписки вам придёт ссылка на оплату в Telegram — нажмите и оплатите в один клик. Деньги не списываются автоматически.',
  },
  {
    category: 'payment',
    q: 'Можно ли сменить тариф?',
    a: 'Да! В разделе "Тарифы" выберите новый план. Система рассчитает доплату с учётом остатка текущей подписки. При понижении тарифа неиспользованный остаток конвертируется в бонусные дни.',
  },
  {
    category: 'payment',
    q: 'Где посмотреть историю платежей?',
    a: 'В разделе "Платежи" вашего кабинета — там список всех операций с датами, суммами и статусами.',
  },
  {
    category: 'payment',
    q: 'Как получить чек/подтверждение оплаты?',
    a: 'Чек приходит автоматически: для Stars — в чате с ботом, для крипто — в CryptoPay, для карты — SMS/push от банка. В кабинете в разделе "Платежи" видны все транзакции.',
  },

  // Аккаунт
  {
    category: 'account',
    q: 'Как войти в аккаунт?',
    a: 'Четыре способа: 1) Email + код (основной). 2) Google аккаунт. 3) Telegram (кнопка "Войти через Telegram"). 4) Через Telegram Mini App (автоматически). Все способы привязаны к одному аккаунту.',
  },
  {
    category: 'account',
    q: 'Как привязать Telegram к аккаунту?',
    a: 'Зайдите в Настройки → Привязанные аккаунты → "Привязать Telegram". Или откройте наше приложение в Telegram (@eifavpn_bot) — аккаунт привяжется автоматически.',
  },
  {
    category: 'account',
    q: 'Как работает реферальная программа?',
    a: 'Поделитесь реферальной ссылкой из раздела "Рефералы". Ваш друг получит скидку 10% на первую покупку, а вы — 7 дней бесплатного VPN после его оплаты.',
  },
  {
    category: 'account',
    q: 'Как удалить аккаунт?',
    a: 'Настройки → внизу страницы "Удалить аккаунт". VPN-подписка будет отключена, все данные удалены безвозвратно.',
  },

  // Скорость
  {
    category: 'speed',
    q: 'Какая скорость VPN?',
    a: 'Зависит от сервера и вашего провайдера. В среднем 50-300 Мбит/с. Для максимальной скорости выбирайте сервер с наименьшей нагрузкой в разделе "Серверы". Тариф Max даёт доступ к 14 серверам в разных странах.',
  },
  {
    category: 'speed',
    q: 'Почему VPN работает медленно?',
    a: '1) Попробуйте другой сервер (ближе к вашему региону). 2) Проверьте скорость без VPN — проблема может быть у провайдера. 3) Переключите протокол (Reality обычно быстрее). 4) Проверьте нагрузку сервера в разделе "Серверы".',
  },
  {
    category: 'speed',
    q: 'Есть ли ограничения трафика?',
    a: 'Standard: 1 ТБ/месяц (сброс каждый месяц). Pro и Max: безлимитный трафик без ограничений. Текущий расход виден в разделе "Обзор".',
  },

  // Безопасность
  {
    category: 'security',
    q: 'Безопасен ли EIFAVPN?',
    a: 'Да. Мы используем протокол VLESS + Reality — это самый современный и защищённый VPN-протокол. Трафик зашифрован и неотличим от обычного HTTPS. Мы не храним логи подключений.',
  },
  {
    category: 'security',
    q: 'Какой протокол используется?',
    a: 'VLESS + Reality (XTLS). Это проверенный протокол, который маскирует VPN-трафик под обычные HTTPS-соединения. Не детектируется DPI (Deep Packet Inspection).',
  },
  {
    category: 'security',
    q: 'Храните ли вы логи?',
    a: 'Нет. Мы не ведём журналов подключений и не отслеживаем посещённые сайты. Хранятся только данные аккаунта (email, подписка) для работы сервиса.',
  },
]

export default function FAQ() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [openId, setOpenId] = useState(null)

  const filtered = FAQ_DATA.filter(item => {
    if (category !== 'all' && item.category !== category) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="font-heading text-2xl font-bold text-foreground">Частые вопросы</h1>

      {/* Search */}
      <Input
        size="sm"
        placeholder="Поиск по вопросам..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        startContent={<Magnifier className="h-4 w-4 text-muted" />}
      />

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              category === c.id
                ? 'bg-accent text-accent-foreground'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Questions */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">Ничего не найдено</p>
        ) : (
          filtered.map((item, i) => {
            const id = `${item.category}-${i}`
            const isOpen = openId === id
            return (
              <div key={id} className="rounded-xl border border-border bg-surface overflow-hidden">
                <button
                  onClick={() => setOpenId(isOpen ? null : id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-medium text-foreground pr-4">{item.q}</span>
                  <span className={`shrink-0 text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="border-t border-border px-4 py-3">
                        <p className="text-sm leading-relaxed text-muted">{item.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })
        )}
      </div>

      {/* Support footer */}
      <div className="rounded-xl border border-border bg-surface p-4 text-center">
        <p className="text-sm text-muted">Не нашли ответ?</p>
        <a href="mailto:support@eifavpn.ru" className="mt-1 inline-block text-sm font-medium text-accent hover:text-accent/80">
          Написать в поддержку
        </a>
      </div>
    </div>
  )
}
