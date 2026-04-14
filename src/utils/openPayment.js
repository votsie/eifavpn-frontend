/**
 * Open payment URL in external system browser.
 * In Telegram Mini App: window.open opens in external browser.
 * openLink() opens in-app browser which breaks payment forms.
 */
export function openPaymentUrl(url) {
  if (!url) return
  window.open(url, '_blank')
}
