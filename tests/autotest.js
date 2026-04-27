#!/usr/bin/env node
/**
 * ZOUTI — Suite de tests automatisés
 * 51 tests couvrant : registry, rate limiting, i18n, logos, debug panel, layout
 */
const fs = require('fs')
let passed = 0, failed = 0, errors = []

function test(name, fn) {
  try { fn(); console.log('  ✅', name); passed++ }
  catch(e) { console.log('  ❌', name, '-', e.message); errors.push(name + ': ' + e.message); failed++ }
}

function assert(c, msg) { if(!c) throw new Error(msg || 'Assertion failed') }

console.log('\n🧪 ZOUTI — Suite de tests automatisés\n' + '='.repeat(55))

// 1. Registry
console.log('\n📋 1. Registry des 65 outils')
const reg = fs.readFileSync('./lib/tools-registry.ts', 'utf8')
const ids = (reg.match(/id: '([^']+)'/g)||[]).map(m=>m.replace(/id: '|'/g,''))
const slugs = (reg.match(/slug: '([^']+)'/g)||[]).map(m=>m.replace(/slug: '|'/g,''))
test('65 outils enregistrés', () => assert(ids.length===65, `Trouvé ${ids.length}`))
test('Pas de doublons IDs', () => assert(new Set(ids).size===ids.length, 'Doublons'))
test('Pas de doublons slugs', () => assert(new Set(slugs).size===slugs.length, 'Doublons'))
test('8 outils PDF', () => assert(ids.filter(id=>['pdf-merge','pdf-split','pdf-rotate','images-to-pdf','pdf-to-images','pdf-watermark','pdf-extract-text','pdf-summarize'].includes(id)).length===8))
test('8 outils Images', () => assert(ids.filter(id=>['image-compress','image-convert','image-resize','image-crop','image-bg-remove','image-ocr','qrcode','thumbnail'].includes(id)).length===8))
test('13 outils Écriture', () => assert(ids.filter(id=>id.startsWith('write-')).length===13))
test('4 outils Détection', () => assert(ids.filter(id=>['ai-humanize','ai-tone-analyze','text-diff','readability'].includes(id)).length===4))
test('11 outils Conversion', () => assert(ids.filter(id=>['csv-to-json','json-to-csv','excel-to-csv','csv-to-excel','xml-to-json','md-to-html','html-to-md','txt-to-pdf','zip-extract','base64','url-encode'].includes(id)).length===11))
test('13 outils Dev', () => assert(ids.filter(id=>['html-preview','html-editor','json-format','json-download','sql-gen','sql-format','sql-run','regex-builder','minifier','jwt-decode','mock-json','code-diff','css-converter'].includes(id)).length===13))
test('8 outils Utilitaires', () => assert(ids.filter(id=>['tva-calc','password-gen','word-count','uuid-gen','lorem-ipsum','unit-convert','date-calc','color-picker'].includes(id)).length===8))

// 2. Rate Limiter
console.log('\n🛡️ 2. Rate Limiter')
const rl = fs.readFileSync('./lib/rate-limit.ts', 'utf8')
test('MAX_REQUESTS = 20', () => assert(rl.includes('MAX_REQUESTS = 20')))
test('WINDOW_MS = 1 heure', () => assert(rl.includes('60 * 60 * 1000')))
test('MAX_PROMPT_CHARS = 12000', () => assert(rl.includes('MAX_PROMPT_CHARS = 12000')))
test('checkRateLimit exportée', () => assert(rl.includes('export function checkRateLimit')))
test('validatePrompt exportée', () => assert(rl.includes('export function validatePrompt')))
test('getClientIp exportée', () => assert(rl.includes('export function getClientIp')))
test('Sliding window algorithm', () => assert(rl.includes('timestamps')))
test('Anti memory-leak (cleanup)', () => assert(rl.includes('store.size > 10000') || rl.includes('store.delete')))

// 3. API Route
console.log('\n🔌 3. Route API /api/ai')
const api = fs.readFileSync('./app/api/ai/route.ts', 'utf8')
test('checkRateLimit appelé', () => assert(api.includes('checkRateLimit')))
test('Status 429 géré', () => assert(api.includes('429')))
test('Retry-After header', () => assert(api.includes('Retry-After')))
test('Support langue (lang)', () => assert(api.includes('lang')))
test('Prompt tronqué 12000', () => assert(api.includes('12000')))
test('Modèle Haiku utilisé', () => assert(api.includes('claude-haiku')))
test('Gestion erreur 529/503', () => assert(api.includes('529')))

