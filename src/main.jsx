import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Detect and apply theme before render to prevent flash
;(function() {
  const tg = window.Telegram?.WebApp
  let theme = 'dark' // default

  if (tg?.colorScheme) {
    theme = tg.colorScheme
  } else {
    const saved = localStorage.getItem('eifavpn_theme')
    if (saved === 'light') {
      theme = 'light'
    }
    // Everything else (dark, auto, null) → dark
  }

  // Apply theme — must run AFTER telegram-web-app.js which overrides class/theme
  function applyGlobalTheme(t) {
    document.documentElement.setAttribute('data-theme', t)
    document.documentElement.style.colorScheme = t
    document.documentElement.className = t // Override TG SDK class
  }
  applyGlobalTheme(theme)
  // Re-apply after a tick in case TG SDK overwrites
  setTimeout(() => applyGlobalTheme(theme), 0)
  setTimeout(() => applyGlobalTheme(theme), 50)
})()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
