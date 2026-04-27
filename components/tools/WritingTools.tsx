'use client'
import { useState } from 'react'
import { callAI } from '@/lib/utils'

interface AIToolProps {
  toolId: string
  system: string
  buildPrompt: (input: string, opts?: Record<string, string>) => string
  placeholder: string
  inputLabel?: string
  outputLabel?: string
  options?: { key: string; label: string; choices: string[] }[]
  rows?: number
}

function AITextTool({ toolId, system, buildPrompt, placeholder, inputLabel = 'Votre texte', outputLabel = 'Résultat', options = [], rows = 6 }: AIToolProps) {
  const [input, setInput] = useState('')
  const [opts, setOpts] = useState<Record<string, string>>(Object.fromEntries(options.map(o => [o.key, o.choices[0]])))
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const run = async () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const res = await callAI(toolId, buildPrompt(input, opts), system)
      setResult(res)
    } catch (e) { setResult('Erreur : ' + (e as Error).message) }
    setLoading(false)
  }

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const charCount = input.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {options.length > 0 && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {options.map(opt => (
            <div key={opt.key} style={{ flex: 1, minWidth: 140 }}>
              <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>{opt.label}</label>
              <select className="input" value={opts[opt.key]} onChange={e => setOpts(p => ({ ...p, [opt.key]: e.target.value }))} style={{ padding: '9px 14px' }}>
                {opt.choices.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <label style={{ color: '#8888aa', fontSize: 13 }}>{inputLabel}</label>
          <span style={{ color: '#555570', fontSize: 12 }}>{charCount} caractères</span>
        </div>
        <textarea
          className="input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight: rows * 24 }}
          onKeyDown={e => { if (e.ctrlKey && e.key === 'Enter') run() }}
        />
        <p style={{ color: '#555570', fontSize: 12, margin: '4px 0 0' }}>Ctrl+Entrée pour lancer</p>
      </div>
      <button className="btn-primary" onClick={run} disabled={!input.trim() || loading} style={{ alignSelf: 'flex-start' }}>
        {loading ? <><span className="spinner" />&nbsp;Traitement IA...</> : '✦ Générer'}
      </button>
      {result && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ color: '#8888aa', fontSize: 13 }}>{outputLabel}</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" onClick={copy} style={{ padding: '6px 12px', fontSize: 13 }}>{copied ? '✓ Copié !' : '📋 Copier'}</button>
              <button className="btn-secondary" onClick={() => { setInput(result); setResult('') }} style={{ padding: '6px 12px', fontSize: 13 }}>♻️ Réutiliser</button>
            </div>
          </div>
          <div className="result-box">{result}</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 12, color: '#555570' }}>
            <span>{result.split(/\s+/).filter(Boolean).length} mots</span>
            <span>{result.length} caractères</span>
          </div>
        </div>
      )}
    </div>
  )
}

export function ArticleWriterTool() {
  return <AITextTool
    toolId="write-article"
    system="Tu es un expert en rédaction SEO. Rédige un article complet, bien structuré avec H2/H3, en français."
    buildPrompt={(input, opts) => `Rédige un article de blog complet sur : "${input}"\n\nTon : ${opts?.ton || 'Informatif'}\nLongueur : ${opts?.longueur || 'Moyen (500-800 mots)'}\n\nInclus : introduction engageante, sections structurées avec titres, conclusion avec CTA. Optimisé SEO.`}
    placeholder="Ex: Les avantages du télétravail pour les PME françaises"
    inputLabel="Sujet de l'article"
    outputLabel="Article généré"
    options={[
      { key: 'ton', label: 'Ton', choices: ['Informatif', 'Persuasif', 'Éducatif', 'Conversationnel'] },
      { key: 'longueur', label: 'Longueur', choices: ['Court (300 mots)', 'Moyen (500-800 mots)', 'Long (1000+ mots)'] }
    ]}
    rows={3}
  />
}

