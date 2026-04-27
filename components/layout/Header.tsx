'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CATEGORIES, ToolCategory } from '@/lib/tools-registry'
import { CATEGORY_LOGOS, CATEGORY_COLORS } from '@/components/ui/CategoryLogos'
import LangSwitcher from '@/components/ui/LangSwitcher'
import { useLang } from '@/components/LangContext'
import { translations } from '@/lib/i18n'

export default function Header() {
  const [searchVal, setSearchVal] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang } = useLang()
  const tr = translations

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchVal.trim()) window.location.href = `/?q=${encodeURIComponent(searchVal)}`
  }

  return (
    <header style={{
      background: 'rgba(10,10,15,0.88)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, color: 'white',
            fontFamily: 'Syne, sans-serif', boxShadow: '0 4px 14px rgba(249,115,22,0.4)'
          }}>Z</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: '#f0f0f5', letterSpacing: '-0.03em' }}>
            Zouti
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 380, position: 'relative' }}>
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder={tr.nav.search_placeholder[lang]}
            style={{
              width: '100%', height: 38,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, padding: '0 14px 0 38px',
              color: '#f0f0f5', fontSize: 14,
              fontFamily: 'DM Sans, sans-serif',
              outline: 'none', transition: 'border-color 0.15s'
            }}
            onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
          />
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.4, fontSize: 15 }}>🔍</span>
        </form>

        {/* Category nav — desktop */}
        <nav style={{ display: 'flex', gap: 2, alignItems: 'center' }} className="nav-desktop">
          {(Object.entries(CATEGORIES) as [ToolCategory, any][]).map(([key, cat]) => {
            const Logo = CATEGORY_LOGOS[key]
            const color = CATEGORY_COLORS[key]
            return (
              <Link
                key={key}
                href={`/#${key}`}
                title={cat.label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 8px', borderRadius: 7,
                  color: 'rgba(240,240,245,0.55)', fontSize: 12,
                  fontFamily: 'DM Sans, sans-serif', textDecoration: 'none',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = `${color}18`
                  el.style.color = color
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'none'
                  el.style.color = 'rgba(240,240,245,0.55)'
                }}
              >
                {Logo && <Logo size={16} color="currentColor" />}
                <span className="nav-label">{cat.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right side: Lang switcher + V2 badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto', flexShrink: 0 }}>
          <LangSwitcher />
          <Link href="/#v2" style={{
            background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,88,12,0.08))',
            border: '1px solid rgba(249,115,22,0.3)', borderRadius: 8,
            padding: '7px 14px', color: '#f97316', fontSize: 13, fontWeight: 600,
            fontFamily: 'Syne, sans-serif', textDecoration: 'none', whiteSpace: 'nowrap'
          }}>
            {tr.nav.v2_badge[lang]}
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .nav-desktop { display: none !important; } }
        @media (max-width: 1100px) { .nav-label { display: none !important; } }
      `}</style>
    </header>
  )
}
