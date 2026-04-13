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
    if (saved === 'light' || saved === 'dark') {
      theme = saved
    } else if (saved === 'auto' || !saved) {
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        theme = 'light'
      }
    }
  }

  document.documentElement.setAttribute('data-theme', theme)
})()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