export function RephraseTool() {
  return <AITextTool
    toolId="write-rephrase"
    system="Tu es expert en reformulation. Garde le sens exact, change la formulation."
    buildPrompt={(input, opts) => `Reformule ce texte en ${opts?.style || 'langage naturel'} :\n\n${input}`}
    placeholder="Collez votre texte à reformuler..."
    options={[{ key: 'style', label: 'Style', choices: ['langage naturel', 'style formel', 'style simple', 'style percutant'] }]}
  />
}

export function CorrectTool() {
  return <AITextTool
    toolId="write-correct"
    system="Tu es un correcteur orthographique et grammatical expert en français. Corrige les erreurs et explique les corrections."
    buildPrompt={(input) => `Corrige ce texte et liste les corrections apportées :\n\n${input}\n\n---\nTexte corrigé:\n[texte corrigé]\n\nCorrections apportées:\n[liste des corrections]`}
    placeholder="Collez votre texte à corriger..."
    outputLabel="Texte corrigé + corrections"
  />
}

export function ImproveTool() {
  return <AITextTool
    toolId="write-improve"
    system="Tu es expert en amélioration éditoriale. Améliore la fluidité, la clarté et l'impact du texte."
    buildPrompt={(input, opts) => `Améliore ce texte pour le rendre plus ${opts?.objectif || 'professionnel et percutant'} :\n\n${input}`}
    placeholder="Collez votre texte à améliorer..."
    options={[{ key: 'objectif', label: 'Objectif', choices: ['professionnel et percutant', 'fluide et naturel', 'engageant et dynamique', 'clair et accessible'] }]}
  />
}

export function SummarizeTool() {
  return <AITextTool
    toolId="write-summarize"
    system="Tu es expert en synthèse. Résume de façon structurée et concise."
    buildPrompt={(input, opts) => `Résume ce texte en ${opts?.format || '5 points clés'}:\n\n${input}`}
    placeholder="Collez le texte à résumer (article, rapport, email...)..."
    options={[{ key: 'format', label: 'Format', choices: ['5 points clés', '3 paragraphes', '1 paragraphe', '10 bullet points'] }]}
    rows={8}
  />
}

export function ExpandTool() {
  return <AITextTool
    toolId="write-expand"
    system="Tu es expert en rédaction. Développe et enrichis le texte fourni avec des détails pertinents."
    buildPrompt={(input, opts) => `Développe et enrichis ce texte, en ciblant ${opts?.cible || 'un public professionnel'} :\n\n${input}`}
    placeholder="Collez votre texte court à développer..."
    options={[{ key: 'cible', label: 'Public cible', choices: ['un public professionnel', 'le grand public', 'des experts techniques', 'des décideurs'] }]}
  />
}

export function SimplifyTool() {
  return <AITextTool
    toolId="write-simplify"
    system="Tu es expert en vulgarisation. Simplifie sans dénaturer le sens."
    buildPrompt={(input, opts) => `Simplifie ce texte pour ${opts?.niveau || 'un lycéen'} :\n\n${input}`}
    placeholder="Collez un texte complexe, juridique, technique..."
    options={[{ key: 'niveau', label: 'Niveau', choices: ['un lycéen', 'un enfant de 10 ans', 'quelqu\'un sans expertise technique', 'le grand public'] }]}
  />
}

export function EmailGeneratorTool() {
  return <AITextTool
    toolId="write-email"
    system="Tu es expert en communication professionnelle. Rédige des emails parfaits, avec objet et corps."
    buildPrompt={(input, opts) => `Rédige un email professionnel de type "${opts?.type || 'demande d\'information'}" avec un ton ${opts?.ton || 'professionnel'} :\n\nContexte/sujet : ${input}\n\nFormat :\nObjet : [objet]\n\nCorp de l'email :\n[email]`}
    placeholder="Ex: Relance d'un client qui n'a pas répondu à notre devis depuis 2 semaines..."
    inputLabel="Contexte et sujet"
    outputLabel="Email généré (objet + corps)"
    options={[
      { key: 'type', label: 'Type', choices: ['relance', 'demande d\'information', 'proposition commerciale', 'remerciement', 'excuse', 'suivi'] },
      { key: 'ton', label: 'Ton', choices: ['professionnel', 'chaleureux', 'formel', 'direct'] }
    ]}
    rows={3}
  />
}

