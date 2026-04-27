'use client'
import { useState } from 'react'
import { callAI, fleschScore } from '@/lib/utils'
import * as Diff from 'diff'

// ─── AI Humanizer ──────────────────────────────────────────────────────────────
export function HumanizerTool() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [level, setLevel] = useState<'léger' | 'moyen' | 'fort'>('moyen')
  const [copied, setCopied] = useState(false)

  const run = async () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const res = await callAI('ai-humanize',
        `Réécris ce texte pour qu'il semble écrit par un humain (niveau de transformation : ${level}). 
Rends-le plus naturel, varié, avec des imperfections stylistiques humaines subtiles. 
Évite les structures trop parfaites, ajoute des tournures idiomatiques françaises, varie les longueurs de phrases.
Ne change pas le sens du contenu.

Texte à humaniser :
${input}`,
        'Tu es expert en rédaction humaine naturelle. Tu transformes les textes IA en textes qui semblent authentiquement écrits par un humain.'
      )
      setResult(res)
    } catch (e) { setResult('Erreur : ' + (e as Error).message) }
    setLoading(false)
  }

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: 10, padding: '12px 16px' }}>
        <p style={{ color: '#c084fc', fontSize: 13, margin: 0 }}>🧬 Transforme un texte généré par IA en écriture naturelle et authentique. Idéal pour ChatGPT, Claude, Gemini.</p>
      </div>

      <div>
        <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 10 }}>Intensité de transformation :</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['léger', 'moyen', 'fort'] as const).map(l => (
            <button key={l} onClick={() => setLevel(l)} style={{
              flex: 1, padding: '9px', borderRadius: 8,
              border: `1px solid ${level === l ? '#f97316' : 'rgba(255,255,255,0.08)'}`,
              background: level === l ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
              color: level === l ? '#f97316' : '#8888aa', cursor: 'pointer', fontSize: 13, fontWeight: level === l ? 600 : 400,
              textTransform: 'capitalize'
            }}>
              {l === 'léger' ? '🌿 Léger' : l === 'moyen' ? '⚡ Moyen' : '🔥 Fort'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <label style={{ color: '#8888aa', fontSize: 13 }}>Texte à humaniser</label>
          <span style={{ color: '#555570', fontSize: 12 }}>{input.length} caractères</span>
        </div>
        <textarea className="input" value={input} onChange={e => setInput(e.target.value)} placeholder="Collez votre texte généré par IA..." style={{ minHeight: 160 }} />
      </div>

      <button className="btn-primary" onClick={run} disabled={!input.trim() || loading} style={{ alignSelf: 'flex-start' }}>
        {loading ? <><span className="spinner" />&nbsp;Humanisation...</> : '🧬 Humaniser le texte'}
      </button>

      {result && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ color: '#8888aa', fontSize: 13 }}>Texte humanisé</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" onClick={copy} style={{ padding: '6px 12px', fontSize: 13 }}>{copied ? '✓ Copié !' : '📋 Copier'}</button>
              <button className="btn-secondary" onClick={() => { setInput(result); setResult('') }} style={{ padding: '6px 12px', fontSize: 13 }}>♻️ Réutiliser</button>
            </div>
          </div>
          <div className="result-box">{result}</div>
        </div>
      )}
    </div>
  )
}

