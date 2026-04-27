'use client'
import { useState, useEffect } from 'react'

// ─── TVA Calculator ────────────────────────────────────────────────────────────
export function TvaCalcTool() {
  const [amount, setAmount] = useState('')
  const [rate, setRate] = useState(20)
  const [mode, setMode] = useState<'ht-to-ttc' | 'ttc-to-ht'>('ht-to-ttc')

  const n = parseFloat(amount) || 0
  const tvaAmount = mode === 'ht-to-ttc' ? n * rate / 100 : n - n / (1 + rate / 100)
  const result = mode === 'ht-to-ttc' ? n + tvaAmount : n - tvaAmount
  const ht = mode === 'ht-to-ttc' ? n : result
  const ttc = mode === 'ht-to-ttc' ? result : n

  const fmt = (v: number) => v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {(['ht-to-ttc', 'ttc-to-ht'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, padding: '10px', borderRadius: 8,
            border: `1px solid ${mode === m ? '#f97316' : 'rgba(255,255,255,0.08)'}`,
            background: mode === m ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
            color: mode === m ? '#f97316' : '#8888aa', cursor: 'pointer', fontSize: 14, fontWeight: mode === m ? 600 : 400
          }}>{m === 'ht-to-ttc' ? 'HT → TTC' : 'TTC → HT'}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>{mode === 'ht-to-ttc' ? 'Montant HT (€)' : 'Montant TTC (€)'}</label>
          <input className="input" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="100.00" style={{ fontSize: 18, fontWeight: 600 }} />
        </div>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Taux de TVA</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[5.5, 10, 20].map(r => (
              <button key={r} onClick={() => setRate(r)} style={{
                flex: 1, padding: '10px', borderRadius: 8,
                border: `1px solid ${rate === r ? '#f97316' : 'rgba(255,255,255,0.08)'}`,
                background: rate === r ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
                color: rate === r ? '#f97316' : '#8888aa', cursor: 'pointer', fontSize: 14, fontWeight: rate === r ? 700 : 400
              }}>{r}%</button>
            ))}
          </div>
        </div>
      </div>
      {n > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 4 }}>
          {[
            { label: 'Montant HT', value: fmt(ht), color: '#f0f0f5' },
            { label: `TVA ${rate}%`, value: fmt(Math.abs(tvaAmount)), color: '#fbbf24' },
            { label: 'Montant TTC', value: fmt(ttc), color: '#4ade80' },
          ].map(item => (
            <div key={item.label} onClick={() => navigator.clipboard.writeText(item.value)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: item.color }}>{item.value}</div>
              <div style={{ color: '#555570', fontSize: 12, marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>
      )}
      <p style={{ color: '#555570', fontSize: 12, margin: 0 }}>💡 Taux réduit 5,5% (alimentaire, livres) · Intermédiaire 10% (restauration, transport) · Normal 20%</p>
    </div>
  )
}

