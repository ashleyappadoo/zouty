'use client'
import { useState, useCallback } from 'react'
import { downloadBlob, readFileAsArrayBuffer, formatBytes } from '@/lib/utils'

// ─── PDF Merge ────────────────────────────────────────────────────────────────
export function PdfMergeTool() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [drag, setDrag] = useState(false)

  const addFiles = (newFiles: FileList | File[]) => {
    const pdfs = Array.from(newFiles).filter(f => f.type === 'application/pdf')
    setFiles(prev => [...prev, ...pdfs])
  }

  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx))
  const moveUp = (idx: number) => {
    if (idx === 0) return
    setFiles(prev => { const a = [...prev]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; return a })
  }

  const merge = async () => {
    if (files.length < 2) return
    setLoading(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const merged = await PDFDocument.create()
      for (const file of files) {
        const bytes = await readFileAsArrayBuffer(file)
        const doc = await PDFDocument.load(bytes)
        const pages = await merged.copyPages(doc, doc.getPageIndices())
        pages.forEach(p => merged.addPage(p))
      }
      const out = await merged.save()
      downloadBlob(new Blob([out], { type: 'application/pdf' }), 'zouti-fusion.pdf')
    } catch (e) {
      alert('Erreur lors de la fusion. Vérifiez que vos PDFs ne sont pas protégés.')
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        className={`drop-zone ${drag ? 'drag-over' : ''}`}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files) }}
        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.multiple = true; i.accept = '.pdf'; i.onchange = e => addFiles((e.target as HTMLInputElement).files!); i.click() }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>📎</div>
        <p style={{ color: '#8888aa', margin: 0, fontSize: 15 }}>
          Glissez vos PDFs ici ou <span style={{ color: '#f97316' }}>cliquez pour sélectionner</span>
        </p>
        <p style={{ color: '#555570', fontSize: 13, margin: '6px 0 0' }}>Sélectionnez plusieurs fichiers PDF</p>
      </div>

      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ color: '#8888aa', fontSize: 13, margin: '0 0 4px' }}>Ordre de fusion (glissez pour réorganiser) :</p>
          {files.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8, padding: '10px 14px'
            }}>
              <span style={{ color: '#f97316', fontSize: 13, fontFamily: 'Syne, sans-serif', fontWeight: 700, minWidth: 20 }}>{i + 1}</span>
              <span style={{ fontSize: 16 }}>📄</span>
              <span style={{ flex: 1, color: '#f0f0f5', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
              <span style={{ color: '#555570', fontSize: 12 }}>{formatBytes(f.size)}</span>
              <button onClick={() => moveUp(i)} disabled={i === 0} style={{ background: 'none', border: 'none', cursor: i === 0 ? 'not-allowed' : 'pointer', color: '#666680', fontSize: 16, opacity: i === 0 ? 0.3 : 1 }}>↑</button>
              <button onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', fontSize: 16 }}>×</button>
            </div>
          ))}
        </div>
      )}

      <button className="btn-primary" onClick={merge} disabled={files.length < 2 || loading} style={{ alignSelf: 'flex-start' }}>
        {loading ? <><span className="spinner" />&nbsp;Fusion en cours...</> : `🔗 Fusionner ${files.length} PDF${files.length > 1 ? 's' : ''}`}
      </button>
      {files.length < 2 && files.length > 0 && <p style={{ color: '#666680', fontSize: 13, margin: 0 }}>Ajoutez au moins 2 PDFs pour fusionner.</p>}
    </div>
  )
}

// ─── PDF Split ─────────────────────────────────────────────────────────────────
export function PdfSplitTool() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [pages, setPages] = useState('')
  const [loading, setLoading] = useState(false)

  const loadFile = async (f: File) => {
    setFile(f)
    const bytes = await readFileAsArrayBuffer(f)
    const { PDFDocument } = await import('pdf-lib')
    const doc = await PDFDocument.load(bytes)
    setPageCount(doc.getPageCount())
  }

  const split = async () => {
    if (!file) return
    setLoading(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const bytes = await readFileAsArrayBuffer(file)
      const src = await PDFDocument.load(bytes)
      const total = src.getPageCount()

      // Parse page ranges like "1-3,5,7-9"
      const indices: number[] = []
      pages.split(',').forEach(part => {
        part = part.trim()
        if (part.includes('-')) {
          const [a, b] = part.split('-').map(n => parseInt(n.trim()) - 1)
          for (let i = a; i <= Math.min(b, total - 1); i++) indices.push(i)
        } else {
          const n = parseInt(part) - 1
          if (n >= 0 && n < total) indices.push(n)
        }
      })

      if (indices.length === 0) { alert('Aucune page valide sélectionnée'); setLoading(false); return }

      const out = await PDFDocument.create()
      const copied = await out.copyPages(src, indices)
      copied.forEach(p => out.addPage(p))
      const data = await out.save()
      downloadBlob(new Blob([data], { type: 'application/pdf' }), 'zouti-extrait.pdf')
    } catch (e) { alert('Erreur lors de la découpe.') }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="drop-zone" onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.pdf'; i.onchange = e => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) loadFile(f) }; i.click() }}>
        {file ? (
          <div><span style={{ fontSize: 32 }}>📄</span><p style={{ color: '#f0f0f5', margin: '8px 0 4px', fontWeight: 600 }}>{file.name}</p><p style={{ color: '#8888aa', fontSize: 13, margin: 0 }}>{pageCount} pages · {formatBytes(file.size)}</p></div>
        ) : (
          <div><span style={{ fontSize: 40 }}>📎</span><p style={{ color: '#8888aa', margin: '12px 0 0' }}>Cliquez pour sélectionner un PDF</p></div>
        )}
      </div>

      {pageCount > 0 && (
        <div>
          <label style={{ display: 'block', color: '#8888aa', fontSize: 13, marginBottom: 8 }}>
            Pages à extraire ({pageCount} pages au total) :
          </label>
          <input
            className="input"
            placeholder="ex: 1-3, 5, 7-9"
            value={pages}
            onChange={e => setPages(e.target.value)}
          />
          <p style={{ color: '#555570', fontSize: 12, marginTop: 6 }}>Format : 1-3 pour une plage, 5 pour une seule page, séparés par des virgules</p>
        </div>
      )}

      <button className="btn-primary" onClick={split} disabled={!file || !pages.trim() || loading} style={{ alignSelf: 'flex-start' }}>
        {loading ? <><span className="spinner" />&nbsp;Découpe...</> : '✂️ Extraire les pages'}
      </button>
    </div>
  )
}

