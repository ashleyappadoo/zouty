'use client'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', textAlign: 'center'
    }}>
      <div style={{ fontSize: 64, marginBottom: 24 }}>🔧</div>
      <h1 style={{
        fontFamily: 'Syne, sans-serif', fontWeight: 800,
        fontSize: 48, color: '#f0f0f5', margin: '0 0 12px',
        letterSpacing: '-0.03em'
      }}>404</h1>
      <p style={{ color: '#8888aa', fontSize: 18, margin: '0 0 32px' }}>
        Cette page n&apos;existe pas.
      </p>
      <Link href="/" style={{
        background: '#f97316', color: 'white', borderRadius: 8,
        padding: '12px 24px', textDecoration: 'none',
        fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15
      }}>
        ← Retour aux outils
      </Link>
    </div>
  )
}
