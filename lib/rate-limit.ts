/**
 * ZOUTI — Rate Limiter
 * In-memory rate limiting by IP.
 * Max 20 AI calls / hour / IP — sliding window algorithm.
 */

interface RateLimitEntry {
  timestamps: number[]
}

const store = new Map<string, RateLimitEntry>()

const WINDOW_MS = 60 * 60 * 1000
const MAX_REQUESTS = 20
const MAX_PROMPT_CHARS = 12000

export function getRateLimitHeaders(remaining: number, resetMs: number) {
  return {
    'X-RateLimit-Limit': String(MAX_REQUESTS),
    'X-RateLimit-Remaining': String(Math.max(0, remaining)),
    'X-RateLimit-Reset': String(Math.ceil(resetMs / 1000)),
    'X-RateLimit-Window': '3600',
  }
}

export function checkRateLimit(ip: string): {
  allowed: boolean
  remaining: number
  resetMs: number
  retryAfter?: number
} {
  const now = Date.now()
  const windowStart = now - WINDOW_MS

  let entry = store.get(ip)
  if (!entry) {
    entry = { timestamps: [] }
    store.set(ip, entry)
  }

  entry.timestamps = entry.timestamps.filter(ts => ts > windowStart)

  const count = entry.timestamps.length
  const remaining = MAX_REQUESTS - count
  const oldestTs = entry.timestamps[0] ?? now
  const resetMs = oldestTs + WINDOW_MS

  if (count >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((resetMs - now) / 1000)
    return { allowed: false, remaining: 0, resetMs, retryAfter }
  }

  entry.timestamps.push(now)

  // Cleanup old IPs — forEach compatible with all TS targets
  if (store.size > 10000) {
    store.forEach((val, key) => {
      if (val.timestamps.every(ts => ts < windowStart)) {
        store.delete(key)
      }
    })
  }

  return { allowed: true, remaining: remaining - 1, resetMs }
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return 'unknown'
}

export function validatePrompt(prompt: string): { valid: boolean; error?: string } {
  if (!prompt || typeof prompt !== 'string') {
    return { valid: false, error: 'Prompt manquant ou invalide' }
  }
  if (prompt.trim().length === 0) {
    return { valid: false, error: 'Prompt vide' }
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    return { valid: false, error: `Texte trop long. Maximum ${MAX_PROMPT_CHARS} caractères.` }
  }
  return { valid: true }
}

export { MAX_REQUESTS, WINDOW_MS, MAX_PROMPT_CHARS }
