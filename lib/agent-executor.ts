/**
 * ZOUTI Agent Executor
 * Fonctions programmatiques des outils — appelables par l'agent sans composants React
 */

export interface ToolResult {
  success: boolean
  output?: string
  outputType?: 'text' | 'json' | 'html' | 'sql' | 'url' | 'blob'
  downloadUrl?: string
  downloadName?: string
  error?: string
}

type ToolParams = Record<string, string>

// ── Appel Claude API ───────────────────────────────────────────────────────────
async function callAI(prompt: string, system?: string): Promise<string> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ toolId: 'agent', prompt, system }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.result
}

// ── Résolution des paramètres dynamiques ───────────────────────────────────────
export function resolveParams(
  params: ToolParams,
  userText: string,
  stepResults: string[],
  file?: File
): ToolParams {
  const resolved: ToolParams = {}
  for (const [key, value] of Object.entries(params)) {
    let v = value
    v = v.replace('{USER_TEXT}', userText)
    stepResults.forEach((r, i) => { v = v.replace(`{STEP_${i + 1}}`, r) })
    resolved[key] = v
  }
  return resolved
}

// ── Exécution d'un outil par son ID ───────────────────────────────────────────
export async function executeTool(
  toolId: string,
  params: ToolParams,
  userText: string,
  file?: File
): Promise<ToolResult> {
  const input = params.input ?? userText

  try {
    switch (toolId) {

      // ── ÉCRITURE IA ──────────────────────────────────────────────────────────
      case 'write-article': {
        const result = await callAI(
          `Rédige un article de blog complet et optimisé SEO sur : "${input}"\n\nInclus : introduction, sections H2, conclusion avec CTA. Ton informatif et professionnel.`,
          'Tu es expert en rédaction SEO. Rédige en français.'
        )
        return { success: true, output: result, outputType: 'text' }
      }

      case 'write-rephrase': {
        const style = params.style ?? 'naturel et professionnel'
        const result = await callAI(
          `Reformule ce texte en style ${style}, en conservant exactement le même sens :\n\n${input}`,
          'Tu es expert en reformulation. Garde le sens, change la forme.'
        )
        return { success: true, output: result, outputType: 'text' }
      }

      case 'write-correct': {
        const result = await callAI(
          `Corrige les fautes d'orthographe, de grammaire et de syntaxe dans ce texte. Liste les corrections apportées ensuite :\n\n${input}`,
          'Tu es correcteur orthographique expert en français.'
        )
        return { success: true, output: result, outputType: 'text' }
      }

      case 'write-improve': {
        const result = await callAI(
          `Améliore ce texte pour le rendre plus fluide, percutant et professionnel :\n\n${input}`,
          'Tu es expert éditorial. Améliore sans changer le sens.'
        )
        return { success: true, output: result, outputType: 'text' }
      }

      case 'write-summarize': {
        const format = params.format ?? '5 points clés'
        const result = await callAI(
          `Résume ce texte en ${format} :\n\n${input}`,
          'Tu es expert en synthèse. Sois concis et précis.'
        )
        return { success: true, output: result, outputType: 'text' }
      }

      case 'write-expand': {
        const result = await callAI(
          `Développe et enrichis ce texte avec des détails pertinents, des exemples et des explications :\n\n${input}`,
          'Tu es expert en rédaction. Développe sans dénaturer.'
        )
        return { success: true, output: result, outputType: 'text' }
      }

      case 'write-simplify': {
        const result = await callAI(
          `Simplifie ce texte pour le rendre accessible au grand public, sans jargon technique :\n\n${input}`,
          'Tu es expert en vulgarisation. Simplifie sans perdre l\'essentiel.'
        )
        return { success: true, output: result, outputType: 'text' }
      }

      case 'write-email': {
        const type = params.type ?? 'professionnel'
        const result = await callAI(
          `Rédige un email ${type} sur le sujet suivant :\n\n${input}\n\nFormat :\nObjet : [objet]\n\n[Corps de l'email]`,
          'Tu es expert en communication professionnelle.'
        )
        return { success: true, output: result, outputType: 'text' }
      }

      case 'write-social': {
        const platform = params.platform ?? 'LinkedIn'
        const result = await callAI(
          `Crée un post ${platform} engageant et professionnel sur :\n\n${input}`,
          `Tu es expert en social media. Adapte le style à ${platform}.`
        )
        return { success: true, output: result, outputType: 'text' }
      }

      case 'write-letter': {
        const result = await callAI(
          `Rédige une lettre formelle pour :\n\n${input}\n\nInclus : formule d'appel, corps structuré, formule de politesse.`,
          'Tu es expert en rédaction formelle et administrative française.'
        )
        return { success: true, output: result, outputType: 'text' }
      }

      case 'write-product': {
        const result = await callAI(
          `Rédige une description produit percutante et optimisée pour la conversion pour :\n\n${input}`,
          'Tu es expert en copywriting e-commerce. Rédige pour vendre.'
        )
        return { success: true, output: result, outputType: 'text' }
      }

      case 'write-keywords': {
        const result = await callAI(
          `Extrais les mots-clés SEO principaux, secondaires et longue traîne de ce texte :\n\n${input}`,
          'Tu es expert SEO. Structure les mots-clés par catégorie.'
        )
        return { success: true, output: result, outputType: 'text' }
      }

      case 'write-tone': {
        const tone = params.tone ?? 'professionnel'
        const result = await callAI(
          `Réécris ce texte avec un ton ${tone} en conservant exactement le même contenu :\n\n${input}`,
          'Tu es expert en communication. Adapte le registre sans changer le fond.'
        )
        return { success: true, output: result, outputType: 'text' }
      }

      // ── DÉTECTION & IA ───────────────────────────────────────────────────────
      case 'ai-humanize': {
        const result = await callAI(
          `Réécris ce texte pour qu'il semble authentiquement écrit par un humain. Ajoute des tournures naturelles, varie les structures de phrases, évite les formulations trop parfaites :\n\n${input}`,
          'Tu es expert en rédaction humaine naturelle. Humanise sans changer le sens.'
        )
        return { success: true, output: result, outputType: 'text' }
      }

      case 'ai-tone-analyze': {
        const result = await callAI(
          `Analyse le ton et le registre de ce texte. Identifie : ton dominant, niveau de formalité, intention, points d'amélioration :\n\n${input}`,
          'Tu es expert en analyse linguistique.'
        )
        return { success: true, output: result, outputType: 'text' }
      }

      case 'readability': {
        const words = input.trim().split(/\s+/).length
        const sentences = input.split(/[.!?]+/).filter((s: string) => s.trim().length > 0).length
        const avgWPS = sentences > 0 ? Math.round(words / sentences) : 0
        const readingTime = Math.max(1, Math.ceil(words / 200))
        const score = Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * avgWPS - 84.6 * (words / Math.max(1, sentences)))))
        const level = score >= 70 ? 'Très facile' : score >= 50 ? 'Moyen' : 'Difficile'
        return {
          success: true,
          output: `📊 Analyse de lisibilité\n\n• Mots : ${words}\n• Phrases : ${sentences}\n• Mots par phrase : ${avgWPS}\n• Temps de lecture : ~${readingTime} min\n• Score Flesch : ${score}/100\n• Niveau : ${level}`,
          outputType: 'text'
        }
      }

      // ── DEV TOOLS ────────────────────────────────────────────────────────────
      case 'sql-gen': {
        const dialect = params.dialect ?? 'SQL'
        const result = await callAI(
          `Génère une requête ${dialect} pour : "${input}"\nRéponds uniquement avec la requête SQL commentée.`,
          `Tu es expert en SQL ${dialect}. Génère des requêtes optimisées.`
        )
        return { success: true, output: result.replace(/```sql|```/g, '').trim(), outputType: 'sql' }
      }

      case 'regex-builder': {
        const result = await callAI(
          `Génère une expression régulière JavaScript pour : "${input}"\nRéponds avec : la regex, une explication, et 3 exemples de test.`,
          'Tu es expert en expressions régulières.'
        )
        return { success: true, output: result, outputType: 'text' }
      }

      case 'mock-json': {
        const count = parseInt(params.count ?? '5')
        const result = await callAI(
          `Génère ${count} éléments de données JSON fictives réalistes pour : "${input}"\nRéponds UNIQUEMENT avec un tableau JSON valide.`,
          'Tu es expert en génération de données de test réalistes.'
        )
        const clean = result.replace(/```json|```/g, '').trim()
        try {
          const parsed = JSON.parse(clean)
          return { success: true, output: JSON.stringify(parsed, null, 2), outputType: 'json' }
        } catch {
          return { success: true, output: clean, outputType: 'json' }
        }
      }

      case 'json-format': {
        try {
          const parsed = JSON.parse(input)
          return { success: true, output: JSON.stringify(parsed, null, 2), outputType: 'json' }
        } catch (e) {
          return { success: false, error: 'JSON invalide : ' + (e as Error).message }
        }
      }

      case 'md-to-html': {
        const { marked } = await import('marked')
        const html = await marked(input)
        return { success: true, output: html as string, outputType: 'html' }
      }

      case 'html-to-md': {
        const TurndownService = (await import('turndown')).default
        const td = new TurndownService()
        return { success: true, output: td.turndown(input), outputType: 'text' }
      }

      case 'base64': {
        const mode = params.mode ?? 'encode'
        try {
          const output = mode === 'encode'
            ? btoa(unescape(encodeURIComponent(input)))
            : decodeURIComponent(escape(atob(input.trim())))
          return { success: true, output, outputType: 'text' }
        } catch {
          return { success: false, error: 'Encodage Base64 impossible avec ce texte.' }
        }
      }

      case 'url-encode': {
        const mode = params.mode ?? 'encode'
        try {
          const output = mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input)
          return { success: true, output, outputType: 'url' }
        } catch {
          return { success: false, error: 'Encodage URL impossible.' }
        }
      }

      case 'csv-to-json': {
        const Papa = (await import('papaparse')).default
        const result = Papa.parse(input.trim(), { header: true, skipEmptyLines: true })
        return { success: true, output: JSON.stringify(result.data, null, 2), outputType: 'json' }
      }

      case 'json-to-csv': {
        const Papa = (await import('papaparse')).default
        const data = JSON.parse(input)
        return { success: true, output: Papa.unparse(data), outputType: 'text' }
      }

      case 'xml-to-json': {
        const { XMLParser } = await import('fast-xml-parser')
        const parser = new XMLParser({ ignoreAttributes: false })
        const result = parser.parse(input)
        return { success: true, output: JSON.stringify(result, null, 2), outputType: 'json' }
      }

      // ── UTILITAIRES ──────────────────────────────────────────────────────────
      case 'tva-calc': {
        const amount = parseFloat(params.amount ?? input.replace(/[^0-9.]/g, ''))
        const rate = parseFloat(params.rate ?? '20')
        const mode = params.mode ?? 'ht-to-ttc'
        if (isNaN(amount)) return { success: false, error: 'Montant invalide.' }
        const tva = mode === 'ht-to-ttc' ? amount * rate / 100 : amount - amount / (1 + rate / 100)
        const ht = mode === 'ht-to-ttc' ? amount : amount - tva
        const ttc = mode === 'ht-to-ttc' ? amount + tva : amount
        const fmt = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
        return {
          success: true,
          output: `💰 Calcul TVA ${rate}%\n\n• Montant HT : ${fmt(ht)}\n• TVA (${rate}%) : ${fmt(Math.abs(tva))}\n• Montant TTC : ${fmt(ttc)}`,
          outputType: 'text'
        }
      }

      case 'word-count': {
        const text = input
        const words = text.trim() ? text.trim().split(/\s+/).length : 0
        const chars = text.length
        const sentences = text.split(/[.!?]+/).filter((s: string) => s.trim().length > 0).length
        const readingTime = Math.max(1, Math.ceil(words / 200))
        return {
          success: true,
          output: `📊 Statistiques du texte\n\n• Mots : ${words}\n• Caractères : ${chars}\n• Phrases : ${sentences}\n• Temps de lecture : ~${readingTime} min`,
          outputType: 'text'
        }
      }

      case 'uuid-gen': {
        const count = parseInt(params.count ?? '5')
        const uuids = Array.from({ length: Math.min(count, 20) }, () =>
          'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
          })
        )
        return { success: true, output: uuids.join('\n'), outputType: 'text' }
      }

      case 'lorem-ipsum': {
        const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt labore dolore magna aliqua enim minim veniam quis nostrud exercitation ullamco laboris nisi aliquip commodo consequat duis aute irure reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident'.split(' ')
        const count = parseInt(params.count ?? '3')
        const type = params.type ?? 'paragraphs'
        const word = () => WORDS[Math.floor(Math.random() * WORDS.length)]
        const sentence = () => {
          const w = Array.from({ length: 8 + Math.floor(Math.random() * 10) }, word)
          w[0] = w[0].charAt(0).toUpperCase() + w[0].slice(1)
          return w.join(' ') + '.'
        }
        const paragraph = () => Array.from({ length: 4 + Math.floor(Math.random() * 3) }, sentence).join(' ')
        let result = ''
        if (type === 'words') result = Array.from({ length: count }, word).join(' ')
        else if (type === 'sentences') result = Array.from({ length: count }, sentence).join(' ')
        else result = Array.from({ length: count }, paragraph).join('\n\n')
        return { success: true, output: result, outputType: 'text' }
      }

      case 'password-gen': {
        const length = parseInt(params.length ?? '16')
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
        const password = Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
        return { success: true, output: password, outputType: 'text' }
      }

      case 'color-picker': {
        const hex = input.startsWith('#') ? input : `#${input}`
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)
        const rN = r / 255, gN = g / 255, bN = b / 255
        const max = Math.max(rN, gN, bN), min = Math.min(rN, gN, bN)
        let h = 0, s = 0, l = (max + min) / 2
        if (max !== min) {
          const d = max - min
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
          h = max === rN ? ((gN - bN) / d + (gN < bN ? 6 : 0)) / 6
            : max === gN ? ((bN - rN) / d + 2) / 6
            : ((rN - gN) / d + 4) / 6
        }
        return {
          success: true,
          output: `🎨 Conversions couleur\n\n• HEX : ${hex.toUpperCase()}\n• RGB : rgb(${r}, ${g}, ${b})\n• HSL : hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)\n• CSS var : --color: ${hex};`,
          outputType: 'text'
        }
      }

      // ── PDF résumé (via extraction texte) ────────────────────────────────────
      case 'pdf-summarize': {
        if (!file) return { success: false, error: 'Fichier PDF requis pour cette étape.' }
        const bytes = await file.arrayBuffer()
        const decoder = new TextDecoder('latin1')
        const text = decoder.decode(bytes)
        const matches = text.match(/BT[\s\S]*?ET/g) || []
        const extracted = matches.join('\n').replace(/\(([^)]*)\)\s*Tj/g, '$1 ').replace(/[^\x20-\x7E\n]/g, ' ').trim().slice(0, 6000)
        if (!extracted.trim()) return { success: false, error: 'Impossible d\'extraire le texte de ce PDF.' }
        const result = await callAI(
          `Fais un résumé structuré de ce document :\n1. Thème principal\n2. Points clés (bullet points)\n3. Conclusion\n\nContenu :\n${extracted}`,
          'Tu es expert en synthèse de documents.'
        )
        return { success: true, output: result, outputType: 'text' }
      }

      case 'pdf-extract-text': {
        if (!file) return { success: false, error: 'Fichier PDF requis.' }
        const bytes = await file.arrayBuffer()
        const decoder = new TextDecoder('latin1')
        const text = decoder.decode(bytes)
        const matches = text.match(/BT[\s\S]*?ET/g) || []
        const extracted = matches.join('\n').replace(/\(([^)]*)\)\s*Tj/g, '$1 ').replace(/[^\x20-\x7E\n]/g, ' ').trim()
        return { success: true, output: extracted || 'Aucun texte extractible trouvé.', outputType: 'text' }
      }

      // ── Outil non géré ────────────────────────────────────────────────────────
      default:
        return {
          success: false,
          error: `L'outil "${toolId}" est disponible en mode direct. Rendez-vous sur la page de l'outil pour l'utiliser.`
        }
    }

  } catch (e) {
    return { success: false, error: (e as Error).message || 'Erreur lors de l\'exécution' }
  }
}