// ─── PDF Rotate ────────────────────────────────────────────────────────────────
export function PdfRotateTool() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [angle, setAngle] = useState(90)
  const [target, setTarget] = useState<'all' | 'specific'>('all')
  const [pages, setPages] = useState('')
  const [loading, setLoading] = useState(false)

  const loadFile = async (f: File) => {
    setFile(f)
    const bytes = await readFileAsArrayBuffer(f)
    const { PDFDocument } = await import('pdf-lib')
    const doc = await PDFDocument.load(bytes)
    setPageCount(doc.getPageCount())
  }

  const rotate = async () => {
    if (!file) return
    setLoading(true)
    try {
      const { PDFDocument, degrees } = await import('pdf-lib')
      const bytes = await readFileAsArrayBuffer(file)
      const doc = await PDFDocument.load(bytes)
      const total = doc.getPageCount()
      let indices: number[] = []
      if (target === 'all') {
        indices = Array.from({ length: total }, (_, i) => i)
      } else {
        pages.split(',').forEach(part => {
          part = part.trim()
          if (part.includes('-')) {
            const [a, b] = part.split('-').map(n => parseInt(n.trim()) - 1)
            for (let i = a; i <= Math.min(b, total - 1); i++) indices.push(i)
          } else {
            const n = parseInt(part) - 1
            if (n >= 0 && n < total) indices.push(n)
          }
        })
      }
      indices.forEach(i => {
        const page = doc.getPage(i)
        const current = page.getRotation().angle
        page.setRotation(degrees((current + angle) % 360))
      })
      const data = await doc.save()
      downloadBlob(new Blob([data], { type: 'application/pdf' }), 'zouti-rotation.pdf')
    } catch (e) { alert('Erreur lors de la rotation.') }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="drop-zone" onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.pdf'; i.onchange = e => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) loadFile(f) }; i.click() }}>
        {file ? <div><span style={{ fontSize: 32 }}>📄</span><p style={{ color: '#f0f0f5', margin: '8px 0 4px', fontWeight: 600 }}>{file.name}</p><p style={{ color: '#8888aa', fontSize: 13, margin: 0 }}>{pageCount} pages</p></div>
          : <div><span style={{ fontSize: 40 }}>📎</span><p style={{ color: '#8888aa', margin: '12px 0 0' }}>Cliquez pour sélectionner un PDF</p></div>}
      </div>

      {file && <>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 10 }}>Angle de rotation :</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[90, 180, 270].map(a => (
              <button key={a} onClick={() => setAngle(a)} style={{
                flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${angle === a ? '#f97316' : 'rgba(255,255,255,0.08)'}`,
                background: angle === a ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
                color: angle === a ? '#f97316' : '#8888aa', cursor: 'pointer', fontWeight: 600, fontSize: 15
              }}>
                {a === 90 ? '↻' : a === 180 ? '↕' : '↺'} {a}°
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 10 }}>Pages concernées :</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['all', 'specific'] as const).map(t => (
              <button key={t} onClick={() => setTarget(t)} style={{
                flex: 1, padding: '9px', borderRadius: 8, border: `1px solid ${target === t ? '#f97316' : 'rgba(255,255,255,0.08)'}`,
                background: target === t ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
                color: target === t ? '#f97316' : '#8888aa', cursor: 'pointer', fontSize: 14
              }}>
                {t === 'all' ? 'Toutes les pages' : 'Pages spécifiques'}
              </button>
            ))}
          </div>
          {target === 'specific' && (
            <input className="input" style={{ marginTop: 10 }} placeholder="ex: 1-3, 5, 7" value={pages} onChange={e => setPages(e.target.value)} />
          )}
        </div>
      </>}

      <button className="btn-primary" onClick={rotate} disabled={!file || loading} style={{ alignSelf: 'flex-start' }}>
        {loading ? <><span className="spinner" />&nbsp;Rotation...</> : '🔄 Appliquer la rotation'}
      </button>
    </div>
  )
}
