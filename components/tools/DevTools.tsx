'use client'
import { useState, useRef, useEffect } from 'react'
import { callAI, downloadText } from '@/lib/utils'
import { format as sqlFormat } from 'sql-formatter'
import * as diffLib from 'diff'

// ─── HTML Preview ──────────────────────────────────────────────────────────────
export function HtmlPreviewTool() {
  const [code, setCode] = useState(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 20px; background: #f9f9f9; }
    h1 { color: #f97316; }
  </style>
</head>
<body>
  <h1>Bonjour Zouti ! 👋</h1>
  <p>Modifiez ce code HTML et voyez le rendu en direct.</p>
</body>
</html>`)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, minHeight: 400 }}>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Code HTML</label>
          <textarea
            className="input"
            value={code}
            onChange={e => setCode(e.target.value)}
            style={{ height: 400, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, resize: 'none' }}
          />
        </div>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Aperçu en direct</label>
          <iframe
            srcDoc={code}
            sandbox="allow-scripts"
            style={{ width: '100%', height: 400, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, background: 'white' }}
            title="HTML Preview"
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-secondary" onClick={() => downloadText(code, 'zouti.html', 'text/html')}>💾 Télécharger .html</button>
        <button className="btn-secondary" onClick={() => navigator.clipboard.writeText(code)}>📋 Copier le code</button>
      </div>
    </div>
  )
}

// ─── HTML/CSS/JS Editor ────────────────────────────────────────────────────────
export function HtmlEditorTool() {
  const [html, setHtml] = useState('<h1>Titre</h1>\n<p>Mon contenu</p>')
  const [css, setCss] = useState('body { font-family: sans-serif; padding: 20px; }\nh1 { color: #f97316; }')
  const [js, setJs] = useState('console.log("Zouti Editor");')
  const [tab, setTab] = useState<'html' | 'css' | 'js'>('html')

  const preview = `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="tab-bar" style={{ width: 280 }}>
        {(['html', 'css', 'js'] as const).map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t.toUpperCase()}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, minHeight: 380 }}>
        <div>
          {tab === 'html' && <textarea className="input" value={html} onChange={e => setHtml(e.target.value)} style={{ height: 380, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, resize: 'none' }} />}
          {tab === 'css' && <textarea className="input" value={css} onChange={e => setCss(e.target.value)} style={{ height: 380, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, resize: 'none' }} />}
          {tab === 'js' && <textarea className="input" value={js} onChange={e => setJs(e.target.value)} style={{ height: 380, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, resize: 'none' }} />}
        </div>
        <div>
          <iframe srcDoc={preview} sandbox="allow-scripts" style={{ width: '100%', height: 380, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, background: 'white' }} title="Live Preview" />
        </div>
      </div>
    </div>
  )
}

