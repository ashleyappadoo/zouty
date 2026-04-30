import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const maxDuration = 60

const TOOLS_CATALOG = `
Tu es l'agent Zouti — une plateforme d'outils IA en ligne.
Tu disposes des outils suivants que tu peux orchestrer :

PDF & DOCUMENTS:
- pdf-merge : Fusionner plusieurs PDFs
- pdf-split : Découper un PDF en pages
- pdf-rotate : Rotation de pages PDF
- pdf-extract-text : Extraire le texte d'un PDF
- pdf-summarize : Résumer un PDF avec l'IA (nécessite fichier PDF)
- images-to-pdf : Convertir images en PDF
- pdf-watermark : Ajouter filigrane à un PDF

IMAGES:
- image-compress : Compresser une image
- image-convert : Convertir format image (JPG/PNG/WebP)
- image-resize : Redimensionner une image
- image-crop : Recadrer une image
- image-bg-remove : Supprimer le fond d'une image
- image-ocr : Extraire texte d'une image
- qrcode : Générer un QR Code (nécessite une URL ou texte)

ÉCRITURE IA:
- write-article : Rédiger un article complet
- write-rephrase : Reformuler un texte
- write-correct : Corriger orthographe et grammaire
- write-improve : Améliorer un texte
- write-summarize : Résumer un texte
- write-expand : Développer un texte court
- write-simplify : Simplifier un texte complexe
- write-email : Générer un email professionnel
- write-social : Générer un post réseau social
- write-letter : Rédiger une lettre formelle
- write-product : Description produit e-commerce
- write-keywords : Extraire mots-clés SEO
- write-tone : Changer le ton d'un texte

DÉTECTION & IA:
- ai-humanize : Humaniser un texte généré par IA
- ai-tone-analyze : Analyser le ton d'un texte
- text-diff : Comparer deux textes
- readability : Analyser la lisibilité

CONVERSION FICHIERS:
- csv-to-json : CSV vers JSON
- json-to-csv : JSON vers CSV
- xml-to-json : XML vers JSON
- md-to-html : Markdown vers HTML
- html-to-md : HTML vers Markdown
- txt-to-pdf : Texte vers PDF
- base64 : Encoder/décoder Base64
- url-encode : Encoder/décoder URL

DEV TOOLS:
- sql-gen : Générer une requête SQL
- regex-builder : Créer une expression régulière
- json-format : Formater du JSON
- mock-json : Générer des données JSON de test
- jwt-decode : Décoder un token JWT
- css-converter : Convertir px/rem/em

UTILITAIRES:
- tva-calc : Calculer TVA France
- password-gen : Générer mot de passe
- word-count : Compter mots et caractères
- uuid-gen : Générer UUID
- lorem-ipsum : Générer Lorem Ipsum
- unit-convert : Convertir unités
- date-calc : Calculer dates
- color-picker : Convertir couleurs HEX/RGB/HSL
`

const SYSTEM_PROMPT = `${TOOLS_CATALOG}

Quand un utilisateur te décrit une tâche, tu dois :
1. Comprendre son besoin
2. Identifier quels outils utiliser et dans quel ordre
3. Retourner un plan d'exécution en JSON

Réponds UNIQUEMENT avec un JSON valide (sans markdown) dans ce format exact :
{
  "understood": "Description courte de ce que l'utilisateur veut faire",
  "needsFile": true/false,
  "fileDescription": "Description du fichier attendu si needsFile est true (ex: 'Votre fichier PDF', 'Votre image JPG/PNG')",
  "steps": [
    {
      "toolId": "id-de-l-outil",
      "label": "Description courte de cette étape",
      "description": "Ce que cette étape va faire exactement",
      "params": {
        "input": "valeur ou {USER_TEXT} ou {FILE} ou résultat d'une étape précédente",
        "key": "valeur"
      }
    }
  ],
  "finalMessage": "Message à afficher à l'utilisateur une fois tout terminé"
}

Règles importantes :
- Utilise {USER_TEXT} dans les params quand tu as besoin du texte saisi par l'utilisateur
- Utilise {FILE} quand tu as besoin du fichier uploadé par l'utilisateur  
- Utilise {STEP_N} pour référencer le résultat de l'étape N (ex: {STEP_1})
- Si la tâche nécessite uniquement du texte (pas de fichier), mets needsFile: false
- Limite à 5 étapes maximum
- Si la tâche ne correspond à aucun outil disponible, retourne steps: [] et explique dans finalMessage
- Réponds toujours en français`

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Limite de requêtes atteinte. Réessayez dans quelques minutes.' }, { status: 429 })
    }

    const { message, lang = 'fr' } = await req.json()
    if (!message?.trim()) return NextResponse.json({ error: 'Message vide' }, { status: 400 })

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Service IA non configuré' }, { status: 500 })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 55000)

    let response: Response
    try {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-20240307',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: message }],
        }),
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeoutId)
    }

    if (!response.ok) {
      return NextResponse.json({ error: 'Erreur du service IA' }, { status: 500 })
    }

    const data = await response.json()
    const raw = data.content?.[0]?.text ?? '{}'

    try {
      const plan = JSON.parse(raw.replace(/```json|```/g, '').trim())
      return NextResponse.json({ plan, remaining: rateLimit.remaining })
    } catch {
      return NextResponse.json({ error: 'Impossible de parser le plan', raw }, { status: 500 })
    }

  } catch (e: any) {
    if (e?.name === 'AbortError') return NextResponse.json({ error: 'Délai dépassé.' }, { status: 504 })
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