export function SocialPostTool() {
  return <AITextTool
    toolId="write-social"
    system="Tu es expert en social media marketing. Crée des posts engageants adaptés à chaque plateforme."
    buildPrompt={(input, opts) => `Crée un post ${opts?.plateforme || 'LinkedIn'} engageant sur :\n\n${input}\n\n${opts?.plateforme === 'LinkedIn' ? 'Style : storytelling professionnel, hook fort, emojis modérés, hashtags' : opts?.plateforme === 'Instagram' ? 'Style : inspirant, visuel, emojis, hashtags populaires' : 'Style : court, percutant, max 280 caractères'}`}
    placeholder="Ex: Lancement de notre nouveau service d'automatisation pour PME..."
    inputLabel="Sujet / idée du post"
    options={[{ key: 'plateforme', label: 'Plateforme', choices: ['LinkedIn', 'Instagram', 'X (Twitter)', 'Facebook'] }]}
    rows={3}
  />
}

export function LetterGeneratorTool() {
  return <AITextTool
    toolId="write-letter"
    system="Tu es expert en rédaction formelle et administrative française. Rédige des courriers conformes aux standards."
    buildPrompt={(input, opts) => `Rédige une lettre ${opts?.type || 'formelle'} pour :\n\n${input}\n\nInclus : en-tête type, formule d'appel, corps structuré, formule de politesse.`}
    placeholder="Ex: Contestation d'une facture erronée auprès d'un fournisseur..."
    inputLabel="Objet et contexte de la lettre"
    options={[{ key: 'type', label: 'Type', choices: ['formelle', 'administrative', 'commerciale', 'de réclamation', 'de motivation'] }]}
    rows={3}
  />
}

export function ProductDescriptionTool() {
  return <AITextTool
    toolId="write-product"
    system="Tu es expert en copywriting e-commerce. Rédige des descriptions qui vendent."
    buildPrompt={(input, opts) => `Rédige une description produit pour ${opts?.plateforme || 'site e-commerce'} :\n\nProduit : ${input}\n\nInclus : accroche, caractéristiques clés, bénéfices client, CTA. SEO-friendly.`}
    placeholder="Ex: Chaise ergonomique réglable en hauteur, accoudoirs 3D, appui-tête..."
    inputLabel="Description du produit / caractéristiques"
    options={[{ key: 'plateforme', label: 'Plateforme', choices: ['site e-commerce', 'Amazon', 'Cdiscount', 'fiche produit B2B'] }]}
    rows={3}
  />
}

export function KeywordExtractorTool() {
  return <AITextTool
    toolId="write-keywords"
    system="Tu es expert SEO. Extrais les mots-clés pertinents d'un texte."
    buildPrompt={(input) => `Extrais les mots-clés SEO de ce texte et classe-les par :\n1. Mots-clés principaux (3-5)\n2. Mots-clés secondaires (5-10)\n3. Expressions longue traîne (5-10)\n4. Questions associées (3-5)\n\nTexte :\n${input}`}
    placeholder="Collez votre texte ou description de votre activité..."
    outputLabel="Mots-clés SEO extraits"
    rows={5}
  />
}

export function ToneChangerTool() {
  return <AITextTool
    toolId="write-tone"
    system="Tu es expert en communication. Adapte le registre d'un texte tout en conservant son sens."
    buildPrompt={(input, opts) => `Réécris ce texte avec un ton ${opts?.ton || 'professionnel et formel'} :\n\n${input}`}
    placeholder="Collez votre texte à adapter..."
    options={[{ key: 'ton', label: 'Nouveau ton', choices: ['professionnel et formel', 'décontracté et chaleureux', 'persuasif et commercial', 'autoritaire et direct', 'empathique et bienveillant', 'humoristique et léger'] }]}
  />
}
