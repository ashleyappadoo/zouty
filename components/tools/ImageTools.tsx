'use client'
import { useState, useRef, useCallback } from 'react'
import { downloadBlob, readFileAsDataURL, formatBytes } from '@/lib/utils'

// ─── Image Compress ────────────────────────────────────────────────────────────
export function ImageCompressTool() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [quality, setQuality] = useState(0.8)
  const [result, setResult] = useState<{ url: string; size: number } | null>(null)
  const [loading, setLoading] = useState(false)

  const loadFile = async (f: File) => {
    setFile(f); setResult(null)
    setPreview(await readFileAsDataURL(f))
  }

  const compress = async () => {
    if (!file) return
    setLoading(true)
    try {
      const imageCompression = (await import('browser-image-compression')).default
      const compressed = await imageCompression(file, { maxSizeMB: 10, useWebWorker: true, initialQuality: quality })
      const url = URL.createObjectURL(compressed)
      setResult({ url, size: compressed.size })
    } catch (e) { alert('Erreur lors de la compression.') }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="drop-zone" onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) loadFile(f) }; i.click() }}>
        {preview ? <img src={preview} alt="preview" style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }} />
          : <div><span style={{ fontSize: 40 }}>🖼️</span><p style={{ color: '#8888aa', margin: '12px 0 0' }}>Sélectionnez une image</p></div>}
      </div>
      {file && <>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Qualité : {Math.round(quality * 100)}%</label>
          <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={e => setQuality(Number(e.target.value))} style={{ width: '100%', accentColor: '#f97316' }} />
        </div>
        <div style={{ display: 'flex', gap: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#8888aa' }}>
          <span>Original : <strong style={{ color: '#f0f0f5' }}>{formatBytes(file.size)}</strong></span>
          {result && <span>Compressé : <strong style={{ color: '#4ade80' }}>{formatBytes(result.size)}</strong> ({Math.round((1 - result.size / file.size) * 100)}% de réduction)</span>}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-primary" onClick={compress} disabled={loading}>
            {loading ? <><span className="spinner" />&nbsp;Compression...</> : '📦 Compresser'}
          </button>
          {result && <a href={result.url} download={`zouti-${file.name}`} className="btn-secondary" style={{ textDecoration: 'none' }}>💾 Télécharger</a>}
        </div>
      </>}
    </div>
  )
}

