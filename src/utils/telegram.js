export function isTelegramWebApp() {
  return !!window.Telegram?.WebApp?.initData
}