// ─── Tone Analyzer ─────────────────────────────────────────────────────────────
export function ToneAnalyzerTool() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<null | { tone: string; confidence: string; details: string; suggestions: string }>(null)
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const res = await callAI('ai-tone-analyze',
        `Analyse le ton et le registre de ce texte. Réponds UNIQUEMENT en JSON valide avec cette structure exacte :
{
  "tone": "Ton principal (ex: Formel, Agressif, Neutre, Persuasif, Empathique, Humoristique, Urgent, etc.)",
  "confidence": "Pourcentage de certitude (ex: 87%)",
  "details": "Description détaillée du ton et du registre en 2-3 phrases",
  "suggestions": "1-2 suggestions pour adapter ou améliorer le ton selon le contexte"
}

Texte à analyser :
${input}`,
        'Tu es expert en analyse linguistique et communication. Réponds uniquement en JSON valide.'
      )
      try {
        const clean = res.replace(/```json|```/g, '').trim()
        setResult(JSON.parse(clean))
      } catch {
        setResult({ tone: 'Analyse', confidence: 'N/A', details: res, suggestions: '' })
      }
    } catch (e) { alert('Erreur lors de l\'analyse.') }
    setLoading(false)
  }

  const toneColors: Record<string, string> = {
    'Formel': '#60a5fa', 'Neutre': '#94a3b8', 'Persuasif': '#f97316',
    'Empathique': '#4ade80', 'Agressif': '#f87171', 'Urgent': '#fbbf24',
    'Humoristique': '#c084fc', 'Professionnel': '#60a5fa'
  }
  const color = result ? (toneColors[result.tone] || '#f97316') : '#f97316'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <label style={{ color: '#8888aa', fontSize: 13 }}>Texte à analyser</label>
          <span style={{ color: '#555570', fontSize: 12 }}>{input.length} car.</span>
        </div>
        <textarea className="input" value={input} onChange={e => setInput(e.target.value)} placeholder="Collez votre email, message, article, courrier..." style={{ minHeight: 140 }} />
      </div>

      <button className="btn-primary" onClick={analyze} disabled={!input.trim() || loading} style={{ alignSelf: 'flex-start' }}>
        {loading ? <><span className="spinner" />&nbsp;Analyse...</> : '🎯 Analyser le ton'}
      </button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'slideUp 0.3s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: `rgba(${color === '#f97316' ? '249,115,22' : '96,165,250'},0.08)`, border: `1px solid ${color}30`, borderRadius: 12, padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🎭</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color, marginBottom: 4 }}>{result.tone}</div>
              <div style={{ color: '#8888aa', fontSize: 13 }}>Ton dominant</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📊</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: '#f0f0f5', marginBottom: 4 }}>{result.confidence}</div>
              <div style={{ color: '#8888aa', fontSize: 13 }}>Confiance</div>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '16px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ color: '#8888aa', fontSize: 12, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Analyse détaillée</p>
            <p style={{ color: '#f0f0f5', fontSize: 14, margin: 0, lineHeight: 1.7 }}>{result.details}</p>
          </div>
          {result.suggestions && (
            <div style={{ background: 'rgba(249,115,22,0.06)', borderRadius: 10, padding: '16px', border: '1px solid rgba(249,115,22,0.15)' }}>
              <p style={{ color: '#f97316', fontSize: 12, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>💡 Suggestions</p>
              <p style={{ color: '#f0f0f5', fontSize: 14, margin: 0, lineHeight: 1.7 }}>{result.suggestions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Text Diff ─────────────────────────────────────────────────────────────────
export function TextDiffTool() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [diffResult, setDiffResult] = useState<Diff.Change[] | null>(null)
  const [mode, setMode] = useState<'words' | 'chars' | 'lines'>('words')

  const compare = () => {
    let result: Diff.Change[]
    if (mode === 'words') result = Diff.diffWords(text1, text2)
    else if (mode === 'chars') result = Diff.diffChars(text1, text2)
    else result = Diff.diffLines(text1, text2)
    setDiffResult(result)
  }

  const added = diffResult?.filter(d => d.added).reduce((acc, d) => acc + d.value.length, 0) || 0
  const removed = diffResult?.filter(d => d.removed).reduce((acc, d) => acc + d.value.length, 0) || 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Version originale</label>
          <textarea className="input" value={text1} onChange={e => setText1(e.target.value)} placeholder="Texte original..." style={{ minHeight: 180 }} />
        </div>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Nouvelle version</label>
          <textarea className="input" value={text2} onChange={e => setText2(e.target.value)} placeholder="Texte modifié..." style={{ minHeight: 180 }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['words', 'chars', 'lines'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              padding: '7px 14px', borderRadius: 8, border: `1px solid ${mode === m ? '#f97316' : 'rgba(255,255,255,0.08)'}`,
              background: mode === m ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
              color: mode === m ? '#f97316' : '#8888aa', cursor: 'pointer', fontSize: 13
            }}>
              {m === 'words' ? 'Mots' : m === 'chars' ? 'Caractères' : 'Lignes'}
            </button>
          ))}
        </div>
        <button className="btn-primary" onClick={compare} disabled={!text1.trim() || !text2.trim()}>⚖️ Comparer</button>
      </div>

      {diffResult && (
        <div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 13 }}>
            <span style={{ color: '#4ade80' }}>+{added} ajoutés</span>
            <span style={{ color: '#f87171' }}>-{removed} supprimés</span>
            <span style={{ color: '#555570' }}>{diffResult.filter(d => !d.added && !d.removed).length} parties inchangées</span>
          </div>
          <div className="result-box" style={{ lineHeight: 2, fontFamily: 'DM Sans, sans-serif' }}>
            {diffResult.map((part, i) => (
              <span key={i} style={{
                background: part.added ? 'rgba(74,222,128,0.15)' : part.removed ? 'rgba(248,113,113,0.15)' : 'transparent',
                color: part.added ? '#4ade80' : part.removed ? '#f87171' : '#f0f0f5',
                textDecoration: part.removed ? 'line-through' : 'none',
                borderRadius: 3, padding: part.added || part.removed ? '1px 3px' : 0
              }}>
                {part.value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Readability Analyzer ──────────────────────────────────────────────────────
export function ReadabilityTool() {
  const [input, setInput] = useState('')

  const words = input.trim() ? input.trim().split(/\s+/).length : 0
  const chars = input.length
  const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  const paragraphs = input.split(/\n\n+/).filter(p => p.trim().length > 0).length
  const avgWordsPerSentence = sentences > 0 ? Math.round(words / sentences) : 0
  const readingTime = Math.max(1, Math.ceil(words / 200))
  const flesch = input.trim().length > 20 ? fleschScore(input) : null

  const statBox = (label: string, value: string | number, sub?: string) => (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, color: '#f0f0f5' }}>{value}</div>
      <div style={{ color: '#8888aa', fontSize: 12, marginTop: 3 }}>{label}</div>
      {sub && <div style={{ color: '#555570', fontSize: 11, marginTop: 2 }}>{sub}</div>}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <label style={{ color: '#8888aa', fontSize: 13 }}>Votre texte</label>
          <span style={{ color: '#555570', fontSize: 12 }}>{words} mots</span>
        </div>
        <textarea className="input" value={input} onChange={e => setInput(e.target.value)} placeholder="Collez votre texte pour analyser sa lisibilité..." style={{ minHeight: 180 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {statBox('Mots', words)}
        {statBox('Caractères', chars)}
        {statBox('Phrases', sentences)}
        {statBox('Paragraphes', paragraphs)}
        {statBox('Mots / phrase', avgWordsPerSentence)}
        {statBox('Lecture', `~${readingTime} min`)}
      </div>

      {flesch && (
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: '20px', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f0f5' }}>Score de lisibilité (Flesch)</span>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: flesch.color }}>{flesch.score}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 100, height: 8, marginBottom: 10 }}>
            <div style={{ width: `${flesch.score}%`, height: '100%', background: `linear-gradient(90deg, #f87171, #fbbf24, #4ade80)`, borderRadius: 100, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#555570', fontSize: 12 }}>Très difficile (0) → Très facile (100)</span>
            <span style={{ background: `${flesch.color}22`, color: flesch.color, border: `1px solid ${flesch.color}44`, borderRadius: 6, padding: '3px 10px', fontSize: 13, fontWeight: 600 }}>{flesch.level}</span>
          </div>
          <p style={{ color: '#666680', fontSize: 13, margin: '12px 0 0' }}>
            {flesch.score >= 70 ? 'Texte très accessible, compréhensible par tous.' :
             flesch.score >= 50 ? 'Texte de niveau intermédiaire, accessible au grand public.' :
             'Texte complexe, adapté à un public averti ou expert.'}
          </p>
        </div>
      )}
    </div>
  )
}
