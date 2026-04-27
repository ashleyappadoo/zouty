import { Lang } from '@/lib/i18n'

export async function callAI(toolId: string, prompt: string, system?: string, lang: Lang = 'fr'): Promise<string> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ toolId, prompt, system, lang }),
  })
  const data = await res.json()
  if (res.status === 429) {
    const mins = Math.ceil((data.retryAfter || 3600) / 60)
    throw new Error(lang === 'en'
      ? `Rate limit reached. Try again in ${mins} minutes.`
      : `Limite atteinte. Réessayez dans ${mins} minutes.`)
  }
  if (data.error) throw new Error(data.error)
  return data.result
}

export function downloadText(content: string, filename: string, type = 'text/plain') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target?.result as string)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target?.result as ArrayBuffer)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target?.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export function fleschScore(text: string): { score: number; level: string; color: string } {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = text.trim().split(/\s+/).filter(w => w.length > 0)
  const syllables = words.reduce((acc, word) => acc + countSyllables(word), 0)
  if (sentences.length === 0 || words.length === 0) return { score: 0, level: 'N/A', color: '#666680' }
  const asl = words.length / sentences.length
  const asw = syllables / words.length
  const score = Math.max(0, Math.min(100, 206.835 - 1.015 * asl - 84.6 * asw))
  let level = '', color = ''
  if (score >= 70) { level = 'Très facile'; color = '#4ade80' }
  else if (score >= 60) { level = 'Facile'; color = '#86efac' }
  else if (score >= 50) { level = 'Moyen'; color = '#fbbf24' }
  else if (score >= 30) { level = 'Difficile'; color = '#f97316' }
  else { level = 'Très difficile'; color = '#f87171' }
  return { score: Math.round(score), level, color }
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-zàâéèêëîïôùûüæœ]/g, '')
  if (word.length <= 2) return 1
  const vowels = word.match(/[aeiouyàâéèêëîïôùûüæœ]/g)
  return Math.max(1, vowels ? vowels.length : 1)
}
