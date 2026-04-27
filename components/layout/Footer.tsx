import Link from 'next/link'
import { CATEGORIES, TOOLS } from '@/lib/tools-registry'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: '#080810', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 24px 32px' }}>

        {/* Top grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 40, marginBottom: 48 }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 800, color: 'white', fontFamily: 'Syne, sans-serif'
              }}>Z</div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: '#f0f0f5' }}>Zouti</span>
            </div>
            <p style={{ color: '#666680', fontSize: 14, lineHeight: 1.7, maxWidth: 260 }}>
              65 outils IA gratuits en ligne. Sans inscription, 100% en ligne.
              Le mot "zouti" signifie <em>"outil"</em> en créole.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <span className="badge badge-free">✓ Gratuit</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 100, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', background: 'rgba(249,115,22,0.12)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.2)' }}>⚡ Sans inscription</span>
            </div>
          </div>

          {/* Categories */}
          {(Object.entries(CATEGORIES) as [string, typeof CATEGORIES[keyof typeof CATEGORIES]][]).map(([key, cat]) => (
            <div key={key}>
              <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: '#f0f0f5', marginBottom: 14, letterSpacing: '0.02em' }}>
                {cat.icon} {cat.label}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {TOOLS.filter(t => t.category === key).slice(0, 5).map(tool => (
                  <li key={tool.id}>
                    <Link href={`/tools/${tool.category}/${tool.slug}`} style={{ color: '#666680', fontSize: 13, textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.target as HTMLElement).style.color = '#f97316'}
                      onMouseLeave={e => (e.target as HTMLElement).style.color = '#666680'}>
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* V2 Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(234,88,12,0.05))',
          border: '1px solid rgba(249,115,22,0.2)',
          borderRadius: 12, padding: '20px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16, flexWrap: 'wrap', marginBottom: 40
        }}>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#f0f0f5', marginBottom: 4 }}>
              ✨ Zouti V2 — Bientôt disponible
            </div>
            <p style={{ color: '#888899', fontSize: 13, margin: 0 }}>
              Compression avancée, PDF↔Word, upscaler IA, détecteur IA, traitement de gros fichiers et plus encore.
            </p>
          </div>
          <a href="#v2" style={{
            background: 'var(--brand)', color: 'white', borderRadius: 8,
            padding: '10px 20px', fontSize: 14, fontWeight: 600,
            fontFamily: 'Syne, sans-serif', textDecoration: 'none', whiteSpace: 'nowrap',
            boxShadow: '0 4px 14px rgba(249,115,22,0.3)'
          }}>
            Être notifié →
          </a>
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24 }}>
          <p style={{ color: '#444455', fontSize: 13, margin: 0 }}>
            © {year} Zouti — Tous droits réservés
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Mentions légales', 'Confidentialité', 'CGU'].map(item => (
              <Link key={item} href="#" style={{ color: '#444455', fontSize: 13, textDecoration: 'none' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#f97316'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = '#444455'}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