// ─── Password Generator ────────────────────────────────────────────────────────
export function PasswordGenTool() {
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({ upper: true, lower: true, numbers: true, symbols: true })
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const generate = () => {
    const sets = [
      options.upper ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '',
      options.lower ? 'abcdefghijklmnopqrstuvwxyz' : '',
      options.numbers ? '0123456789' : '',
      options.symbols ? '!@#$%^&*()_+-=[]{}|;:,.<>?' : '',
    ].filter(Boolean)
    if (!sets.length) return
    const charset = sets.join('')
    let pw = ''
    // Ensure at least one of each type
    sets.forEach(s => { pw += s[Math.floor(Math.random() * s.length)] })
    for (let i = pw.length; i < length; i++) pw += charset[Math.floor(Math.random() * charset.length)]
    pw = pw.split('').sort(() => Math.random() - 0.5).join('')
    setPassword(pw)
    setHistory(prev => [pw, ...prev.slice(0, 4)])
  }

  const strength = () => {
    if (!password) return { label: '', color: '', width: 0 }
    let score = 0
    if (password.length >= 12) score++
    if (password.length >= 16) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (score <= 2) return { label: 'Faible', color: '#f87171', width: 30 }
    if (score <= 4) return { label: 'Moyen', color: '#fbbf24', width: 60 }
    return { label: 'Fort', color: '#4ade80', width: 90 }
  }

  const s = strength()

  useEffect(() => { generate() }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Longueur : {length} caractères</label>
        <input type="range" min={8} max={64} value={length} onChange={e => setLength(Number(e.target.value))} style={{ width: '100%', accentColor: '#f97316' }} />
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {Object.entries({ upper: 'Majuscules A-Z', lower: 'Minuscules a-z', numbers: 'Chiffres 0-9', symbols: 'Symboles !@#...' }).map(([key, label]) => (
          <button key={key} onClick={() => setOptions(p => ({ ...p, [key]: !p[key as keyof typeof p] }))} style={{
            padding: '8px 14px', borderRadius: 8,
            border: `1px solid ${options[key as keyof typeof options] ? '#f97316' : 'rgba(255,255,255,0.08)'}`,
            background: options[key as keyof typeof options] ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
            color: options[key as keyof typeof options] ? '#f97316' : '#8888aa', cursor: 'pointer', fontSize: 13
          }}>{label}</button>
        ))}
      </div>
      {password && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 20, color: '#f0f0f5', wordBreak: 'break-all', marginBottom: 12, letterSpacing: '0.05em' }}>{password}</div>
          <div className="progress-bar" style={{ marginBottom: 8 }}>
            <div className="progress-fill" style={{ width: `${s.width}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}bb)` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: s.color, fontSize: 13, fontWeight: 600 }}>Force : {s.label}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" onClick={() => { navigator.clipboard.writeText(password); setCopied(true); setTimeout(() => setCopied(false), 2000) }} style={{ padding: '6px 12px', fontSize: 13 }}>{copied ? '✓ Copié !' : '📋 Copier'}</button>
              <button className="btn-primary" onClick={generate} style={{ padding: '6px 12px', fontSize: 13 }}>🔄 Nouveau</button>
            </div>
          </div>
        </div>
      )}
      {history.length > 1 && (
        <div>
          <p style={{ color: '#555570', fontSize: 12, margin: '0 0 8px' }}>Historique de session</p>
          {history.slice(1).map((pw, i) => (
            <div key={i} onClick={() => { navigator.clipboard.writeText(pw) }} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 6, marginBottom: 4, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#555570' }}>
              <span>{pw}</span><span>📋</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Word Counter ──────────────────────────────────────────────────────────────
export function WordCountTool() {
  const [text, setText] = useState('')

  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const chars = text.length
  const charsNoSpace = text.replace(/\s/g, '').length
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length
  const readingTime = Math.max(1, Math.ceil(words / 200))
  const speakingTime = Math.max(1, Math.ceil(words / 130))
  const uniqueWords = new Set(text.toLowerCase().match(/\b\w+\b/g) || []).size

  const stats = [
    { label: 'Mots', value: words.toLocaleString('fr-FR'), icon: '📝' },
    { label: 'Caractères', value: chars.toLocaleString('fr-FR'), icon: '🔤' },
    { label: 'Sans espaces', value: charsNoSpace.toLocaleString('fr-FR'), icon: '✂️' },
    { label: 'Phrases', value: sentences.toLocaleString('fr-FR'), icon: '📌' },
    { label: 'Paragraphes', value: paragraphs.toLocaleString('fr-FR'), icon: '📋' },
    { label: 'Mots uniques', value: uniqueWords.toLocaleString('fr-FR'), icon: '🔑' },
    { label: 'Lecture', value: `${readingTime} min`, icon: '👀' },
    { label: 'À voix haute', value: `${speakingTime} min`, icon: '🎙️' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <textarea className="input" value={text} onChange={e => setText(e.target.value)} placeholder="Collez ou écrivez votre texte ici..." style={{ minHeight: 200 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: '#f0f0f5' }}>{s.value}</div>
            <div style={{ color: '#555570', fontSize: 11, marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── UUID Generator ────────────────────────────────────────────────────────────
export function UuidGenTool() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(5)
  const [format, setFormat] = useState<'v4' | 'uppercase' | 'no-dashes'>('v4')
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const genUuid = () => {
    const base = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    if (format === 'uppercase') return base.toUpperCase()
    if (format === 'no-dashes') return base.replace(/-/g, '')
    return base
  }

  const generate = () => setUuids(Array.from({ length: count }, genUuid))

  const copy = (idx: number) => {
    navigator.clipboard.writeText(uuids[idx])
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'))
    setCopiedIdx(-1)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'end' }}>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Quantité</label>
          <input className="input" type="number" min={1} max={100} value={count} onChange={e => setCount(Number(e.target.value))} style={{ width: 100 }} />
        </div>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Format</label>
          <select className="input" value={format} onChange={e => setFormat(e.target.value as any)}>
            <option value="v4">Standard (v4)</option>
            <option value="uppercase">MAJUSCULES</option>
            <option value="no-dashes">Sans tirets</option>
          </select>
        </div>
        <button className="btn-primary" onClick={generate}>🎲 Générer</button>
        {uuids.length > 0 && <button className="btn-secondary" onClick={copyAll}>{copiedIdx === -1 ? '✓ Tous copiés !' : '📋 Copier tout'}</button>}
      </div>
      {uuids.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {uuids.map((uuid, i) => (
            <div key={i} onClick={() => copy(i)} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8, padding: '10px 14px', cursor: 'pointer', transition: 'all 0.15s'
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>
              <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#a5b4fc' }}>{uuid}</code>
              <span style={{ color: copiedIdx === i ? '#4ade80' : '#555570', fontSize: 12, marginLeft: 12 }}>{copiedIdx === i ? '✓ Copié' : '📋'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Lorem Ipsum ───────────────────────────────────────────────────────────────
const LOREM_WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim est'.split(' ')

export function LoremIpsumTool() {
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs')
  const [count, setCount] = useState(3)
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = () => {
    const word = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]
    const sentence = () => {
      const len = 8 + Math.floor(Math.random() * 12)
      const words = Array.from({ length: len }, word)
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
      return words.join(' ') + '.'
    }
    const paragraph = () => Array.from({ length: 4 + Math.floor(Math.random() * 4) }, sentence).join(' ')

    if (type === 'words') setResult(Array.from({ length: count }, word).join(' '))
    else if (type === 'sentences') setResult(Array.from({ length: count }, sentence).join(' '))
    else setResult(Array.from({ length: count }, paragraph).join('\n\n'))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'end' }}>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Type</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['words', 'sentences', 'paragraphs'] as const).map(t => (
              <button key={t} onClick={() => setType(t)} style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${type === t ? '#f97316' : 'rgba(255,255,255,0.08)'}`, background: type === t ? 'rgba(249,115,22,0.15)' : 'transparent', color: type === t ? '#f97316' : '#8888aa', cursor: 'pointer', fontSize: 13 }}>{t === 'words' ? 'Mots' : t === 'sentences' ? 'Phrases' : 'Paragraphes'}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Quantité</label>
          <input className="input" type="number" min={1} max={50} value={count} onChange={e => setCount(Number(e.target.value))} style={{ width: 80 }} />
        </div>
        <button className="btn-primary" onClick={generate}>📝 Générer</button>
        {result && <button className="btn-secondary" onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>{copied ? '✓ Copié' : '📋 Copier'}</button>}
      </div>
      {result && <div className="result-box" style={{ lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{result}</div>}
    </div>
  )
}

// ─── Unit Converter ────────────────────────────────────────────────────────────
const UNITS: Record<string, { label: string; units: { key: string; label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[] }> = {
  length: {
    label: '📏 Longueur', units: [
      { key: 'mm', label: 'Millimètre (mm)', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { key: 'cm', label: 'Centimètre (cm)', toBase: v => v / 100, fromBase: v => v * 100 },
      { key: 'm', label: 'Mètre (m)', toBase: v => v, fromBase: v => v },
      { key: 'km', label: 'Kilomètre (km)', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { key: 'in', label: 'Pouce (in)', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
      { key: 'ft', label: 'Pied (ft)', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { key: 'mi', label: 'Mile (mi)', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
    ]
  },
  weight: {
    label: '⚖️ Poids', units: [
      { key: 'mg', label: 'Milligramme (mg)', toBase: v => v / 1000000, fromBase: v => v * 1000000 },
      { key: 'g', label: 'Gramme (g)', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { key: 'kg', label: 'Kilogramme (kg)', toBase: v => v, fromBase: v => v },
      { key: 't', label: 'Tonne (t)', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { key: 'oz', label: 'Once (oz)', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
      { key: 'lb', label: 'Livre (lb)', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    ]
  },
  temperature: {
    label: '🌡️ Température', units: [
      { key: 'C', label: 'Celsius (°C)', toBase: v => v, fromBase: v => v },
      { key: 'F', label: 'Fahrenheit (°F)', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      { key: 'K', label: 'Kelvin (K)', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    ]
  },
  area: {
    label: '📐 Surface', units: [
      { key: 'm2', label: 'Mètre carré (m²)', toBase: v => v, fromBase: v => v },
      { key: 'km2', label: 'Km carré (km²)', toBase: v => v * 1000000, fromBase: v => v / 1000000 },
      { key: 'ha', label: 'Hectare (ha)', toBase: v => v * 10000, fromBase: v => v / 10000 },
      { key: 'ft2', label: 'Pied carré (ft²)', toBase: v => v * 0.0929, fromBase: v => v / 0.0929 },
      { key: 'ac', label: 'Acre (ac)', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
    ]
  },
}

export function UnitConverterTool() {
  const [category, setCategory] = useState('length')
  const [from, setFrom] = useState('m')
  const [to, setTo] = useState('ft')
  const [value, setValue] = useState('')

  const cat = UNITS[category]
  const fromUnit = cat.units.find(u => u.key === from)
  const toUnit = cat.units.find(u => u.key === to)
  const result = value && fromUnit && toUnit ? toUnit.fromBase(fromUnit.toBase(parseFloat(value))) : null

  const fmt = (n: number) => {
    if (Math.abs(n) < 0.0001 || Math.abs(n) > 999999) return n.toExponential(4)
    return n.toLocaleString('fr-FR', { maximumFractionDigits: 6 })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {Object.entries(UNITS).map(([key, cat]) => (
          <button key={key} onClick={() => { setCategory(key); setFrom(UNITS[key].units[0].key); setTo(UNITS[key].units[1].key) }} style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${category === key ? '#f97316' : 'rgba(255,255,255,0.08)'}`, background: category === key ? 'rgba(249,115,22,0.15)' : 'transparent', color: category === key ? '#f97316' : '#8888aa', cursor: 'pointer', fontSize: 13 }}>{cat.label}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'end' }}>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>De</label>
          <select className="input" value={from} onChange={e => setFrom(e.target.value)}>
            {cat.units.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
          </select>
        </div>
        <div style={{ color: '#f97316', fontSize: 20, fontWeight: 800, padding: '10px 4px', textAlign: 'center' }}>→</div>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Vers</label>
          <select className="input" value={to} onChange={e => setTo(e.target.value)}>
            {cat.units.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
          </select>
        </div>
      </div>
      <input className="input" type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="Entrez une valeur..." style={{ fontSize: 18, fontWeight: 600 }} />
      {result !== null && (
        <div onClick={() => navigator.clipboard.writeText(fmt(result))} style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 12, padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 32, color: '#f97316' }}>{fmt(result)} <span style={{ fontSize: 18 }}>{toUnit?.key}</span></div>
          <div style={{ color: '#555570', fontSize: 13, marginTop: 6 }}>{value} {fromUnit?.key} = {fmt(result)} {toUnit?.key} · Clic pour copier</div>
        </div>
      )}
    </div>
  )
}

// ─── Date Calculator ───────────────────────────────────────────────────────────
export function DateCalcTool() {
  const [mode, setMode] = useState<'diff' | 'add' | 'workdays'>('diff')
  const [date1, setDate1] = useState(new Date().toISOString().split('T')[0])
  const [date2, setDate2] = useState('')
  const [days, setDays] = useState('')
  const [result, setResult] = useState<string | null>(null)

  const calc = () => {
    if (mode === 'diff') {
      if (!date1 || !date2) return
      const d1 = new Date(date1), d2 = new Date(date2)
      const diff = Math.abs(d2.getTime() - d1.getTime())
      const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24))
      const diffWeeks = Math.floor(diffDays / 7)
      const diffMonths = Math.abs((d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth()))
      setResult(`${diffDays} jours · ${diffWeeks} semaines · ${diffMonths} mois`)
    } else if (mode === 'add') {
      if (!date1 || !days) return
      const d = new Date(date1)
      d.setDate(d.getDate() + parseInt(days))
      setResult(d.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    } else {
      if (!date1 || !date2) return
      let d = new Date(date1), count = 0
      const end = new Date(date2)
      while (d <= end) {
        const day = d.getDay()
        if (day !== 0 && day !== 6) count++
        d.setDate(d.getDate() + 1)
      }
      setResult(`${count} jours ouvrés (hors week-ends, jours fériés non inclus)`)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {([['diff', '📅 Différence'], ['add', '➕ Ajouter des jours'], ['workdays', '💼 Jours ouvrés']] as const).map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m as any); setResult(null) }} style={{ flex: 1, padding: '9px', borderRadius: 8, border: `1px solid ${mode === m ? '#f97316' : 'rgba(255,255,255,0.08)'}`, background: mode === m ? 'rgba(249,115,22,0.15)' : 'transparent', color: mode === m ? '#f97316' : '#8888aa', cursor: 'pointer', fontSize: 13 }}>{label}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: mode === 'add' ? '1fr 1fr' : '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Date {mode === 'diff' || mode === 'workdays' ? 'de début' : ''}</label>
          <input className="input" type="date" value={date1} onChange={e => setDate1(e.target.value)} />
        </div>
        {mode === 'add' ? (
          <div>
            <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Nombre de jours à ajouter</label>
            <input className="input" type="number" value={days} onChange={e => setDays(e.target.value)} placeholder="30" />
          </div>
        ) : (
          <div>
            <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Date de fin</label>
            <input className="input" type="date" value={date2} onChange={e => setDate2(e.target.value)} />
          </div>
        )}
      </div>
      <button className="btn-primary" onClick={calc} style={{ alignSelf: 'flex-start' }}>📅 Calculer</button>
      {result && (
        <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 12, padding: '20px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: '#f97316' }}>{result}</div>
        </div>
      )}
    </div>
  )
}

// ─── Color Picker ──────────────────────────────────────────────────────────────
export function ColorPickerTool() {
  const [color, setColor] = useState('#f97316')
  const [copied, setCopied] = useState<string | null>(null)

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
  }

  const rgbToHsl = ({ r, g, b }: { r: number; g: number; b: number }) => {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  const rgb = hexToRgb(color)
  const hsl = rgbToHsl(rgb)

  const formats = [
    { label: 'HEX', value: color.toUpperCase() },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'CSS var', value: `--color: ${color};` },
    { label: 'Tailwind', value: `[${color}]` },
  ]

  const copyFmt = (val: string) => { navigator.clipboard.writeText(val); setCopied(val); setTimeout(() => setCopied(null), 2000) }

  // Shades
  const shades = [0.2, 0.4, 0.6, 0.8, 1, 0.8, 0.6, 0.4, 0.2].map((factor, i) => {
    const lightness = i < 4 ? 90 - i * 15 : i === 4 ? hsl.l : 40 - (i - 5) * 10
    return `hsl(${hsl.h}, ${hsl.s}%, ${Math.max(5, Math.min(95, lightness))}%)`
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Choisir une couleur</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 80, height: 80, border: 'none', borderRadius: 12, cursor: 'pointer', background: 'transparent' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ width: '100%', height: 80, borderRadius: 12, background: color, border: '1px solid rgba(255,255,255,0.1)', boxShadow: `0 8px 32px ${color}66` }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
        {formats.map(fmt => (
          <div key={fmt.label} onClick={() => copyFmt(fmt.value)} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${copied === fmt.value ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, padding: '12px 14px', cursor: 'pointer', transition: 'all 0.15s' }}>
            <div style={{ color: '#555570', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{fmt.label}</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: copied === fmt.value ? '#f97316' : '#f0f0f5' }}>{copied === fmt.value ? '✓ Copié !' : fmt.value}</div>
          </div>
        ))}
      </div>

      <div>
        <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 10 }}>Palette de teintes</label>
        <div style={{ display: 'flex', gap: 4 }}>
          {shades.map((shade, i) => (
            <div key={i} onClick={() => copyFmt(shade)} style={{ flex: 1, height: 48, borderRadius: 8, background: shade, cursor: 'pointer', transition: 'transform 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scaleY(1.2)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scaleY(1)')}
              title={shade} />
          ))}
        </div>
      </div>
    </div>
  )
}
