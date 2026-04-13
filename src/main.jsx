import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Theme detection — runs before TG SDK can override
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t)
  document.documentElement.style.colorScheme = t
  document.documentElement.className = t
}

;(function detectAndApplyTheme() {
  const tg = window.Telegram?.WebApp
  let theme = 'dark'

  if (tg?.colorScheme) {
    theme = tg.colorScheme
  } else {
    const saved = localStorage.getItem('eifavpn_theme')
    if (saved === 'light') theme = 'light'
  }

  applyTheme(theme)

  // MutationObserver: if anything changes data-theme or class, force it back
  const observer = new MutationObserver(() => {
    const current = document.documentElement.getAttribute('data-theme')
    const cls = document.documentElement.className
    const saved = localStorage.getItem('eifavpn_theme')
    const expected = saved === 'light' ? 'light' : 'dark'

    if (current !== expected || cls !== expected) {
      applyTheme(expected)
    }
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'class', 'style'],
  })

  // Also re-apply after delays in case TG SDK loads async
  setTimeout(() => applyTheme(theme), 100)
  setTimeout(() => applyTheme(theme), 500)
})()

// Export for use in Settings/Navbar theme toggle
window.__eifavpnApplyTheme = function(t) {
  localStorage.setItem('eifavpn_theme', t)
  applyTheme(t)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
