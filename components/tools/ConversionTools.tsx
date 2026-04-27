'use client'
import { useState } from 'react'
import { downloadText, downloadBlob } from '@/lib/utils'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { marked } from 'marked'
import TurndownService from 'turndown'
import { XMLParser } from 'fast-xml-parser'
import JSZip from 'jszip'
import { jsPDF } from 'jspdf'

// ─── Reusable converter shell ──────────────────────────────────────────────────
function ConvertShell({
  title, inputLabel, outputLabel, inputPlaceholder, outputPlaceholder = '',
  inputLang = 'text', outputLang = 'text', onConvert, inputMode = 'text', uploadAccept = ''
}: {
  title: string; inputLabel: string; outputLabel: string;
  inputPlaceholder: string; outputPlaceholder?: string;
  inputLang?: string; outputLang?: string;
  onConvert: (input: string) => Promise<{ text: string; filename: string; mime?: string }>;
  inputMode?: 'text' | 'file'; uploadAccept?: string
}) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [filename, setFilename] = useState('')
  const [mime, setMime] = useState('text/plain')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const run = async (val?: string) => {
    const src = val ?? input
    if (!src.trim()) return
    setLoading(true); setError('')
    try {
      const res = await onConvert(src)
      setOutput(res.text); setFilename(res.filename); setMime(res.mime ?? 'text/plain')
    } catch (e) { setError((e as Error).message || 'Erreur de conversion') }
    setLoading(false)
  }

  const handleFile = (f: File) => {
    const reader = new FileReader()
    reader.onload = e => { const v = e.target?.result as string; setInput(v); run(v) }
    reader.readAsText(f)
  }

  const download = () => downloadText(output, filename, mime)
  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {inputMode === 'file' && (
        <div className="drop-zone" onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = uploadAccept; i.onchange = e => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) handleFile(f) }; i.click() }}>
          <span style={{ fontSize: 32 }}>📁</span>
          <p style={{ color: '#8888aa', margin: '8px 0 0', fontSize: 14 }}>Cliquez pour sélectionner un fichier</p>
          {input && <p style={{ color: '#4ade80', fontSize: 13, margin: '4px 0 0' }}>✓ Fichier chargé</p>}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>{inputLabel}</label>
          <textarea className="input" value={input} onChange={e => setInput(e.target.value)} placeholder={inputPlaceholder} style={{ minHeight: 200, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
        </div>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>{outputLabel}</label>
          <textarea className="input" readOnly value={output} placeholder={outputPlaceholder || 'Le résultat apparaîtra ici...'} style={{ minHeight: 200, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, opacity: output ? 1 : 0.5 }} />
        </div>
      </div>
      {error && <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13 }}>❌ {error}</div>}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn-primary" onClick={() => run()} disabled={!input.trim() || loading}>
          {loading ? <><span className="spinner" />&nbsp;Conversion...</> : '🔄 Convertir'}
        </button>
        {output && <>
          <button className="btn-secondary" onClick={copy}>{copied ? '✓ Copié !' : '📋 Copier'}</button>
          <button className="btn-secondary" onClick={download}>💾 Télécharger</button>
        </>}
      </div>
    </div>
  )
}

// ─── CSV → JSON ────────────────────────────────────────────────────────────────
export function CsvToJsonTool() {
  return <ConvertShell
    title="CSV → JSON"
    inputLabel="CSV"
    outputLabel="JSON"
    inputPlaceholder={`nom,age,ville\nAlice,30,Paris\nBob,25,Lyon`}
    onConvert={async (input) => {
      const result = Papa.parse(input.trim(), { header: true, skipEmptyLines: true })
      if (result.errors.length && !result.data.length) throw new Error(result.errors[0].message)
      return { text: JSON.stringify(result.data, null, 2), filename: 'data.json', mime: 'application/json' }
    }}
  />
}

