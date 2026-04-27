'use client'
import Link from 'next/link'
import { Tool, CATEGORIES } from '@/lib/tools-registry'
import { useLang } from '@/components/LangContext'
import { CATEGORY_LOGOS, CATEGORY_COLORS, TOOL_SECTION_ICONS } from '@/components/ui/CategoryLogos'
import { toolTranslations, translations } from '@/lib/i18n'

interface ToolLayoutProps {
  tool: Tool
  children: React.ReactNode
}

export default function ToolLayout({ tool, children }: ToolLayoutProps) {
  const { lang } = useLang()
  const cat = CATEGORIES[tool.category]
  const Logo = CATEGORY_LOGOS[tool.category]
  const color = CATEGORY_COLORS[tool.category]
  const tr = translations.tool
  const toolTr = toolTranslations[tool.id]

  const displayName = toolTr?.name[lang] ?? tool.name
  const displayDesc = toolTr?.description[lang] ?? tool.description
  const catLabel = translations.categories[tool.category as keyof typeof translations.categories]?.label[lang] ?? cat.label
  const toolIcon = TOOL_SECTION_ICONS[tool.id] ?? tool.icon

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, fontSize: 13, color: '#666680', flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: '#666680', textDecoration: 'none', transition: 'color 0.15s' }}
          onMouseEnter={e => (e.target as HTMLElement).style.color = '#f97316'}
          onMouseLeave={e => (e.target as HTMLElement).style.color = '#666680'}>
          {tr.home[lang]}
        </Link>
        <span>›</span>
        <Link href={`/#${tool.category}`} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#666680', textDecoration: 'none', transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = color}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#666680'}>
          {Logo && <Logo size={14} color="currentColor" />}
          {catLabel}
        </Link>
        <span>›</span>
        <span style={{ color: '#f0f0f5' }}>{displayName}</span>
      </nav>

      {/* Tool header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 12 }}>
          {/* Icon with category color */}
          <div style={{
            width: 60, height: 60, borderRadius: 16, flexShrink: 0,
            background: `linear-gradient(135deg, ${color}22, ${color}08)`,
            border: `1px solid ${color}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, position: 'relative'
          }}>
            <span>{toolIcon}</span>
            {/* Category logo mini badge */}
            {Logo && (
              <div style={{
                position: 'absolute', bottom: -4, right: -4,
                width: 20, height: 20, borderRadius: '50%',
                background: '#0a0a0f', border: `1px solid ${color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Logo size={12} color={color} />
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#f0f0f5', margin: 0 }}>
                {displayName}
              </h1>
              {tool.isAI && (
                <span style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 100, padding: '2px 9px', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>
                  {tr.ai_badge[lang]}
                </span>
              )}
              <span style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 100, padding: '2px 9px', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>
                {tr.free_badge[lang]}
              </span>
              {/* Category badge with logo */}
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${color}15`, color, border: `1px solid ${color}25`, borderRadius: 100, padding: '2px 9px', fontSize: 11, fontWeight: 600 }}>
                {Logo && <Logo size={11} color={color} />}
                {catLabel}
              </span>
            </div>
            <p style={{ color: '#8888aa', fontSize: 15, margin: 0, lineHeight: 1.6 }}>{displayDesc}</p>
          </div>
        </div>
      </div>

      {/* Top AdSense */}
      <div style={{ height: 90, background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333345', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 32 }}>
        {tr.ad_label[lang]} — AdSense 728×90
      </div>

      {/* Tool content */}
      <div className="animate-in">{children}</div>

      {/* Bottom AdSense */}
      <div style={{ height: 250, background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333345', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 48 }}>
        {tr.ad_label[lang]} — AdSense 300×250
      </div>

      {/* SEO text */}
      <div style={{ marginTop: 48, padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: '#f0f0f5', marginBottom: 10 }}>
          {tr.about_title[lang]} {displayName}
        </h2>
        <p style={{ color: '#666680', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
          {displayDesc}{tr.about_suffix[lang]}
          {tool.isAI && tr.about_ai[lang]}
          {tr.about_secure[lang]}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {tool.tags.map(tag => (
            <span key={tag} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '3px 10px', fontSize: 12, color: '#555570' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
