'use client'
import { useLang } from '@/components/LangContext'

interface LangSwitcherProps {
  compact?: boolean
}

export default function LangSwitcher({ compact = false }: LangSwitcherProps) {
  const { lang, setLang } = useLang()

  return (
    <div style={{
      display: 'flex',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 8, padding: 3, gap: 2, flexShrink: 0
    }}>
      {(['fr', 'en'] as const).map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          title={l === 'fr' ? 'Français' : 'English'}
          style={{
            padding: compact ? '4px 8px' : '5px 11px',
            borderRadius: 6, border: 'none', cursor: 'pointer',
            background: lang === l ? '#f97316' : 'transparent',
            color: lang === l ? 'white' : '#8888aa',
            fontSize: compact ? 11 : 12,
            fontWeight: 700, fontFamily: 'Syne, sans-serif',
            transition: 'all 0.15s',
            letterSpacing: '0.04em',
            display: 'flex', alignItems: 'center', gap: 4
          }}
        >
          <span style={{ fontSize: compact ? 12 : 14 }}>
            {l === 'fr' ? '🇫🇷' : '🇬🇧'}
          </span>
          {!compact && <span>{l.toUpperCase()}</span>}
        </button>
      ))}
    </div>
  )
}