// ─── JSON Formatter ────────────────────────────────────────────────────────────
export function JsonFormatterTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)
  const [copied, setCopied] = useState(false)

  const format = () => {
    setError('')
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indent))
    } catch (e) { setError((e as Error).message) }
  }

  const minify = () => {
    setError('')
    try {
      setOutput(JSON.stringify(JSON.parse(input)))
    } catch (e) { setError((e as Error).message) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-primary" onClick={format} disabled={!input.trim()}>✨ Formater</button>
          <button className="btn-secondary" onClick={minify} disabled={!input.trim()}>🗜️ Minifier</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ color: '#8888aa', fontSize: 13 }}>Indentation :</label>
          {[2, 4].map(n => (
            <button key={n} onClick={() => setIndent(n)} style={{
              padding: '5px 12px', borderRadius: 6, border: `1px solid ${indent === n ? '#f97316' : 'rgba(255,255,255,0.08)'}`,
              background: indent === n ? 'rgba(249,115,22,0.15)' : 'transparent',
              color: indent === n ? '#f97316' : '#8888aa', cursor: 'pointer', fontSize: 13
            }}>{n}</button>
          ))}
        </div>
        {output && <button className="btn-secondary" onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>{copied ? '✓ Copié' : '📋 Copier'}</button>}
      </div>
      {error && <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13 }}>❌ JSON invalide : {error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>JSON brut</label>
          <textarea className="input" value={input} onChange={e => setInput(e.target.value)} placeholder='{"name":"Alice","age":30}' style={{ minHeight: 280, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
        </div>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Résultat formaté</label>
          <textarea className="input" readOnly value={output} style={{ minHeight: 280, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#a5b4fc' }} />
        </div>
      </div>
    </div>
  )
}

// ─── JSON Download ─────────────────────────────────────────────────────────────
export function JsonDownloadTool() {
  const [input, setInput] = useState('')
  const [filename, setFilename] = useState('data')
  const [error, setError] = useState('')

  const download = () => {
    setError('')
    try {
      const parsed = JSON.parse(input)
      const pretty = JSON.stringify(parsed, null, 2)
      downloadText(pretty, `${filename}.json`, 'application/json')
    } catch (e) { setError('JSON invalide : ' + (e as Error).message) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Nom du fichier</label>
        <input className="input" value={filename} onChange={e => setFilename(e.target.value)} placeholder="data" style={{ maxWidth: 300 }} />
      </div>
      <div>
        <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Contenu JSON</label>
        <textarea className="input" value={input} onChange={e => { setInput(e.target.value); setError('') }} placeholder='{"key":"value"}' style={{ minHeight: 240, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
      </div>
      {error && <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13 }}>❌ {error}</div>}
      <button className="btn-primary" onClick={download} disabled={!input.trim()} style={{ alignSelf: 'flex-start' }}>💾 Télécharger {filename || 'data'}.json</button>
    </div>
  )
}

// ─── SQL Generator ─────────────────────────────────────────────────────────────
export function SqlGeneratorTool() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [dialect, setDialect] = useState('PostgreSQL')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const res = await callAI('sql-gen',
        `Génère une requête SQL ${dialect} pour : "${input}"\n\nRéponds UNIQUEMENT avec la requête SQL, sans explication. Ajoute des commentaires SQL (-- ...) pour expliquer les parties importantes.`,
        `Tu es expert en SQL ${dialect}. Génère des requêtes propres, optimisées et commentées.`
      )
      const clean = res.replace(/```sql|```/g, '').trim()
      setResult(clean)
    } catch (e) { setResult('Erreur : ' + (e as Error).message) }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 10 }}>Dialecte SQL :</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['PostgreSQL', 'MySQL', 'SQLite', 'SQL Server', 'BigQuery'].map(d => (
            <button key={d} onClick={() => setDialect(d)} style={{
              padding: '7px 14px', borderRadius: 8, border: `1px solid ${dialect === d ? '#f97316' : 'rgba(255,255,255,0.08)'}`,
              background: dialect === d ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
              color: dialect === d ? '#f97316' : '#8888aa', cursor: 'pointer', fontSize: 13, fontWeight: dialect === d ? 600 : 400
            }}>{d}</button>
          ))}
        </div>
      </div>
      <div>
        <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Décrivez votre requête en français</label>
        <textarea className="input" value={input} onChange={e => setInput(e.target.value)} placeholder="Ex: Sélectionne tous les utilisateurs actifs créés ce mois-ci, avec leur nombre de commandes, triés par date décroissante..." style={{ minHeight: 100 }} />
      </div>
      <button className="btn-primary" onClick={generate} disabled={!input.trim() || loading} style={{ alignSelf: 'flex-start' }}>
        {loading ? <><span className="spinner" />&nbsp;Génération...</> : '🗄️ Générer le SQL'}
      </button>
      {result && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ color: '#8888aa', fontSize: 13 }}>SQL généré ({dialect})</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }} style={{ padding: '6px 12px', fontSize: 13 }}>{copied ? '✓ Copié' : '📋 Copier'}</button>
              <button className="btn-secondary" onClick={() => downloadText(result, 'query.sql')} style={{ padding: '6px 12px', fontSize: 13 }}>💾 .sql</button>
            </div>
          </div>
          <pre className="code-block" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{result}</pre>
        </>
      )}
    </div>
  )
}

