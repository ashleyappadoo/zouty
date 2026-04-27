'use client'
import { useState } from 'react'
import Link from 'next/link'
import { TOOLS, CATEGORIES, ToolCategory } from '@/lib/tools-registry'
import { CATEGORY_LOGOS, CATEGORY_COLORS, TOOL_SECTION_ICONS } from '@/components/ui/CategoryLogos'

export default function DebugPanel() {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<ToolCategory | null>(null)

  if (process.env.NODE_ENV === 'production' && !open) {
    // In production, only show if ?debug=1 is in URL
    if (typeof window !== 'undefined' && !window.location.search.includes('debug=1')) {
      return null
    }
  }

  const categoryCounts = Object.keys(CATEGORIES).reduce((acc, cat) => {
    acc[cat] = TOOLS.filter(t => t.category === cat).length
    return acc
  }, {} as Record<string, number>)

  const aiCount = TOOLS.filter(t => t.isAI).length
  const clientCount = TOOLS.filter(t => !t.isAI).length

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
          background: open ? '#f97316' : '#1a1a27',
          border: '2px solid rgba(249,115,22,0.4)',
          borderRadius: 12, padding: '10px 16px',
          color: open ? 'white' : '#f97316',
          cursor: 'pointer', fontSize: 13, fontWeight: 700,
          fontFamily: 'Syne, sans-serif',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', gap: 8,
          transition: 'all 0.2s',
        }}
      >
        <span>{open ? '✕' : '🔧'}</span>
        {open ? 'Fermer' : 'Debug'}
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 72, right: 20, zIndex: 9998,
          background: '#0a0a0f', border: '1px solid rgba(249,115,22,0.3)',
          borderRadius: 16, width: 360, maxHeight: '70vh',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(249,115,22,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16, color: '#f0f0f5' }}>
                🔧 Zouti Debug Panel
              </span>
              <span style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 100, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>
                {TOOLS.length} outils
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
              <span style={{ color: '#c084fc', fontSize: 12 }}>🤖 {aiCount} IA</span>
              <span style={{ color: '#4ade80', fontSize: 12 }}>⚡ {clientCount} client-side</span>
              <span style={{ color: '#fbbf24', fontSize: 12 }}>📂 {Object.keys(CATEGORIES).length} catégories</span>
            </div>
          </div>

          {/* Categories grid */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            <button
              onClick={() => setActiveSection(null)}
              style={{
                padding: '8px 4px', borderRadius: 8, border: `1px solid ${activeSection === null ? '#f97316' : 'rgba(255,255,255,0.07)'}`,
                background: activeSection === null ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
                color: activeSection === null ? '#f97316' : '#666680', cursor: 'pointer', fontSize: 10, fontWeight: 600,
                textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
              }}
            >
              <span style={{ fontSize: 18 }}>🗂️</span>
              <span>Tout</span>
            </button>
            {(Object.entries(CATEGORIES) as [ToolCategory, any][]).map(([key, cat]) => {
              const Logo = CATEGORY_LOGOS[key]
              const color = CATEGORY_COLORS[key]
              return (
                <button
                  key={key}
                  onClick={() => setActiveSection(activeSection === key ? null : key)}
                  style={{
                    padding: '8px 4px', borderRadius: 8,
                    border: `1px solid ${activeSection === key ? color : 'rgba(255,255,255,0.07)'}`,
                    background: activeSection === key ? `${color}18` : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer', fontSize: 10, fontWeight: 600,
                    color: activeSection === key ? color : '#666680',
                    textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    transition: 'all 0.15s'
                  }}
                >
                  {Logo && <Logo size={20} color={activeSection === key ? color : '#555570'} />}
                  <span style={{ fontSize: 9, lineHeight: 1.2 }}>{cat.label.split(' ')[0]}</span>
                  <span style={{ background: `${color}25`, color, borderRadius: 100, padding: '0 4px', fontSize: 9 }}>
                    {categoryCounts[key]}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Tools list */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {(Object.entries(CATEGORIES) as [ToolCategory, any][])
              .filter(([key]) => !activeSection || key === activeSection)
              .map(([key, cat]) => {
                const Logo = CATEGORY_LOGOS[key]
                const color = CATEGORY_COLORS[key]
                const tools = TOOLS.filter(t => t.category === key)
                return (
                  <div key={key}>
                    {/* Section header */}
                    <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {Logo && <Logo size={18} color={color} />}
                      <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color }}>
                        {cat.label}
                      </span>
                      <span style={{ marginLeft: 'auto', color: '#555570', fontSize: 11 }}>{tools.length} outils</span>
                    </div>
                    {/* Tool rows */}
                    {tools.map(tool => (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.category}/${tool.slug}`}
                        style={{ textDecoration: 'none' }}
                        onClick={() => setOpen(false)}
                      >
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: '7px 16px',
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                          transition: 'background 0.1s', cursor: 'pointer',
                        }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(249,115,22,0.06)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                        >
                          <span style={{ fontSize: 14, width: 20, textAlign: 'center' }}>
                            {TOOL_SECTION_ICONS[tool.id] || '🔧'}
                          </span>
                          <span style={{ flex: 1, color: '#c0c0d0', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {tool.name}
                          </span>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {tool.isAI && (
                              <span style={{ background: 'rgba(192,132,252,0.15)', color: '#c084fc', borderRadius: 4, padding: '1px 5px', fontSize: 9, fontWeight: 700 }}>IA</span>
                            )}
                            <span style={{ background: `${color}18`, color, borderRadius: 4, padding: '1px 5px', fontSize: 9 }}>
                              {key.slice(0, 3).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              })
            }
          </div>

          {/* Footer */}
          <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <code style={{ color: '#555570', fontSize: 10 }}>ENV: {process.env.NODE_ENV}</code>
              <code style={{ color: '#555570', fontSize: 10 }}>?debug=1 en prod</code>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