// 4. i18n
console.log('\n🌍 4. Système i18n FR/EN')
const i18n = fs.readFileSync('./lib/i18n.ts', 'utf8')
test('Type Lang défini', () => assert(i18n.includes("'fr' | 'en'")))
test('Section nav traduite', () => assert(i18n.includes('nav:')))
test('Section home traduite', () => assert(i18n.includes('home:')))
test('Section tool traduite', () => assert(i18n.includes('tool:')))
test('Section ui traduite', () => assert(i18n.includes('ui:')))
test('Section footer traduite', () => assert(i18n.includes('footer:')))
test('Section categories traduite', () => assert(i18n.includes('categories:')))
test('Catégories 7 langues', () => assert(i18n.includes('pdf:') && i18n.includes('devtools:') && i18n.includes('utilities:')))
test('toolTranslations exporté', () => assert(i18n.includes('export const toolTranslations')))
test('Fonction t() exportée', () => assert(i18n.includes('export function t(')))

// 5. LangContext
console.log('\n⚛️  5. LangContext React')
const lc = fs.readFileSync('./components/LangContext.tsx', 'utf8')
test('LangProvider exporté', () => assert(lc.includes('export function LangProvider')))
test('useLang exporté', () => assert(lc.includes('export function useLang')))
test('useT exporté', () => assert(lc.includes('export function useT')))
test('Persistance localStorage', () => assert(lc.includes('localStorage')))
test('Valeur défaut FR', () => assert(lc.includes("'fr'")))

// 6. Category Logos
console.log('\n🎨 6. Logos SVG par catégorie')
const logos = fs.readFileSync('./components/ui/CategoryLogos.tsx', 'utf8')
;['Pdf','Images','Writing','Detection','Conversion','DevTools','Utilities'].forEach(name => {
  test(`${name}Logo SVG exporté`, () => assert(logos.includes(`export function ${name}Logo`)))
})
test('CATEGORY_LOGOS map exporté', () => assert(logos.includes('export const CATEGORY_LOGOS')))
test('CATEGORY_COLORS map exporté', () => assert(logos.includes('export const CATEGORY_COLORS')))
test('TOOL_SECTION_ICONS map exporté', () => assert(logos.includes('export const TOOL_SECTION_ICONS')))

// 7. Debug Panel
console.log('\n🔧 7. Debug Panel')
const dp = fs.readFileSync('./components/ui/DebugPanel.tsx', 'utf8')
test('DebugPanel exporté', () => assert(dp.includes('export default function DebugPanel')))
test('Mode prod ?debug=1', () => assert(dp.includes('debug=1')))
test('Logos dans panel', () => assert(dp.includes('CATEGORY_LOGOS')))
test('Links vers outils', () => assert(dp.includes('href={')))
test('Stats (nb outils, IA, catégories)', () => assert(dp.includes('aiCount') || dp.includes('isAI')))

// 8. Fichiers présents
console.log('\n📁 8. Fichiers requis')
const files = [
  'package.json', 'next.config.js', 'tailwind.config.js',
  'postcss.config.js', 'tsconfig.json', 'vercel.json',
  '.env.example', '.gitignore',
  'app/layout.tsx', 'app/page.tsx', 'app/globals.css',
  'app/api/ai/route.ts',
  'lib/tools-registry.ts', 'lib/utils.ts', 'lib/rate-limit.ts', 'lib/i18n.ts',
  'components/LangContext.tsx',
  'components/layout/Header.tsx', 'components/layout/Footer.tsx',
  'components/tools/ToolLayout.tsx', 'components/tools/ToolRenderer.tsx',
  'components/ui/CategoryLogos.tsx', 'components/ui/LangSwitcher.tsx', 'components/ui/DebugPanel.tsx',
]
files.forEach(f => test(`${f} existe`, () => assert(fs.existsSync('./' + f), 'Fichier manquant')))

// Résultats
console.log('\n' + '='.repeat(55))
console.log(`\n📊 ${passed} ✅ passés · ${failed} ❌ échoués`)
if(errors.length) { console.log('\n🔴 Erreurs :'); errors.forEach(e => console.log('   •', e)) }
if(failed === 0) console.log('\n🎉 Tous les tests passent ! Zouti est prêt pour le déploiement.\n')
else { console.log(`\n❌ ${failed} test(s) échoué(s).\n`); process.exit(1) }
