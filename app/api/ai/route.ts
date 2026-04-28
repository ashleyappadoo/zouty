import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp, validatePrompt, getRateLimitHeaders } from '@/lib/rate-limit'

export const maxDuration = 60 // Vercel Pro allows up to 300s, free tier 60s

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rateLimit = checkRateLimit(ip)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Réessayez dans quelques minutes.', retryAfter: rateLimit.retryAfter },
        { status: 429, headers: { ...getRateLimitHeaders(0, rateLimit.resetMs), 'Retry-After': String(rateLimit.retryAfter) } }
      )
    }

    let body: { toolId?: string; prompt?: string; system?: string; lang?: string }
    try { body = await req.json() } catch { return NextResponse.json({ error: 'JSON invalide' }, { status: 400 }) }

    const { toolId, prompt, system, lang = 'fr' } = body
    if (!toolId) return NextResponse.json({ error: 'toolId manquant' }, { status: 400 })

    const validation = validatePrompt(prompt ?? '')
    if (!validation.valid) return NextResponse.json({ error: validation.error }, { status: 400 })

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Service IA non configuré' }, { status: 500 })

    const langInstruction = lang === 'en'
      ? 'Always respond in English. Be precise, concise and professional.'
      : 'Réponds toujours en français. Sois précis, concis et professionnel.'

    const finalSystem = system ? `${system}\n\n${langInstruction}` : langInstruction

    // AbortController pour timeout explicite 55s (sous la limite Vercel de 60s)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 55000)

    let response: Response
    try {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-20240307',
          max_tokens: 1024, // réduit pour réponses plus rapides
          system: finalSystem,
          messages: [{ role: 'user', content: (prompt ?? '').slice(0, 12000) }],
        }),
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeoutId)
    }

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic error:', response.status, err)
      if (response.status === 529 || response.status === 503) {
        return NextResponse.json({ error: 'Service IA surchargé. Réessayez.' }, { status: 503 })
      }
      return NextResponse.json({ error: 'Erreur du service IA' }, { status: 500 })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text ?? ''
    return NextResponse.json(
      { result: text, remaining: rateLimit.remaining },
      { headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetMs) }
    )

  } catch (e: any) {
    if (e?.name === 'AbortError') {
      return NextResponse.json({ error: 'Délai dépassé. Réessayez avec un texte plus court.' }, { status: 504 })
    }
    console.error('Error in /api/ai:', e)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
