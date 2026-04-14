/**
 * Open payment URL in external browser (Mini App) or new tab (web).
 * Never navigates away from the current page.
 */
export function openPaymentUrl(url) {
  if (!url) return
  if (window.Telegram?.WebApp?.openLink) {
    // Open in external browser, not in-app webview
    window.Telegram.WebApp.openLink(url, { try_instant_view: false })
  } else {
    window.open(url, '_blank')
  }
}
