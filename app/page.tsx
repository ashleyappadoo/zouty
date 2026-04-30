'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { TOOLS, CATEGORIES, Tool, ToolCategory, searchTools } from '@/lib/tools-registry'

const AgentChat = dynamic(() => import('@/components/agent/AgentChat'), { ssr: false })

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/tools/${tool.category}/${tool.slug}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ padding: '16px 18px', height: '100%', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>{tool.icon}</span>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: '#f0f0f5', lineHeight: 1.3 }}>{tool.name}</span>
          </div>
          {tool.isAI && (
            <span style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 100, padding: '1px 6px', fontSize: 9, fontWeight: 700, letterSpacing: '0.04em', flexShrink: 0 }}>IA</span>
          )}
        </div>
        <p style={{ color: '#666680', fontSize: 12, margin: 0, lineHeight: 1.5, flex: 1 }}>{tool.description}</p>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all')
  const [tab, setTab] = useState<'agent' | 'tools'>('agent')

  const searchResults = useMemo(() => query.trim().length > 1 ? searchTools(query) : [], [query])
  const isSearching = query.trim().length > 1

  const filteredTools = useMemo(() => {
    if (activeCategory === 'all') return TOOLS
    return TOOLS.filter(t => t.category === activeCategory)
  }, [activeCategory])

  const toolsByCategory = useMemo(() => {
    const byCategory: Partial<Record<ToolCategory, Tool[]>> = {}
    filteredTools.forEach(t => {
      if (!byCategory[t.category]) byCategory[t.category] = []
      byCategory[t.category]!.push(t)
    })
    return byCategory
  }, [filteredTools])

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <div style={{ paddingTop: 48, paddingBottom: 32, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 20, fontSize: 13, color: '#f97316', fontWeight: 600 }}>
          ⚡ 65 outils gratuits — Sans inscription
        </div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 60px)', color: '#f0f0f5', margin: '0 0 14px', lineHeight: 1.08, letterSpacing: '-0.03em' }}>
          Décrivez votre tâche.<br />
          <span style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>L'agent s'en occupe.</span>
        </h1>
        <p style={{ color: '#8888aa', fontSize: 17, maxWidth: 520, margin: '0 auto 0', lineHeight: 1.7 }}>
          Parlez à l'agent Zouti — il choisit et orchestre les bons outils automatiquement. Ou accédez directement aux 65 outils.
        </p>
      </div>

      {/* ── TAB SWITCHER ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12, padding: 4, gap: 4
        }}>
          <button
            onClick={() => setTab('agent')}
            style={{
              padding: '10px 28px', borderRadius: 9, border: 'none',
              background: tab === 'agent' ? '#f97316' : 'transparent',
              color: tab === 'agent' ? 'white' : '#8888aa',
              cursor: 'pointer', fontFamily: 'Syne, sans-serif',
              fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 8
            }}
          >
            <span>🤖</span> Agent IA
          </button>
          <button
            onClick={() => setTab('tools')}
            style={{
              padding: '10px 28px', borderRadius: 9, border: 'none',
              background: tab === 'tools' ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: tab === 'tools' ? '#f0f0f5' : '#8888aa',
              cursor: 'pointer', fontFamily: 'Syne, sans-serif',
              fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 8
            }}
          >
            <span>🛠️</span> 65 outils
          </button>
        </div>
      </div>

      {/* ── AGENT TAB ────────────────────────────────────────────────────────── */}
      {tab === 'agent' && (
        <div style={{
          background: 'rgba(17,17,24,0.8)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, overflow: 'hidden',
          height: 600, display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          marginBottom: 48
        }}>
          {/* Agent header */}
          <div style={{
            padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.02)',
            display: 'flex', alignItems: 'center', gap: 12
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3))',
              border: '1px solid rgba(99,102,241,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
            }}>🤖</div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f0f5' }}>
                Agent Zouti
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
                <span style={{ color: '#4ade80', fontSize: 12 }}>En ligne</span>
                <span style={{ color: '#555570', fontSize: 12 }}>• Orchestration IA sur 65 outils</span>
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                ✦ Claude Haiku
              </span>
            </div>
          </div>

          {/* Chat area */}
          <div style={{ flex: 1, overflow: 'hidden', padding: '0 24px 20px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <AgentChat />
          </div>
        </div>
      )}

      {/* ── TOOLS TAB ────────────────────────────────────────────────────────── */}
      {tab === 'tools' && (
        <div style={{ paddingBottom: 80 }}>
          {/* AdSense */}
          <div style={{ height: 90, background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333345', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 32 }}>
            Publicité — AdSense 728×90
          </div>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 480, margin: '0 auto 32px' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.4, fontSize: 16 }}>🔍</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher un outil..."
              style={{
                width: '100%', height: 46,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '0 16px 0 42px',
                color: '#f0f0f5', fontSize: 14,
                fontFamily: 'DM Sans, sans-serif', outline: 'none'
              }}
              onFocus={e => e.target.style.borderColor = '#f97316'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          {/* Search results */}
          {isSearching ? (
            <div>
              <p style={{ color: '#8888aa', fontSize: 14, marginBottom: 20 }}>
                {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} pour "{query}"
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                {searchResults.map(tool => <ToolCard key={tool.id} tool={tool} />)}
              </div>
            </div>
          ) : (
            <>
              {/* Category filter */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
                <button onClick={() => setActiveCategory('all')} style={{
                  padding: '7px 14px', borderRadius: 100, border: `1px solid ${activeCategory === 'all' ? '#f97316' : 'rgba(255,255,255,0.08)'}`,
                  background: activeCategory === 'all' ? '#f97316' : 'rgba(255,255,255,0.03)',
                  color: activeCategory === 'all' ? 'white' : '#8888aa', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Syne, sans-serif'
                }}>Tous ({TOOLS.length})</button>
                {(Object.entries(CATEGORIES) as [ToolCategory, typeof CATEGORIES[ToolCategory]][]).map(([key, cat]) => (
                  <button key={key} onClick={() => setActiveCategory(key)} style={{
                    padding: '7px 14px', borderRadius: 100,
                    border: `1px solid ${activeCategory === key ? '#f97316' : 'rgba(255,255,255,0.08)'}`,
                    background: activeCategory === key ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
                    color: activeCategory === key ? '#f97316' : '#8888aa', cursor: 'pointer', fontSize: 13, fontWeight: activeCategory === key ? 600 : 400
                  }}>{cat.icon} {cat.label}</button>
                ))}
              </div>

              {/* Tools grid by category */}
              {(Object.entries(toolsByCategory) as [ToolCategory, Tool[]][]).map(([cat, tools]) => (
                <section key={cat} id={cat} style={{ marginBottom: 48 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <span style={{ fontSize: 24 }}>{CATEGORIES[cat].icon}</span>
                    <div>
                      <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: '#f0f0f5', margin: 0 }}>{CATEGORIES[cat].label}</h2>
                      <p style={{ color: '#555570', fontSize: 13, margin: 0 }}>{CATEGORIES[cat].description}</p>
                    </div>
                    <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 100, padding: '2px 10px', fontSize: 12, color: '#555570' }}>{tools.length}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                    {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
                  </div>
                </section>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── V2 SECTION ───────────────────────────────────────────────────────── */}
      {tab === 'agent' && (
        <div id="v2" style={{
          background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(99,102,241,0.05))',
          border: '1px solid rgba(249,115,22,0.2)', borderRadius: 20, padding: '40px',
          display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center', marginBottom: 80
        }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 100, padding: '4px 14px', marginBottom: 14, fontSize: 12, color: '#f97316', fontWeight: 700 }}>
              ✨ Zouti V2 — Bientôt disponible
            </div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: '#f0f0f5', margin: '0 0 10px', lineHeight: 1.15 }}>
              Plus puissant. Pro.
            </h2>
            <p style={{ color: '#8888aa', fontSize: 15, margin: '0 0 20px', lineHeight: 1.7 }}>
              Compression PDF, PDF↔Word, upscaler IA, détecteur de contenu IA, fichiers jusqu'à 100MB.
            </p>
            <form onSubmit={e => { e.preventDefault(); alert('Merci ! Vous serez notifié au lancement.') }} style={{ display: 'flex', gap: 10, maxWidth: 380 }}>
              <input type="email" placeholder="votre@email.fr" style={{ flex: 1, height: 42, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, padding: '0 14px', color: '#f0f0f5', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none' }} onFocus={e => e.target.style.borderColor = '#f97316'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
              <button type="submit" className="btn-primary">M'avertir</button>
            </form>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '14px 18px' }}>
              <div style={{ color: '#555570', fontSize: 11, marginBottom: 3 }}>Zouti V1</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: '#4ade80' }}>Gratuit</div>
              <div style={{ color: '#8888aa', fontSize: 12 }}>65 outils, toujours</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(249,115,22,0.05))', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 10, padding: '14px 18px' }}>
              <div style={{ color: '#f97316', fontSize: 11, fontWeight: 700, marginBottom: 3 }}>Zouti V2 Pro</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: '#f0f0f5' }}>~9€<span style={{ fontSize: 13, fontWeight: 400 }}>/mois</span></div>
              <div style={{ color: '#8888aa', fontSize: 12 }}>Fonctionnalités avancées</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