// ─── JSON → CSV ────────────────────────────────────────────────────────────────
export function JsonToCsvTool() {
  return <ConvertShell
    title="JSON → CSV"
    inputLabel="JSON"
    outputLabel="CSV"
    inputPlaceholder={`[\n  {"nom":"Alice","age":30},\n  {"nom":"Bob","age":25}\n]`}
    onConvert={async (input) => {
      const data = JSON.parse(input)
      if (!Array.isArray(data)) throw new Error('Le JSON doit être un tableau []')
      const csv = Papa.unparse(data)
      return { text: csv, filename: 'data.csv', mime: 'text/csv' }
    }}
  />
}

// ─── Excel → CSV ───────────────────────────────────────────────────────────────
export function ExcelToCsvTool() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [sheet, setSheet] = useState(0)
  const [sheets, setSheets] = useState<string[]>([])
  const [wb, setWb] = useState<XLSX.WorkBook | null>(null)
  const [copied, setCopied] = useState(false)

  const loadFile = (f: File) => {
    setFile(f)
    const reader = new FileReader()
    reader.onload = e => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      setWb(workbook)
      setSheets(workbook.SheetNames)
      convertSheet(workbook, 0)
    }
    reader.readAsArrayBuffer(f)
  }

  const convertSheet = (workbook: XLSX.WorkBook, idx: number) => {
    setLoading(true)
    const ws = workbook.Sheets[workbook.SheetNames[idx]]
    const csv = XLSX.utils.sheet_to_csv(ws)
    setResult(csv)
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="drop-zone" onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.xlsx,.xls'; i.onchange = e => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) loadFile(f) }; i.click() }}>
        {file ? <p style={{ color: '#4ade80', margin: 0 }}>✓ {file.name}</p>
          : <div><span style={{ fontSize: 32 }}>📊</span><p style={{ color: '#8888aa', margin: '8px 0 0' }}>Sélectionnez un fichier Excel (.xlsx, .xls)</p></div>}
      </div>
      {sheets.length > 1 && (
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Feuille :</label>
          <select className="input" value={sheet} onChange={e => { const idx = Number(e.target.value); setSheet(idx); if (wb) convertSheet(wb, idx) }}>
            {sheets.map((s, i) => <option key={i} value={i}>{s}</option>)}
          </select>
        </div>
      )}
      {result && (
        <>
          <textarea className="input" readOnly value={result} style={{ minHeight: 200, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary" onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>{copied ? '✓ Copié' : '📋 Copier'}</button>
            <button className="btn-primary" onClick={() => downloadText(result, 'data.csv', 'text/csv')}>💾 Télécharger CSV</button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── CSV → Excel ───────────────────────────────────────────────────────────────
export function CsvToExcelTool() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const convert = () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const result = Papa.parse(input.trim(), { header: true, skipEmptyLines: true })
      const ws = XLSX.utils.json_to_sheet(result.data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Données')
      const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
      downloadBlob(new Blob([buf as any], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'data.xlsx')
    } catch (e) { alert('Erreur : ' + (e as Error).message) }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Données CSV</label>
        <textarea className="input" value={input} onChange={e => setInput(e.target.value)} placeholder={`nom,age,ville\nAlice,30,Paris\nBob,25,Lyon`} style={{ minHeight: 200, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
      </div>
      <button className="btn-primary" onClick={convert} disabled={!input.trim() || loading} style={{ alignSelf: 'flex-start' }}>
        {loading ? <><span className="spinner" />&nbsp;Conversion...</> : '📗 Télécharger Excel (.xlsx)'}
      </button>
    </div>
  )
}

// ─── XML → JSON ────────────────────────────────────────────────────────────────
export function XmlToJsonTool() {
  return <ConvertShell
    title="XML → JSON"
    inputLabel="XML"
    outputLabel="JSON"
    inputPlaceholder={`<?xml version="1.0"?>\n<root>\n  <item id="1">\n    <name>Alice</name>\n  </item>\n</root>`}
    onConvert={async (input) => {
      const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })
      const result = parser.parse(input)
      return { text: JSON.stringify(result, null, 2), filename: 'data.json', mime: 'application/json' }
    }}
  />
}

// ─── Markdown → HTML ───────────────────────────────────────────────────────────
export function MarkdownToHtmlTool() {
  return <ConvertShell
    title="Markdown → HTML"
    inputLabel="Markdown"
    outputLabel="HTML"
    inputPlaceholder={`# Titre\n\n## Section\n\nTexte avec **gras** et *italique*.\n\n- Item 1\n- Item 2`}
    onConvert={async (input) => {
      const html = await marked(input)
      return { text: html as string, filename: 'output.html', mime: 'text/html' }
    }}
  />
}

// ─── HTML → Markdown ───────────────────────────────────────────────────────────
export function HtmlToMarkdownTool() {
  return <ConvertShell
    title="HTML → Markdown"
    inputLabel="HTML"
    outputLabel="Markdown"
    inputPlaceholder={`<h1>Titre</h1>\n<p>Texte avec <strong>gras</strong>.</p>\n<ul><li>Item 1</li></ul>`}
    onConvert={async (input) => {
      const td = new TurndownService()
      const md = td.turndown(input)
      return { text: md, filename: 'output.md', mime: 'text/markdown' }
    }}
  />
}

// ─── TXT → PDF ─────────────────────────────────────────────────────────────────
export function TxtToPdfTool() {
  const [input, setInput] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const convert = () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const doc = new jsPDF()
      if (title) {
        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.text(title, 20, 20)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'normal')
        const lines = doc.splitTextToSize(input, 170)
        doc.text(lines, 20, 35)
      } else {
        doc.setFontSize(12)
        const lines = doc.splitTextToSize(input, 170)
        doc.text(lines, 20, 20)
      }
      const blob = doc.output('blob')
      downloadBlob(blob, 'document.pdf')
    } catch (e) { alert('Erreur lors de la création du PDF.') }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Titre du document (optionnel)</label>
        <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Mon document" />
      </div>
      <div>
        <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Contenu texte</label>
        <textarea className="input" value={input} onChange={e => setInput(e.target.value)} placeholder="Collez votre texte ici..." style={{ minHeight: 240 }} />
      </div>
      <button className="btn-primary" onClick={convert} disabled={!input.trim() || loading} style={{ alignSelf: 'flex-start' }}>
        {loading ? <><span className="spinner" />&nbsp;Génération...</> : '📋 Télécharger PDF'}
      </button>
    </div>
  )
}

// ─── ZIP Extract ───────────────────────────────────────────────────────────────
export function ZipExtractTool() {
  const [file, setFile] = useState<File | null>(null)
  const [entries, setEntries] = useState<{ name: string; size: number; content?: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  const loadZip = async (f: File) => {
    setFile(f); setLoading(true); setEntries([]); setSelected(null)
    try {
      const zip = await JSZip.loadAsync(f)
      const list: { name: string; size: number; content?: string }[] = []
      for (const [name, zipEntry] of Object.entries(zip.files)) {
        if (!zipEntry.dir) {
          const isText = /\.(txt|md|json|csv|xml|html|css|js|ts|py|sh|yaml|yml|toml|log)$/i.test(name)
          const content = isText ? await zipEntry.async('string') : undefined
          list.push({ name, size: 0, content })
        }
      }
      setEntries(list)
    } catch (e) { alert('Impossible de lire le fichier ZIP.') }
    setLoading(false)
  }

  const downloadFile = async (name: string) => {
    if (!file) return
    const zip = await JSZip.loadAsync(file)
    const entry = zip.files[name]
    if (!entry) return
    const blob = await entry.async('blob')
    downloadBlob(blob, name.split('/').pop() || name)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="drop-zone" onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.zip'; i.onchange = e => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) loadZip(f) }; i.click() }}>
        {loading ? <><span className="spinner" style={{ margin: '0 auto' }} /></> : file
          ? <p style={{ color: '#4ade80', margin: 0 }}>✓ {file.name}</p>
          : <div><span style={{ fontSize: 40 }}>📦</span><p style={{ color: '#8888aa', margin: '8px 0 0' }}>Sélectionnez un fichier .zip</p></div>}
      </div>
      {entries.length > 0 && (
        <>
          <p style={{ color: '#8888aa', fontSize: 13, margin: 0 }}>{entries.length} fichier{entries.length > 1 ? 's' : ''} dans l'archive</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 300, overflowY: 'auto' }}>
            {entries.map((e, i) => (
              <div key={i} onClick={() => setSelected(selected === e.name ? null : e.name)} style={{
                display: 'flex', alignItems: 'center', gap: 10, background: selected === e.name ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selected === e.name ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 8, padding: '8px 12px', cursor: 'pointer'
              }}>
                <span>{e.content !== undefined ? '📝' : '📁'}</span>
                <span style={{ flex: 1, color: '#f0f0f5', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</span>
                <button onClick={ev => { ev.stopPropagation(); downloadFile(e.name) }} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '3px 10px', color: '#8888aa', cursor: 'pointer', fontSize: 12 }}>⬇ Télécharger</button>
              </div>
            ))}
          </div>
          {selected && entries.find(e => e.name === selected)?.content && (
            <div>
              <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Aperçu : {selected}</label>
              <pre className="code-block" style={{ maxHeight: 200, overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{entries.find(e => e.name === selected)?.content?.slice(0, 3000)}</pre>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Base64 ────────────────────────────────────────────────────────────────────
export function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const convert = () => {
    setError('')
    try {
      if (mode === 'encode') setOutput(btoa(unescape(encodeURIComponent(input))))
      else setOutput(decodeURIComponent(escape(atob(input.trim()))))
    } catch (e) { setError('Entrée invalide pour le décodage Base64.') }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {(['encode', 'decode'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setOutput(''); setError('') }} style={{
            flex: 1, padding: '9px', borderRadius: 8, border: `1px solid ${mode === m ? '#f97316' : 'rgba(255,255,255,0.08)'}`,
            background: mode === m ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
            color: mode === m ? '#f97316' : '#8888aa', cursor: 'pointer', fontSize: 14, fontWeight: mode === m ? 600 : 400
          }}>{m === 'encode' ? '🔐 Encoder' : '🔓 Décoder'}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>{mode === 'encode' ? 'Texte brut' : 'Base64'}</label>
          <textarea className="input" value={input} onChange={e => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Votre texte...' : 'Votre Base64...'} style={{ minHeight: 160, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
        </div>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>{mode === 'encode' ? 'Base64' : 'Texte décodé'}</label>
          <textarea className="input" readOnly value={output} style={{ minHeight: 160, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
        </div>
      </div>
      {error && <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13 }}>❌ {error}</div>}
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-primary" onClick={convert} disabled={!input.trim()}>🔐 {mode === 'encode' ? 'Encoder' : 'Décoder'}</button>
        {output && <button className="btn-secondary" onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>{copied ? '✓ Copié' : '📋 Copier'}</button>}
      </div>
    </div>
  )
}

// ─── URL Encode ────────────────────────────────────────────────────────────────
export function UrlEncodeTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copied, setCopied] = useState(false)

  const convert = () => {
    try {
      setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input))
    } catch { setOutput('Entrée invalide.') }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {(['encode', 'decode'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setOutput('') }} style={{
            flex: 1, padding: '9px', borderRadius: 8, border: `1px solid ${mode === m ? '#f97316' : 'rgba(255,255,255,0.08)'}`,
            background: mode === m ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
            color: mode === m ? '#f97316' : '#8888aa', cursor: 'pointer', fontSize: 14, fontWeight: mode === m ? 600 : 400
          }}>{m === 'encode' ? '🔒 Encoder URL' : '🔓 Décoder URL'}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>{mode === 'encode' ? 'URL brute' : 'URL encodée'}</label>
          <textarea className="input" value={input} onChange={e => setInput(e.target.value)} placeholder={mode === 'encode' ? 'https://example.com/page?q=bonjour monde' : 'https%3A%2F%2Fexample.com%2F'} style={{ minHeight: 120, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
        </div>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Résultat</label>
          <textarea className="input" readOnly value={output} style={{ minHeight: 120, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-primary" onClick={convert} disabled={!input.trim()}>🌐 {mode === 'encode' ? 'Encoder' : 'Décoder'}</button>
        {output && <button className="btn-secondary" onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>{copied ? '✓ Copié' : '📋 Copier'}</button>}
      </div>
    </div>
  )
}