// ─── SQL Formatter ─────────────────────────────────────────────────────────────
export function SqlFormatterTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [dialect, setDialect] = useState<'sql' | 'postgresql' | 'mysql' | 'bigquery'>('sql')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const format = () => {
    setError('')
    try {
      const formatted = sqlFormat(input, { language: dialect, tabWidth: 2, keywordCase: 'upper' })
      setOutput(formatted)
    } catch (e) { setError((e as Error).message) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['sql', 'postgresql', 'mysql', 'bigquery'] as const).map(d => (
            <button key={d} onClick={() => setDialect(d)} style={{
              padding: '6px 12px', borderRadius: 7, border: `1px solid ${dialect === d ? '#f97316' : 'rgba(255,255,255,0.08)'}`,
              background: dialect === d ? 'rgba(249,115,22,0.15)' : 'transparent',
              color: dialect === d ? '#f97316' : '#8888aa', cursor: 'pointer', fontSize: 12
            }}>{d}</button>
          ))}
        </div>
        <button className="btn-primary" onClick={format} disabled={!input.trim()}>✨ Formater</button>
        {output && <button className="btn-secondary" onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>{copied ? '✓ Copié' : '📋 Copier'}</button>}
      </div>
      {error && <div style={{ background: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13 }}>❌ {error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>SQL brut</label>
          <textarea className="input" value={input} onChange={e => setInput(e.target.value)} placeholder="select u.name,count(o.id) from users u left join orders o on u.id=o.user_id group by u.name" style={{ minHeight: 240, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
        </div>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>SQL formaté</label>
          <pre className="code-block" style={{ minHeight: 240, overflowY: 'auto', margin: 0, fontSize: 12 }}>{output || 'Le résultat apparaîtra ici...'}</pre>
        </div>
      </div>
    </div>
  )
}

// ─── SQL Runner (SQLite WASM via CDN) ────────────────────────────────────────
// sql.js chargé au runtime depuis CDN — aucun npm install nécessaire
const SQL_JS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.js'

async function loadSqlJs(): Promise<any> {
  if ((window as any).__sqljs__) return (window as any).__sqljs__
  await new Promise<void>((resolve, reject) => {
    if (document.querySelector('script[data-sqljscdn]')) { resolve(); return }
    const s = document.createElement('script')
    s.src = SQL_JS_CDN
    s.setAttribute('data-sqljscdn', '1')
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Impossible de charger sql.js'))
    document.head.appendChild(s)
  })
  const initSqlJs = (window as any).initSqlJs
  if (!initSqlJs) throw new Error('sql.js non disponible')
  const SQL = await initSqlJs({ locateFile: (f: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${f}` })
  ;(window as any).__sqljs__ = SQL
  return SQL
}

export function SqlRunnerTool() {
  const [schema, setSchema] = useState(`CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER);
INSERT INTO users VALUES (1, 'Alice', 30), (2, 'Bob', 25), (3, 'Charlie', 35);`)
  const [query, setQuery] = useState('SELECT * FROM users WHERE age > 28 ORDER BY age;')
  const [result, setResult] = useState<{ columns: string[]; rows: any[][] } | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const dbRef = useRef<any>(null)

  const initDb = async () => {
    if (!dbRef.current) {
      const SQL = await loadSqlJs()
      dbRef.current = new SQL.Database()
    }
    return dbRef.current
  }

  const run = async () => {
    setLoading(true); setError(''); setResult(null)
    try {
      const db = await initDb()
      if (schema.trim()) db.run(schema)
      const res = db.exec(query)
      if (res.length > 0) {
        setResult({ columns: res[0].columns, rows: res[0].values })
      } else {
        setResult({ columns: ['Résultat'], rows: [['✓ Requête exécutée avec succès (aucune donnée retournée)']] })
      }
    } catch (e) { setError((e as Error).message) }
    setLoading(false)
  }

  const reset = () => { dbRef.current = null; setResult(null); setError('') }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, padding: '12px 16px' }}>
        <p style={{ color: '#a5b4fc', fontSize: 13, margin: 0 }}>💡 <strong>SQLite in-browser</strong> — Vos données restent dans votre navigateur. Créez des tables, insérez des données, exécutez des requêtes.</p>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <label style={{ color: '#8888aa', fontSize: 13 }}>Schéma & données (CREATE TABLE, INSERT...)</label>
          <button onClick={reset} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 12 }}>🗑️ Réinitialiser</button>
        </div>
        <textarea className="input" value={schema} onChange={e => setSchema(e.target.value)} style={{ minHeight: 100, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
      </div>
      <div>
        <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Requête SQL</label>
        <textarea className="input" value={query} onChange={e => setQuery(e.target.value)} style={{ minHeight: 80, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
      </div>
      {error && <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13 }}>❌ {error}</div>}
      <button className="btn-primary" onClick={run} disabled={!query.trim() || loading} style={{ alignSelf: 'flex-start' }}>
        {loading ? <><span className="spinner" />&nbsp;Exécution...</> : '▶️ Exécuter'}
      </button>
      {result && (
        <div style={{ overflowX: 'auto' }}>
          <p style={{ color: '#8888aa', fontSize: 13, margin: '0 0 8px' }}>{result.rows.length} ligne{result.rows.length > 1 ? 's' : ''} retournée{result.rows.length > 1 ? 's' : ''}</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>{result.columns.map((c, i) => <th key={i} style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316', padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid rgba(249,115,22,0.2)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {result.rows.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                  {row.map((cell, j) => <td key={j} style={{ padding: '7px 12px', color: '#f0f0f5', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'JetBrains Mono, monospace' }}>{String(cell ?? 'NULL')}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Regex Builder ─────────────────────────────────────────────────────────────
export function RegexBuilderTool() {
  const [desc, setDesc] = useState('')
  const [regex, setRegex] = useState('')
  const [flags, setFlags] = useState('g')
  const [testStr, setTestStr] = useState('')
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState<string[]>([])

  const generate = async () => {
    if (!desc.trim()) return
    setLoading(true)
    try {
      const res = await callAI('regex-builder',
        `Génère une expression régulière JavaScript pour : "${desc}"\nRéponds UNIQUEMENT avec la regex entre slashes, exemple : /^[a-z]+$/i\nSans explication.`,
        'Tu es expert en expressions régulières. Génère des regex précises et efficaces.'
      )
      const match = res.match(/\/(.+)\/([gimsuy]*)/)
      if (match) { setRegex(match[1]); setFlags(match[2] || 'g') }
      else setRegex(res.replace(/[`\/]/g, '').trim())
    } catch (e) { alert('Erreur : ' + (e as Error).message) }
    setLoading(false)
  }

  const test = () => {
    if (!regex || !testStr) return
    try {
      const re = new RegExp(regex, flags)
      setMatches(testStr.match(re) || [])
    } catch (e) { setMatches([]) }
  }

  const highlighted = (() => {
    if (!regex || !testStr) return testStr
    try {
      const re = new RegExp(`(${regex})`, flags.replace('g', '') + 'g')
      return testStr.replace(re, '<<MATCH>>$1<</MATCH>>')
        .replace(/<<MATCH>>/g, '<mark style="background:rgba(249,115,22,0.3);color:#f97316;border-radius:3px;padding:1px 3px">')
        .replace(/<\/MATCH>>/g, '</mark>')
    } catch { return testStr }
  })()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Décrivez votre pattern en français</label>
        <input className="input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Ex: Email valide, numéro de téléphone français, URL HTTPS, code postal à 5 chiffres..." />
      </div>
      <button className="btn-primary" onClick={generate} disabled={!desc.trim() || loading} style={{ alignSelf: 'flex-start' }}>
        {loading ? <><span className="spinner" />&nbsp;Génération...</> : '🔎 Générer la Regex'}
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'end' }}>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Expression régulière</label>
          <input className="input" value={regex} onChange={e => setRegex(e.target.value)} placeholder="^[a-z]+$" style={{ fontFamily: 'JetBrains Mono, monospace' }} />
        </div>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Flags</label>
          <input className="input" value={flags} onChange={e => setFlags(e.target.value)} style={{ width: 80, fontFamily: 'JetBrains Mono, monospace', textAlign: 'center' }} />
        </div>
      </div>
      {regex && (
        <div className="code-block" style={{ padding: '10px 14px' }}>
          <span style={{ color: '#94a3b8' }}>Regex : </span>
          <span style={{ color: '#f97316' }}>/{regex}/</span>
          <span style={{ color: '#c084fc' }}>{flags}</span>
        </div>
      )}
      <div>
        <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Texte de test</label>
        <textarea className="input" value={testStr} onChange={e => setTestStr(e.target.value)} placeholder="Entrez un texte pour tester votre regex..." style={{ minHeight: 80 }} />
      </div>
      <button className="btn-secondary" onClick={test} disabled={!regex || !testStr} style={{ alignSelf: 'flex-start' }}>▶️ Tester ({matches.length} correspondance{matches.length !== 1 ? 's' : ''})</button>
      {testStr && regex && (
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Résultat ({matches.length} match{matches.length > 1 ? 'es' : ''})</label>
          <div className="result-box" style={{ lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: highlighted }} />
        </div>
      )}
    </div>
  )
}