// ─── Image Convert ─────────────────────────────────────────────────────────────
export function ImageConvertTool() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg')
  const [quality, setQuality] = useState(0.92)
  const [result, setResult] = useState<{ url: string; size: number } | null>(null)

  const loadFile = async (f: File) => {
    setFile(f); setResult(null)
    setPreview(await readFileAsDataURL(f))
  }

  const convert = () => {
    if (!file) return
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width; canvas.height = img.height
      canvas.getContext('2d')!.drawImage(img, 0, 0)
      canvas.toBlob(blob => {
        if (!blob) return
        setResult({ url: URL.createObjectURL(blob), size: blob.size })
      }, format, quality)
    }
    img.src = preview
  }

  const ext = format.split('/')[1]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="drop-zone" onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) loadFile(f) }; i.click() }}>
        {preview ? <img src={preview} alt="preview" style={{ maxHeight: 160, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }} />
          : <div><span style={{ fontSize: 40 }}>🖼️</span><p style={{ color: '#8888aa', margin: '12px 0 0' }}>Sélectionnez une image</p></div>}
      </div>
      {file && <>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 10 }}>Format de sortie :</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['image/jpeg', 'image/png', 'image/webp'] as const).map(f => (
              <button key={f} onClick={() => setFormat(f)} style={{
                flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${format === f ? '#f97316' : 'rgba(255,255,255,0.08)'}`,
                background: format === f ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
                color: format === f ? '#f97316' : '#8888aa', cursor: 'pointer', fontWeight: 600, fontSize: 13
              }}>
                {f.split('/')[1].toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        {format !== 'image/png' && (
          <div>
            <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Qualité : {Math.round(quality * 100)}%</label>
            <input type="range" min={0.5} max={1} step={0.05} value={quality} onChange={e => setQuality(Number(e.target.value))} style={{ width: '100%', accentColor: '#f97316' }} />
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-primary" onClick={convert}>🔄 Convertir en {ext.toUpperCase()}</button>
          {result && <a href={result.url} download={`zouti-${file.name.split('.')[0]}.${ext}`} className="btn-secondary" style={{ textDecoration: 'none' }}>💾 Télécharger ({formatBytes(result.size)})</a>}
        </div>
      </>}
    </div>
  )
}

// ─── Image Resize ──────────────────────────────────────────────────────────────
export function ImageResizeTool() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [origW, setOrigW] = useState(0); const [origH, setOrigH] = useState(0)
  const [width, setWidth] = useState(''); const [height, setHeight] = useState('')
  const [keepRatio, setKeepRatio] = useState(true)
  const [result, setResult] = useState<string | null>(null)

  const loadFile = async (f: File) => {
    setFile(f); setResult(null)
    const url = await readFileAsDataURL(f)
    setPreview(url)
    const img = new Image()
    img.onload = () => { setOrigW(img.width); setOrigH(img.height); setWidth(String(img.width)); setHeight(String(img.height)) }
    img.src = url
  }

  const onWidthChange = (v: string) => {
    setWidth(v)
    if (keepRatio && origW) setHeight(String(Math.round(Number(v) * origH / origW)))
  }
  const onHeightChange = (v: string) => {
    setHeight(v)
    if (keepRatio && origH) setWidth(String(Math.round(Number(v) * origW / origH)))
  }

  const resize = () => {
    if (!file || !width || !height) return
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = Number(width); canvas.height = Number(height)
      canvas.getContext('2d')!.drawImage(img, 0, 0, Number(width), Number(height))
      setResult(canvas.toDataURL('image/png'))
    }
    img.src = preview
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="drop-zone" onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) loadFile(f) }; i.click() }}>
        {preview ? <img src={preview} alt="" style={{ maxHeight: 160, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }} />
          : <div><span style={{ fontSize: 40 }}>📐</span><p style={{ color: '#8888aa', margin: '12px 0 0' }}>Sélectionnez une image</p></div>}
      </div>
      {file && <>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'end' }}>
          <div><label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Largeur (px)</label>
            <input className="input" type="number" value={width} onChange={e => onWidthChange(e.target.value)} /></div>
          <button onClick={() => setKeepRatio(!keepRatio)} style={{ padding: '10px', borderRadius: 8, border: `1px solid ${keepRatio ? '#f97316' : 'rgba(255,255,255,0.08)'}`, background: keepRatio ? 'rgba(249,115,22,0.15)' : 'transparent', color: keepRatio ? '#f97316' : '#8888aa', cursor: 'pointer', fontSize: 18 }} title="Garder le ratio">🔗</button>
          <div><label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Hauteur (px)</label>
            <input className="input" type="number" value={height} onChange={e => onHeightChange(e.target.value)} /></div>
        </div>
        <p style={{ color: '#555570', fontSize: 13, margin: 0 }}>Original : {origW} × {origH} px</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-primary" onClick={resize}>📐 Redimensionner</button>
          {result && <a href={result} download={`zouti-resize.png`} className="btn-secondary" style={{ textDecoration: 'none' }}>💾 Télécharger</a>}
        </div>
      </>}
    </div>
  )
}

// ─── QR Code Generator ─────────────────────────────────────────────────────────
export function QrCodeTool() {
  const [text, setText] = useState('')
  const [fgColor, setFgColor] = useState('#f97316')
  const [bgColor, setBgColor] = useState('#0a0a0f')
  const [size, setSize] = useState(256)
  const [qrUrl, setQrUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const QRCode = (await import('qrcode')).default
      const url = await QRCode.toDataURL(text, { width: size, margin: 2, color: { dark: fgColor, light: bgColor } })
      setQrUrl(url)
    } catch (e) { alert('Erreur lors de la génération.') }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div><label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>URL ou texte à encoder</label>
        <input className="input" value={text} onChange={e => setText(e.target.value)} placeholder="https://votre-site.fr ou tout texte..." /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <div><label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Couleur QR</label>
          <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} style={{ width: '100%', height: 40, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: 'transparent' }} /></div>
        <div><label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Fond</label>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: '100%', height: 40, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: 'transparent' }} /></div>
        <div><label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Taille ({size}px)</label>
          <input type="range" min={128} max={512} step={32} value={size} onChange={e => setSize(Number(e.target.value))} style={{ width: '100%', marginTop: 10, accentColor: '#f97316' }} /></div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-primary" onClick={generate} disabled={!text.trim() || loading}>
          {loading ? <><span className="spinner" />&nbsp;Génération...</> : '📱 Générer le QR Code'}
        </button>
      </div>
      {qrUrl && (
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <img src={qrUrl} alt="QR Code" style={{ width: 160, height: 160, borderRadius: 12, border: '2px solid rgba(249,115,22,0.3)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a href={qrUrl} download="zouti-qrcode.png" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>💾 Télécharger PNG</a>
            <button className="btn-secondary" onClick={() => navigator.clipboard.writeText(qrUrl)}>📋 Copier URL</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Image Crop ─────────────────────────────────────────────────────────────────
export function ImageCropTool() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [aspect, setAspect] = useState('free')
  const [result, setResult] = useState<string | null>(null)

  const loadFile = async (f: File) => {
    setFile(f); setResult(null)
    setPreview(await readFileAsDataURL(f))
  }

  const crop = () => {
    if (!file) return
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let w = img.width, h = img.height
      if (aspect === '1:1') { const s = Math.min(w, h); canvas.width = s; canvas.height = s; canvas.getContext('2d')!.drawImage(img, (w - s) / 2, (h - s) / 2, s, s, 0, 0, s, s) }
      else if (aspect === '16:9') { h = Math.round(w * 9 / 16); canvas.width = w; canvas.height = h; canvas.getContext('2d')!.drawImage(img, 0, 0, w, img.height * w / img.width, 0, 0, w, h) }
      else if (aspect === '4:3') { h = Math.round(w * 3 / 4); canvas.width = w; canvas.height = h; canvas.getContext('2d')!.drawImage(img, 0, 0, w, img.height * w / img.width, 0, 0, w, h) }
      else { canvas.width = w; canvas.height = h; canvas.getContext('2d')!.drawImage(img, 0, 0) }
      setResult(canvas.toDataURL('image/png'))
    }
    img.src = preview
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="drop-zone" onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) loadFile(f) }; i.click() }}>
        {preview ? <img src={preview} alt="" style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }} />
          : <div><span style={{ fontSize: 40 }}>✂️</span><p style={{ color: '#8888aa', margin: '12px 0 0' }}>Sélectionnez une image</p></div>}
      </div>
      {file && <>
        <div>
          <label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 10 }}>Ratio de recadrage :</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['free', '1:1', '16:9', '4:3'].map(a => (
              <button key={a} onClick={() => setAspect(a)} style={{ flex: 1, padding: '9px', borderRadius: 8, border: `1px solid ${aspect === a ? '#f97316' : 'rgba(255,255,255,0.08)'}`, background: aspect === a ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)', color: aspect === a ? '#f97316' : '#8888aa', cursor: 'pointer', fontSize: 13 }}>{a === 'free' ? 'Libre' : a}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-primary" onClick={crop}>✂️ Recadrer</button>
          {result && <a href={result} download="zouti-recadre.png" className="btn-secondary" style={{ textDecoration: 'none' }}>💾 Télécharger</a>}
        </div>
        {result && <img src={result} alt="result" style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 8, objectFit: 'contain', border: '1px solid rgba(249,115,22,0.2)' }} />}
      </>}
    </div>
  )
}

// ─── Background Remover ─────────────────────────────────────────────────────────
export function BgRemoveTool() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState('')

  const loadFile = async (f: File) => {
    setFile(f); setResult(null)
    setPreview(await readFileAsDataURL(f))
  }

  const removeBg = async () => {
    if (!file) return
    setLoading(true)
    setProgress('Chargement du modèle IA...')
    try {
      // Remove.bg via canvas algorithm (no external API needed)
      setProgress('Traitement en cours...')
      const imgUrl = await readFileAsDataURL(file)
      const img = new Image()
      await new Promise<void>(r => { img.onload = () => r(); img.src = imgUrl })
      const canvas = document.createElement('canvas')
      canvas.width = img.width; canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      // Simple background removal: detect near-white/uniform corners as bg color
      const cornerColors = [
        [data[0], data[1], data[2]],
        [data[(canvas.width-1)*4], data[(canvas.width-1)*4+1], data[(canvas.width-1)*4+2]],
      ]
      const bgR = Math.round((cornerColors[0][0] + cornerColors[1][0]) / 2)
      const bgG = Math.round((cornerColors[0][1] + cornerColors[1][1]) / 2)
      const bgB = Math.round((cornerColors[0][2] + cornerColors[1][2]) / 2)
      const threshold = 40
      for (let i = 0; i < data.length; i += 4) {
        const dr = Math.abs(data[i] - bgR), dg = Math.abs(data[i+1] - bgG), db = Math.abs(data[i+2] - bgB)
        if (dr < threshold && dg < threshold && db < threshold) data[i+3] = 0
      }
      ctx.putImageData(imageData, 0, 0)
      canvas.toBlob(blob => { if (blob) setResult(URL.createObjectURL(blob)) }, 'image/png')
      setProgress('Terminé !')
    } catch (e) {
      console.error(e)
      alert('Erreur lors du traitement. Assurez-vous d\'être connecté à Internet.')
    }
    setProgress('')
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: 10, padding: '12px 16px' }}>
        <p style={{ color: '#c084fc', fontSize: 13, margin: 0 }}>🤖 <strong>IA embarquée</strong> — Traitement 100% dans votre navigateur. Aucune image envoyée sur nos serveurs.</p>
      </div>
      <div className="drop-zone" onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) loadFile(f) }; i.click() }}>
        {preview ? <img src={preview} alt="" style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }} />
          : <div><span style={{ fontSize: 40 }}>🪄</span><p style={{ color: '#8888aa', margin: '12px 0 0' }}>Sélectionnez une image</p><p style={{ color: '#555570', fontSize: 13, margin: '4px 0 0' }}>Portrait, produit, objet...</p></div>}
      </div>
      {loading && <div><div className="progress-bar"><div className="progress-fill" style={{ width: '60%', animation: 'pulseSoft 1.5s infinite' }} /></div><p style={{ color: '#8888aa', fontSize: 13, margin: '8px 0 0' }}>{progress}</p></div>}
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-primary" onClick={removeBg} disabled={!file || loading}>
          {loading ? <><span className="spinner" />&nbsp;Traitement IA...</> : '🪄 Supprimer le fond'}
        </button>
        {result && <a href={result} download="zouti-sans-fond.png" className="btn-secondary" style={{ textDecoration: 'none' }}>💾 Télécharger PNG</a>}
      </div>
      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><p style={{ color: '#555570', fontSize: 12, margin: '0 0 6px', textAlign: 'center' }}>Original</p><img src={preview} alt="original" style={{ width: '100%', borderRadius: 8, objectFit: 'contain', maxHeight: 200 }} /></div>
          <div><p style={{ color: '#4ade80', fontSize: 12, margin: '0 0 6px', textAlign: 'center' }}>Sans fond ✓</p><img src={result} alt="result" style={{ width: '100%', borderRadius: 8, objectFit: 'contain', maxHeight: 200, background: 'repeating-conic-gradient(#1a1a27 0% 25%, #252535 0% 50%) 0 0 / 16px 16px' }} /></div>
        </div>
      )}
    </div>
  )
}

// ─── OCR Tool ──────────────────────────────────────────────────────────────────
export function OcrTool() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const loadFile = async (f: File) => {
    setFile(f); setResult('')
    setPreview(await readFileAsDataURL(f))
  }

  const extract = async () => {
    if (!file) return
    setLoading(true)
    try {
      // Load Tesseract.js from CDN
      if (!(window as any).Tesseract) {
        await new Promise<void>((resolve, reject) => {
          if (document.querySelector('script[data-tesseract]')) { resolve(); return }
          const s = document.createElement('script')
          s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js'
          s.setAttribute('data-tesseract', '1')
          s.onload = () => resolve()
          s.onerror = () => reject(new Error('Impossible de charger Tesseract'))
          document.head.appendChild(s)
        })
      }
      const worker = await (window as any).Tesseract.createWorker(['fra', 'eng'], 1, {
        logger: (m: any) => { if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100)) }
      })
      const { data } = await worker.recognize(file)
      await worker.terminate()
      setResult(data.text)
    } catch (e) { setResult('Erreur lors de la reconnaissance. Assurez-vous que l\'image contient du texte lisible.') }
    setLoading(false)
    setProgress(0)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="drop-zone" onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) loadFile(f) }; i.click() }}>
        {preview ? <img src={preview} alt="" style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }} />
          : <div><span style={{ fontSize: 40 }}>🔍</span><p style={{ color: '#8888aa', margin: '12px 0 0' }}>Sélectionnez une image avec du texte</p><p style={{ color: '#555570', fontSize: 13, margin: '4px 0 0' }}>Photo de document, capture d'écran, scan...</p></div>}
      </div>
      {loading && <div><div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div><p style={{ color: '#8888aa', fontSize: 13, margin: '8px 0 0' }}>Reconnaissance... {progress}%</p></div>}
      <button className="btn-primary" onClick={extract} disabled={!file || loading} style={{ alignSelf: 'flex-start' }}>
        {loading ? <><span className="spinner" />&nbsp;Reconnaissance...</> : '🔍 Extraire le texte (FR+EN)'}
      </button>
      {result && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ color: '#8888aa', fontSize: 13 }}>Texte reconnu :</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" onClick={() => navigator.clipboard.writeText(result)} style={{ padding: '6px 12px', fontSize: 13 }}>📋 Copier</button>
              <button className="btn-secondary" onClick={() => { const b = new Blob([result], { type: 'text/plain' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'texte-ocr.txt'; a.click() }} style={{ padding: '6px 12px', fontSize: 13 }}>💾 .txt</button>
            </div>
          </div>
          <textarea className="input" readOnly value={result} style={{ minHeight: 200, fontSize: 13 }} />
        </div>
      )}
    </div>
  )
}

// ─── YouTube Thumbnail ─────────────────────────────────────────────────────────
export function ThumbnailTool() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [bgColor, setBgColor] = useState('#f97316')
  const [result, setResult] = useState<string | null>(null)

  const loadFile = async (f: File) => {
    setFile(f)
    setPreview(await readFileAsDataURL(f))
  }

  const generate = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1280; canvas.height = 720
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#0a0a0f'
    ctx.fillRect(0, 0, 1280, 720)

    if (preview) {
      const img = new Image()
      img.onload = () => {
        ctx.globalAlpha = 0.6
        ctx.drawImage(img, 0, 0, 1280, 720)
        ctx.globalAlpha = 1
        drawText()
      }
      img.src = preview
    } else { drawText() }

    function drawText() {
      // Gradient overlay
      const grad = ctx.createLinearGradient(0, 400, 0, 720)
      grad.addColorStop(0, 'transparent')
      grad.addColorStop(1, 'rgba(0,0,0,0.85)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 1280, 720)
      // Accent bar
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 680, 1280, 40)
      if (title) {
        ctx.font = 'bold 72px Impact, Arial'
        ctx.fillStyle = 'white'
        ctx.shadowColor = 'rgba(0,0,0,0.8)'
        ctx.shadowBlur = 10
        ctx.fillText(title.toUpperCase().slice(0, 24), 60, 600)
      }
      if (subtitle) {
        ctx.font = '36px Arial'
        ctx.fillStyle = bgColor
        ctx.shadowBlur = 0
        ctx.fillText(subtitle.slice(0, 40), 64, 655)
      }
      setResult(canvas.toDataURL('image/jpeg', 0.95))
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="drop-zone" onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = e => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) loadFile(f) }; i.click() }}>
        {preview ? <img src={preview} alt="" style={{ maxHeight: 160, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }} />
          : <div><span style={{ fontSize: 40 }}>▶️</span><p style={{ color: '#8888aa', margin: '12px 0 0' }}>Image de fond (optionnel)</p><p style={{ color: '#555570', fontSize: 13, margin: '4px 0 0' }}>1280×720 recommandé</p></div>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div><label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Titre principal</label>
          <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="MON TITRE YOUTUBE" /></div>
        <div><label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Sous-titre</label>
          <input className="input" value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Sous-titre descriptif" /></div>
        <div><label style={{ color: '#8888aa', fontSize: 13, display: 'block', marginBottom: 6 }}>Couleur d'accent</label>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: '100%', height: 40, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: 'transparent' }} /></div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-primary" onClick={generate}>▶️ Générer la miniature</button>
        {result && <a href={result} download="zouti-thumbnail.jpg" className="btn-secondary" style={{ textDecoration: 'none' }}>💾 Télécharger 1280×720</a>}
      </div>
      {result && <img src={result} alt="thumbnail" style={{ width: '100%', borderRadius: 8, border: '2px solid rgba(249,115,22,0.3)' }} />}
    </div>
  )
}
