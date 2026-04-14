/**
 * Open payment URL in external browser.
 * In Telegram Mini App: use openLink (opens in-app browser, but outside mini-app webview).
 * In regular browser: use <a target="_blank"> click for reliable new tab.
 */
export function openPaymentUrl(url) {
  if (!url) return

  const tg = window.Telegram?.WebApp
  if (tg?.openLink) {
    // In Mini App: openLink opens TG in-app browser (outside mini-app webview)
    // This is the ONLY way to navigate away from mini-app context
    tg.openLink(url)
    return
  }

  // Regular browser: programmatic <a> click is most reliable cross-browser
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.rel = 'noopener noreferrer'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