// ─── Minifier/Beautifier ───────────────────────────────────────────────────────
export function MinifierTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [type, setType] = useState<'json' | 'css' | 'html'>('json')
  const [mode, setMode] = useState<'beautify' | 'minify'>('beautify')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const run = () => {
    setError('')
    try {
      if (type === 'json') {
        const parsed = JSON.parse(input)
        setOutput(mode === 'beautify' ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed))
      } else if (type === 'css') {
        if (mode === 'minify') setOutput(input.replace(/\s+/g, ' ').replace(/\s*{\s*/g, '{').replace(/\s*}\s*/g, '}').replace(/\s*:\s*/g, ':').replace(/\s*;\s*/g, ';').trim())
        else {
          let out = '', indent = 0
          for (const ch of input.replace(/\s+/g, ' ')) {
            if (ch === '{') { out += ' {\n' + '  '.repeat(++indent); continue }
            if (ch === '}') { out += '\n' + '  '.repeat(--indent) + '}\n'; continue }
            if (ch === ';') { out += ';\n' + '  '.repeat(indent); continue }
            out += ch
          }
          setOutput(out.trim())
        }
      } else {
        if (mode === 'minify') setOutput(input.replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim())
        else {
          let out = '', indent = 0, inTag = false
          const tags = input.split(/(<[^>]+>)/)
          tags.forEach(t => {
            if (!t.trim()) return
            if (t.startsWith('</')) { indent = Math.max(0, indent - 1); out += '\n' + '  '.repeat(indent) + t }
            else if (t.startsWith('<') && !t.endsWith('/>') && !t.startsWith('<!') && !t.startsWith('<?')) { out += '\n' + '  '.repeat(indent) + t; indent++ }
            else out += t
          })
          setOutput(out.trim())
        }
      }
    } catch (e) { setError((e as Error).message) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['json', 'css', 'html'] as const).map(t => (
            <button key={t} onClick={() => setType(t)} style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${type === t ? '#f97316' : 'rgba(255,255,255,0.08)'}`, background: type === t ? 'rgba(249,115,22,0.15)' : 'transparent', color: type === t ? '#f97316' : '#8888aa', cursor: 'pointer', fontSize: 13, fontWeight: type === t ? 600 : 400 }}>{t.toUpperCase()}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['beautify', 'minify'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${mode === m ? '#a5b4fc' : 'rgba(255,255,255,0.08)'}`, background: mode === m ? 'rgba(165,180,252,0.1)' : 'transparent', color: mode === m ? '#a5b4fc' : '#8888aa', cursor: 'pointer', fontSize: 13 }}>{m === 'beautify' ? '✨ Beautify' : '🗜️ Minify'}</button>
          ))}
        </div>
        <button className="btn-primary" onClick={run} disabled={!input.trim()}>▶️ Exécuter</button>
        {output && <button className="btn-secondary" onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>{copied ? '✓ Copié' : '📋 Copier'}</button>}
      </div>
      {error && <div style={{ background: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13 }}>❌ {error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Code source</label>
          <textarea className="input" value={input} onChange={e => setInput(e.target.value)} style={{ minHeight: 260, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
        </div>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Résultat</label>
          <textarea className="input" readOnly value={output} style={{ minHeight: 260, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#a5b4fc' }} />
        </div>
      </div>
    </div>
  )
}

// ─── JWT Decoder ───────────────────────────────────────────────────────────────
export function JwtDecoderTool() {
  const [input, setInput] = useState('')

  const decode = () => {
    if (!input.trim()) return null
    try {
      const parts = input.trim().split('.')
      if (parts.length !== 3) return null
      return {
        header: JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'))),
        payload: JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))),
        signature: parts[2]
      }
    } catch { return null }
  }

  const decoded = decode()

  const Section = ({ title, data, color }: { title: string; data: any; color: string }) => (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}22`, borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ background: `${color}15`, borderBottom: `1px solid ${color}22`, padding: '8px 14px' }}>
        <span style={{ color, fontSize: 13, fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>{title}</span>
      </div>
      <pre style={{ margin: 0, padding: '14px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#a5b4fc', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )

  const exp = decoded?.payload?.exp
  const expDate = exp ? new Date(exp * 1000) : null
  const isExpired = expDate ? expDate < new Date() : false

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Token JWT</label>
        <textarea className="input" value={input} onChange={e => setInput(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0..." style={{ minHeight: 80, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
      </div>
      {decoded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, animation: 'slideUp 0.3s ease' }}>
          {expDate && (
            <div style={{ background: isExpired ? 'rgba(248,113,113,0.1)' : 'rgba(74,222,128,0.1)', border: `1px solid ${isExpired ? 'rgba(248,113,113,0.3)' : 'rgba(74,222,128,0.3)'}`, borderRadius: 8, padding: '10px 14px', color: isExpired ? '#f87171' : '#4ade80', fontSize: 13 }}>
              {isExpired ? '❌ Token expiré' : '✅ Token valide'} — Expire le {expDate.toLocaleString('fr-FR')}
            </div>
          )}
          <Section title="HEADER — Algorithme & type" data={decoded.header} color="#60a5fa" />
          <Section title="PAYLOAD — Données" data={decoded.payload} color="#f97316" />
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px' }}>
            <p style={{ color: '#c084fc', fontSize: 13, fontWeight: 600, margin: '0 0 6px' }}>SIGNATURE</p>
            <code style={{ color: '#94a3b8', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', wordBreak: 'break-all' }}>{decoded.signature}</code>
          </div>
        </div>
      )}
      {input.trim() && !decoded && (
        <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13 }}>❌ Token JWT invalide</div>
      )}
    </div>
  )
}

// ─── Mock JSON Generator ───────────────────────────────────────────────────────
export function MockJsonTool() {
  const [desc, setDesc] = useState('')
  const [count, setCount] = useState(5)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    if (!desc.trim()) return
    setLoading(true)
    try {
      const res = await callAI('mock-json',
        `Génère ${count} éléments de données JSON fictives réalistes pour : "${desc}"\nRéponds UNIQUEMENT avec un tableau JSON valide, sans explication ni markdown.`,
        'Tu es expert en génération de données de test réalistes. Génère des données cohérentes et crédibles.'
      )
      const clean = res.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setResult(JSON.stringify(parsed, null, 2))
    } catch (e) { setResult('Erreur lors de la génération. Réessayez.') }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Description des données</label>
          <input className="input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Ex: utilisateurs e-commerce avec nom, email, ville, historique d'achats..." />
        </div>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Quantité</label>
          <input className="input" type="number" min={1} max={50} value={count} onChange={e => setCount(Number(e.target.value))} style={{ width: 80 }} />
        </div>
      </div>
      <button className="btn-primary" onClick={generate} disabled={!desc.trim() || loading} style={{ alignSelf: 'flex-start' }}>
        {loading ? <><span className="spinner" />&nbsp;Génération...</> : '🎲 Générer les données mock'}
      </button>
      {result && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ color: '#8888aa', fontSize: 13 }}>JSON généré</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }} style={{ padding: '6px 12px', fontSize: 13 }}>{copied ? '✓ Copié' : '📋 Copier'}</button>
              <button className="btn-secondary" onClick={() => downloadText(result, 'mock-data.json', 'application/json')} style={{ padding: '6px 12px', fontSize: 13 }}>💾 .json</button>
            </div>
          </div>
          <pre className="code-block" style={{ maxHeight: 400, overflowY: 'auto', whiteSpace: 'pre-wrap', fontSize: 12 }}>{result}</pre>
        </>
      )}
    </div>
  )
}

// ─── Code Diff ─────────────────────────────────────────────────────────────────
export function CodeDiffTool() {
  const [code1, setCode1] = useState('')
  const [code2, setCode2] = useState('')
  const [diffs, setDiffs] = useState<diffLib.Change[] | null>(null)

  const compare = () => setDiffs(diffLib.diffLines(code1, code2))
  const stats = diffs ? { added: diffs.filter(d => d.added).length, removed: diffs.filter(d => d.removed).length } : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Version A (originale)</label>
          <textarea className="input" value={code1} onChange={e => setCode1(e.target.value)} placeholder="function hello() {\n  console.log('Hello');\n}" style={{ minHeight: 200, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
        </div>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Version B (modifiée)</label>
          <textarea className="input" value={code2} onChange={e => setCode2(e.target.value)} placeholder="function hello(name) {\n  console.log(`Hello ${name}!`);\n}" style={{ minHeight: 200, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
        </div>
      </div>
      <button className="btn-primary" onClick={compare} disabled={!code1.trim() || !code2.trim()} style={{ alignSelf: 'flex-start' }}>📑 Comparer</button>
      {diffs && (
        <>
          <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
            <span style={{ color: '#4ade80' }}>+{stats?.added} ligne{stats?.added !== 1 ? 's' : ''} ajoutée{stats?.added !== 1 ? 's' : ''}</span>
            <span style={{ color: '#f87171' }}>-{stats?.removed} ligne{stats?.removed !== 1 ? 's' : ''} supprimée{stats?.removed !== 1 ? 's' : ''}</span>
          </div>
          <div className="code-block" style={{ padding: 0, overflow: 'hidden' }}>
            {diffs.map((part, i) => (
              <div key={i} style={{
                padding: '2px 12px',
                background: part.added ? 'rgba(74,222,128,0.1)' : part.removed ? 'rgba(248,113,113,0.1)' : 'transparent',
                borderLeft: `3px solid ${part.added ? '#4ade80' : part.removed ? '#f87171' : 'transparent'}`,
                fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                color: part.added ? '#4ade80' : part.removed ? '#f87171' : '#8888aa',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word'
              }}>
                {(part.added ? '+ ' : part.removed ? '- ' : '  ') + part.value.replace(/\n$/, '')}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── CSS Converter ─────────────────────────────────────────────────────────────
export function CssConverterTool() {
  const [value, setValue] = useState('')
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [from, setFrom] = useState<'px' | 'rem' | 'em'>('px')
  const [results, setResults] = useState<{ px: string; rem: string; em: string } | null>(null)

  const convert = () => {
    const n = parseFloat(value)
    if (isNaN(n)) return
    let px: number
    if (from === 'px') px = n
    else if (from === 'rem') px = n * baseFontSize
    else px = n * baseFontSize
    setResults({
      px: `${px}px`,
      rem: `${(px / baseFontSize).toFixed(4)}rem`,
      em: `${(px / baseFontSize).toFixed(4)}em`
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Valeur</label>
          <input className="input" type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="16" />
        </div>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Unité source</label>
          <select className="input" value={from} onChange={e => setFrom(e.target.value as any)}>
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
          </select>
        </div>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Base font-size</label>
          <input className="input" type="number" value={baseFontSize} onChange={e => setBaseFontSize(Number(e.target.value))} />
        </div>
      </div>
      <button className="btn-primary" onClick={convert} disabled={!value} style={{ alignSelf: 'flex-start' }}>🎨 Convertir</button>
      {results && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {Object.entries(results).map(([unit, val]) => (
            <div key={unit} onClick={() => navigator.clipboard.writeText(val)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)') }
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)') }>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, color: '#f97316' }}>{val}</div>
              <div style={{ color: '#555570', fontSize: 12, marginTop: 4 }}>{unit} — clic pour copier</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
