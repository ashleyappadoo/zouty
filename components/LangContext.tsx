'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Lang } from '@/lib/i18n'

interface LangContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  toggle: () => void
}

const LangContext = createContext<LangContextType>({
  lang: 'fr',
  setLang: () => {},
  toggle: () => {},
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr')
  const [mounted, setMounted] = useState(false)

  // Persist to localStorage — client only
  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('zouti-lang') as Lang | null
      if (saved === 'fr' || saved === 'en') setLangState(saved)
    } catch {}
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('zouti-lang', l)
  }

  const toggle = () => setLang(lang === 'fr' ? 'en' : 'fr')

  return (
    <LangContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}

// Convenience hook — returns a translator bound to current lang
export function useT() {
  const { lang } = useLang()
  return (path: string, vars?: Record<string, string | number>): string => {
    // Inline translation getter
    const keys = path.split('.')
    const { translations } = require('@/lib/i18n')
    let current: any = translations
    for (const key of keys) {
      if (current == null) return path
      current = current[key]
    }
    if (!current) return path
    let result: string = current[lang] ?? current['fr'] ?? path
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        result = result.replace(`{${k}}`, String(v))
        if (k === 'n') result = result.replace('{s}', Number(v) > 1 ? 's' : '')
      })
    }
    return result
  }
}
