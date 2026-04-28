'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { TOOLS, CATEGORIES, Tool, ToolCategory, searchTools } from '@/lib/tools-registry'

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/tools/${tool.category}/${tool.slug}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ padding: '18px 20px', height: '100%', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>{tool.icon}</span>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: '#f0f0f5', lineHeight: 1.3 }}>{tool.name}</span>
          </div>
          {tool.isAI && (
            <span style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 100, padding: '1px 7px', fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', flexShrink: 0 }}>IA</span>
          )}
        </div>
        <p style={{ color: '#8888aa', fontSize: 13, margin: 0, lineHeight: 1.6, flex: 1 }}>{tool.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#f97316', fontSize: 12, fontWeight: 600 }}>Utiliser →</span>
        </div>
      </div>
    </Link>
  )
}

function CategorySection({ category, tools }: { category: ToolCategory; tools: Tool[] }) {
  const cat = CATEGORIES[category]
  return (
    <section id={category} style={{ marginBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `linear-gradient(135deg, rgba(249,115,22,0.15), rgba(249,115,22,0.05))`,
          border: '1px solid rgba(249,115,22,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
        }}>
          {cat.icon}
        </div>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: '#f0f0f5', margin: 0 }}>{cat.label}</h2>
          <p style={{ color: '#666680', fontSize: 14, margin: 0 }}>{cat.description}</p>
        </div>
        <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 100, padding: '3px 12px', fontSize: 13, color: '#555570' }}>{tools.length} outils</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
      </div>
    </section>
  )
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all')

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

  const totalTools = TOOLS.length
  const aiTools = TOOLS.filter(t => t.isAI).length

  return (
    <div>
      {/* Hero */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 100, padding: '6px 16px', marginBottom: 24, fontSize: 13, color: '#f97316', fontWeight: 600 }}>
          <span>⚡</span> {totalTools} outils gratuits — Sans inscription
        </div>

        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(36px, 6vw, 72px)', color: '#f0f0f5', margin: '0 0 20px', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
          Tous vos outils.<br />
          <span style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dans un seul endroit.</span>
        </h1>

        <p style={{ color: '#8888aa', fontSize: 18, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
          {totalTools} outils IA gratuits — PDF, images, écriture, conversion, dev tools.
          Sans compte. Sans logiciel. 100% dans votre navigateur.
        </p>

        {/* Search bar */}
        <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto 48px' }}>
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 20, opacity: 0.5 }}>🔍</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un outil... (ex: PDF, QR code, SQL, base64)"
            style={{
              width: '100%', height: 56, background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14,
              padding: '0 20px 0 50px', color: '#f0f0f5', fontSize: 16,
              fontFamily: 'DM Sans, sans-serif', outline: 'none', transition: 'all 0.2s'
            }}
            onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 4px rgba(249,115,22,0.1)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#8888aa', cursor: 'pointer', fontSize: 20 }}>×</button>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Outils disponibles', value: totalTools, icon: '🛠️' },
            { label: 'Propulsés par IA', value: aiTools, icon: '🤖' },
            { label: 'Sans inscription', value: '100%', icon: '⚡' },
            { label: 'Traitement local', value: '80%', icon: '🔒' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: '#f97316' }}>{s.value}</div>
              <div style={{ color: '#555570', fontSize: 13 }}>{s.icon} {s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AdSense Top */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 40px' }}>
        <div className="adsense-slot" style={{ height: 90 }}>Publicité — AdSense 728×90</div>
      </div>

      {/* Search Results */}
      {isSearching && (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 60px' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, color: '#f0f0f5', marginBottom: 20 }}>
            {searchResults.length} résultat{searchResults.length !== 1 ? 's' : ''} pour "{query}"
          </h2>
          {searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#555570' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <p>Aucun outil trouvé. Essayez un autre terme.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {searchResults.map(tool => <ToolCard key={tool.id} tool={tool} />)}
            </div>
          )}
        </div>
      )}

      {/* Category filters + tools grid */}
      {!isSearching && (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          {/* Category filter bar */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 48 }}>
            <button
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '8px 16px', borderRadius: 100,
                border: `1px solid ${activeCategory === 'all' ? '#f97316' : 'rgba(255,255,255,0.08)'}`,
                background: activeCategory === 'all' ? '#f97316' : 'rgba(255,255,255,0.03)',
                color: activeCategory === 'all' ? 'white' : '#8888aa',
                cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Syne, sans-serif'
              }}>
              Tous les outils ({totalTools})
            </button>
            {(Object.entries(CATEGORIES) as [ToolCategory, typeof CATEGORIES[ToolCategory]][]).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                style={{
                  padding: '8px 16px', borderRadius: 100,
                  border: `1px solid ${activeCategory === key ? '#f97316' : 'rgba(255,255,255,0.08)'}`,
                  background: activeCategory === key ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
                  color: activeCategory === key ? '#f97316' : '#8888aa',
                  cursor: 'pointer', fontSize: 13, fontWeight: activeCategory === key ? 600 : 400
                }}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Tools by category */}
          {(Object.entries(toolsByCategory) as [ToolCategory, Tool[]][]).map(([cat, tools]) => (
            <CategorySection key={cat} category={cat} tools={tools} />
          ))}
        </div>
      )}

      {/* AdSense Mid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 60px' }}>
        <div className="adsense-slot" style={{ height: 250 }}>Publicité — AdSense 300×250</div>
      </div>

      {/* V2 Section */}
      <div id="v2" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(99,102,241,0.05))',
          border: '1px solid rgba(249,115,22,0.2)', borderRadius: 20, padding: '48px',
          display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'center'
        }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 100, padding: '4px 14px', marginBottom: 16, fontSize: 12, color: '#f97316', fontWeight: 700 }}>
              ✨ Zouti V2 — Bientôt disponible
            </div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 32, color: '#f0f0f5', margin: '0 0 12px', lineHeight: 1.15 }}>
              Plus puissant.<br />Plus rapide. Pro.
            </h2>
            <p style={{ color: '#8888aa', fontSize: 16, margin: '0 0 24px', lineHeight: 1.7 }}>
              La V2 apportera des fonctionnalités avancées en abonnement : compression PDF intelligente, conversion PDF↔Word, upscaler IA, détecteur de contenu IA, traitement de gros fichiers et bien plus.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
              {['Compression PDF avancée', 'PDF ↔ Word / Excel', 'Upscaler IA d\'images', 'Détecteur contenu IA', 'Fichiers jusqu\'à 100MB', 'Traitement par lot'].map(f => (
                <span key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 12px', fontSize: 13, color: '#8888aa' }}>
                  <span style={{ color: '#f97316' }}>✓</span> {f}
                </span>
              ))}
            </div>
            <form onSubmit={e => { e.preventDefault(); alert('Merci ! Vous serez notifié au lancement de la V2.') }} style={{ display: 'flex', gap: 10, maxWidth: 400 }}>
              <input
                type="email"
                placeholder="votre@email.fr"
                style={{ flex: 1, height: 44, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '0 14px', color: '#f0f0f5', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#f97316'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
              <button type="submit" className="btn-primary">M'avertir</button>
            </form>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 200 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ color: '#555570', fontSize: 12, marginBottom: 4 }}>Zouti V1</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, color: '#4ade80' }}>Gratuit</div>
              <div style={{ color: '#8888aa', fontSize: 13 }}>65 outils, toujours</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(249,115,22,0.05))', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ color: '#f97316', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Zouti V2 Pro</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, color: '#f0f0f5' }}>~9€<span style={{ fontSize: 14, fontWeight: 400 }}>/mois</span></div>
              <div style={{ color: '#8888aa', fontSize: 13 }}>Fonctionnalités avancées</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features grid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 32, color: '#f0f0f5', textAlign: 'center', margin: '0 0 40px' }}>
          Pourquoi Zouti ?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {[
            { icon: '🔒', title: 'Vos données restent chez vous', desc: '80% des outils fonctionnent 100% dans votre navigateur. Aucun fichier envoyé sur nos serveurs.' },
            { icon: '⚡', title: 'Zéro friction', desc: 'Pas de compte, pas de téléchargement, pas de pub intrusive. Un outil, un résultat, c\'est tout.' },
            { icon: '🤖', title: 'IA de pointe', desc: 'Les outils IA sont propulsés par Claude, l\'un des modèles les plus avancés du marché.' },
            { icon: '🇫🇷', title: 'Fait pour la France', desc: 'Interface en français, outils adaptés aux usages français (TVA, formats, CGV, RGPD).' },
            { icon: '♾️', title: 'Toujours gratuit', desc: 'La V1 avec ses 65 outils restera toujours gratuite. Aucune limite arbitraire.' },
            { icon: '🧩', title: '65 outils en un', desc: 'PDF, images, écriture, dev tools, conversion — plus besoin de jongler entre 10 sites différents.' },
          ].map(f => (
            <div key={f.title} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '24px', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,115,22,0.25)'; (e.currentTarget as HTMLElement).style.background = 'rgba(249,115,22,0.03)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#f0f0f5', margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ color: '#666680', fontSize: 14, margin: 0, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
