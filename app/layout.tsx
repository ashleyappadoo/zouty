import type { Metadata } from 'next'
import './globals.css'
import dynamic from 'next/dynamic'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { LangProvider } from '@/components/ui/LangContext'

// DebugPanel uses window/localStorage — must be client-only, no SSR
const DebugPanel = dynamic(() => import('@/components/ui/DebugPanel'), { ssr: false })

export const metadata: Metadata = {
  metadataBase: new URL('https://zouti.fr'),
  title: {
    default: 'Zouti — 65 outils IA gratuits en ligne | PDF, Images, Écriture, Dev',
    template: '%s | Zouti',
  },
  description: 'Zouti réunit 65 outils IA gratuits en ligne : PDF, images, écriture, conversion, dev tools, utilitaires. Sans inscription, 100% en ligne.',
  keywords: ['outils ia gratuits', 'pdf en ligne', 'convertir fichiers', 'outils dev', 'zouti'],
  authors: [{ name: 'Zouti' }],
  openGraph: {
    type: 'website', locale: 'fr_FR', url: 'https://zouti.fr', siteName: 'Zouti',
    title: 'Zouti — 65 outils IA gratuits en ligne',
    description: '65 outils IA gratuits : PDF, images, écriture, conversion, dev tools. Sans inscription.',
  },
  twitter: { card: 'summary_large_image', title: 'Zouti — 65 outils IA gratuits en ligne' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  alternates: { canonical: 'https://zouti.fr' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'WebSite', name: 'Zouti', url: 'https://zouti.fr',
          description: '65 outils IA gratuits en ligne',
          potentialAction: { '@type': 'SearchAction', target: 'https://zouti.fr/?q={search_term_string}', 'query-input': 'required name=search_term_string' },
        })}} />
      </head>
      <body className="bg-mesh">
        <LangProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <DebugPanel />
        </LangProvider>
      </body>
    </html>
  )
}
