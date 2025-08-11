import React, { useEffect, useState } from 'react'

const THEME_KEY = 'aposta-theme'

type Mode = 'light' | 'dark'

function applyTheme(mode: Mode) {
  const root = document.documentElement
  if (mode === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>('light')

  useEffect(() => {
    const saved = (localStorage.getItem(THEME_KEY) as Mode) || null
    if (saved) {
      setMode(saved)
      applyTheme(saved)
    } else {
      // fallback: system preference
      const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const initial: Mode = prefers ? 'dark' : 'light'
      setMode(initial)
      applyTheme(initial)
    }
  }, [])

  function toggle() {
    const next: Mode = mode === 'dark' ? 'light' : 'dark'
    setMode(next)
    applyTheme(next)
    localStorage.setItem(THEME_KEY, next)
  }

  return (
    <button className="btn-secondary" onClick={toggle} title={mode === 'dark' ? 'Tema claro' : 'Tema escuro'}>
      {mode === 'dark' ? '🌞 Claro' : '🌙 Escuro'}
    </button>
  )
}
