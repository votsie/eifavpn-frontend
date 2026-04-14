/**
 * Open payment URL — always in a new tab/window, never navigate away.
 * In TG Mini App: openLink opens TG in-app browser (outside mini-app webview).
 * In regular browser: window.open for new tab.
 */
export function openPaymentUrl(url) {
  if (!url) return

  const tg = window.Telegram?.WebApp
  // Only use openLink if we're actually inside a TG Mini App (initData is set)
  if (tg?.openLink && tg?.initData) {
    tg.openLink(url)
    return
  }

  // Regular browser: open in new tab
  const w = window.open(url, '_blank')
  // If popup blocked, fallback to same-tab navigation
  if (!w) window.location.href = url
}
