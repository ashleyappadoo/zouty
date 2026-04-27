# 🛠️ Zouti — 65 outils IA gratuits en ligne

> **"Zouti"** signifie *outil* en créole. La plateforme tout-en-un pour vos outils numériques.

## Stack technique

- **Framework** : Next.js 14 (App Router) + TypeScript
- **Style** : Tailwind CSS + design system custom (dark, orange brand)
- **Typographies** : Syne · DM Sans · JetBrains Mono
- **IA** : Claude API (Anthropic Haiku) — ~€0.0003/usage
- **Hébergement** : Vercel

## Installation

```bash
git clone https://github.com/votre-repo/zouti.git
cd zouti
npm install --legacy-peer-deps
```

## Variables d'environnement

Créez `.env.local` :

```env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://zouti.fr
```

Clé API sur [console.anthropic.com](https://console.anthropic.com).

## Développement

```bash
npm run dev      # → http://localhost:3000
npm run test     # → 51 tests automatisés
npm run build    # → build production
```

## Déploiement Vercel

1. Push sur GitHub
2. Import sur [vercel.com](https://vercel.com)
3. Ajoutez `ANTHROPIC_API_KEY` dans Environment Variables
4. Deploy !

## Les 65 outils V1

| Catégorie | Outils |
|-----------|--------|
| 📄 PDF (8) | Fusion, Découpe, Rotation, Images→PDF, PDF→Images, Filigrane, Extraire texte, Résumé IA |
| 🖼️ Images (8) | Compression, Conversion, Redimensionnement, Recadrage, Fond IA, OCR, QR Code, Miniature YouTube |
| ✍️ Écriture IA (13) | Article, Reformulation, Correction, Amélioration, Résumé, Développement, Simplification, Email, Post social, Lettre, Description produit, Mots-clés, Ton |
| 🤖 Détection (4) | Humaniseur IA, Analyseur de ton, Diff textes, Lisibilité Flesch |
| 🔄 Conversion (11) | CSV↔JSON, Excel↔CSV, XML→JSON, MD↔HTML, TXT→PDF, ZIP, Base64, URL encode |
| 💻 Dev Tools (13) | HTML Preview, Éditeur HTML/CSS/JS, JSON Formatter, SQL Generator IA, SQL Runner SQLite, Regex Builder IA, Minifier, JWT Decoder, Mock JSON, Code Diff, CSS Converter |
| 🔢 Utilitaires (8) | TVA France, Mot de passe, Compteur mots, UUID, Lorem Ipsum, Unités, Dates, Couleurs |

## Fonctionnalités clés

- 🛡️ **Rate limiting** : 20 appels IA/heure/IP (sliding window)
- 🌍 **Bilingue FR/EN** : système i18n complet avec persistance
- 🎨 **Logos SVG** par catégorie avec couleurs dédiées
- 🔧 **Debug panel** flottant (?debug=1 en production)
- 📊 **AdSense ready** : slots positionnés sur toutes les pages
- 🔒 **80% client-side** : zéro coût infra sur la majorité des outils

## Architecture

```
zouti/
├── app/
│   ├── api/ai/route.ts          # Claude API + rate limiting
│   ├── tools/[category]/[slug]/ # 65 pages dynamiques SEO
│   ├── page.tsx                 # Homepage avec search
│   ├── layout.tsx               # Layout global + AdSense
│   └── globals.css              # Design system CSS
├── components/
│   ├── layout/ Header Footer
│   ├── tools/  8 fichiers d'outils + ToolLayout + ToolRenderer
│   └── ui/     CategoryLogos · LangSwitcher · DebugPanel
├── lib/
│   ├── tools-registry.ts        # Source de vérité 65 outils
│   ├── rate-limit.ts            # Rate limiter IP sliding window
│   ├── i18n.ts                  # Traductions FR/EN complètes
│   └── utils.ts                 # Utilitaires partagés
└── tests/autotest.js            # 51 tests automatisés
```

## V2 (abonnement ~9€/mois)

- Compression PDF avancée · PDF ↔ Word/Excel · Upscaler IA
- Détecteur contenu IA · Fichiers jusqu'à 100MB

---

Fait par [ONA — Organisation Numérique & Automatisation](https://ona-action.fr)
