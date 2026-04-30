'use client'
import { useState, useRef, useEffect } from 'react'
import { executeTool, resolveParams } from '@/lib/agent-executor'

interface Step {
  toolId: string
  label: string
  description: string
  params: Record<string, string>
}

interface Plan {
  understood: string
  needsFile: boolean
  fileDescription?: string
  steps: Step[]
  finalMessage: string
}

interface Message {
  role: 'user' | 'agent'
  content: string
  plan?: Plan
  results?: StepResult[]
  status?: 'thinking' | 'planning' | 'executing' | 'done' | 'error'
}

interface StepResult {
  step: Step
  result: { success: boolean; output?: string; outputType?: string; error?: string }
  status: 'pending' | 'running' | 'done' | 'error'
}

const EXAMPLE_PROMPTS = [
  "Résume ce PDF et extrais les points clés",
  "Rédige un email professionnel de relance client",
  "Génère 10 données JSON fictives d'utilisateurs e-commerce",
  "Améliore mon texte et corrige les fautes",
  "Crée une requête SQL pour récupérer les commandes du mois",
  "Génère un post LinkedIn sur l'automatisation en entreprise",
]

export default function AgentChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text?: string) => {
    const message = text ?? input.trim()
    if (!message || loading) return
    setInput('')
    setLoading(true)

    // Add user message
    const userMsg: Message = { role: 'user', content: message }
    const thinkingMsg: Message = { role: 'agent', content: '', status: 'thinking' }
    setMessages(prev => [...prev, userMsg, thinkingMsg])

    try {
      // Step 1: Get plan from agent
      setMessages(prev => [...prev.slice(0, -1), { ...thinkingMsg, status: 'planning' }])

      const planRes = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, lang: 'fr' }),
      })
      const planData = await planRes.json()

      if (!planRes.ok || !planData.plan) {
        throw new Error(planData.error ?? 'Impossible de créer un plan')
      }

      const plan: Plan = planData.plan

      // No steps — just show response
      if (!plan.steps || plan.steps.length === 0) {
        setMessages(prev => [...prev.slice(0, -1), {
          role: 'agent',
          content: plan.finalMessage ?? 'Je ne peux pas traiter cette demande avec mes outils actuels.',
          status: 'done'
        }])
        setLoading(false)
        return
      }

      // Step 2: Execute steps
      const stepResults: StepResult[] = plan.steps.map(step => ({
        step, result: { success: false }, status: 'pending'
      }))

      setMessages(prev => [...prev.slice(0, -1), {
        role: 'agent',
        content: plan.understood,
        plan,
        results: stepResults,
        status: 'executing'
      }])

      const completedOutputs: string[] = []

      for (let i = 0; i < plan.steps.length; i++) {
        const step = plan.steps[i]

        // Mark as running
        setMessages(prev => {
          const last = { ...prev[prev.length - 1] }
          if (last.results) {
            last.results = [...last.results]
            last.results[i] = { ...last.results[i], status: 'running' }
          }
          return [...prev.slice(0, -1), last]
        })

        const resolvedParams = resolveParams(step.params, message, completedOutputs, file ?? undefined)
        const result = await executeTool(step.toolId, resolvedParams, message, file ?? undefined)

        if (result.output) completedOutputs.push(result.output)

        // Mark as done/error
        setMessages(prev => {
          const last = { ...prev[prev.length - 1] }
          if (last.results) {
            last.results = [...last.results]
            last.results[i] = { ...last.results[i], result, status: result.success ? 'done' : 'error' }
          }
          return [...prev.slice(0, -1), last]
        })

        if (!result.success) break
      }

      // Final message
      setMessages(prev => {
        const last = { ...prev[prev.length - 1] }
        return [...prev.slice(0, -1), { ...last, status: 'done' }]
      })

    } catch (e) {
      setMessages(prev => [...prev.slice(0, -1), {
        role: 'agent',
        content: 'Une erreur est survenue : ' + (e as Error).message,
        status: 'error'
      }])
    }

    setLoading(false)
  }

  const copyText = (text: string) => navigator.clipboard.writeText(text)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 20, minHeight: 0 }}>

        {/* Welcome */}
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: '#f0f0f5', margin: '0 0 8px' }}>
              Que voulez-vous faire ?
            </h3>
            <p style={{ color: '#8888aa', fontSize: 15, margin: '0 0 28px' }}>
              Décrivez votre tâche en français — l'agent choisit et orchestre les bons outils automatiquement.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {EXAMPLE_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 20, padding: '8px 14px',
                    color: '#8888aa', fontSize: 13, cursor: 'pointer',
                    transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif'
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,115,22,0.4)'; (e.currentTarget as HTMLElement).style.color = '#f97316' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = '#8888aa' }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: 'flex',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            gap: 12, alignItems: 'flex-start'
          }}>
            {/* Avatar */}
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #f97316, #ea580c)'
                : 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3))',
              border: `1px solid ${msg.role === 'user' ? 'rgba(249,115,22,0.3)' : 'rgba(99,102,241,0.3)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16
            }}>
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>

            {/* Bubble */}
            <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: 10 }}>

              {/* Thinking / Planning states */}
              {msg.status === 'thinking' && (
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    <span style={{ color: '#8888aa', fontSize: 14 }}>Analyse en cours...</span>
                  </div>
                </div>
              )}

              {msg.status === 'planning' && (
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: '#a5b4fc' }} />
                    <span style={{ color: '#a5b4fc', fontSize: 14 }}>Construction du plan d'action...</span>
                  </div>
                </div>
              )}

              {/* User message */}
              {msg.role === 'user' && (
                <div style={{
                  background: 'rgba(249,115,22,0.12)',
                  border: '1px solid rgba(249,115,22,0.2)',
                  borderRadius: 12, padding: '12px 16px',
                  color: '#f0f0f5', fontSize: 14, lineHeight: 1.6
                }}>
                  {msg.content}
                  {file && idx === messages.findIndex(m => m.role === 'user') && (
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, color: '#f97316', fontSize: 12 }}>
                      📎 {file.name}
                    </div>
                  )}
                </div>
              )}

              {/* Agent plan + steps */}
              {msg.role === 'agent' && msg.plan && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

                  {/* Plan header */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 16 }}>🎯</span>
                      <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: '#f0f0f5' }}>Plan d'action</span>
                    </div>
                    <p style={{ color: '#8888aa', fontSize: 13, margin: 0 }}>{msg.plan.understood}</p>
                  </div>

                  {/* Steps */}
                  {msg.results?.map((sr, si) => (
                    <div key={si} style={{
                      background: sr.status === 'done' ? 'rgba(74,222,128,0.06)'
                        : sr.status === 'error' ? 'rgba(248,113,113,0.06)'
                        : sr.status === 'running' ? 'rgba(249,115,22,0.06)'
                        : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${sr.status === 'done' ? 'rgba(74,222,128,0.2)'
                        : sr.status === 'error' ? 'rgba(248,113,113,0.2)'
                        : sr.status === 'running' ? 'rgba(249,115,22,0.3)'
                        : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: 10, padding: '12px 16px'
                    }}>
                      {/* Step header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: sr.result.output ? 10 : 0 }}>
                        <span style={{ fontSize: 14 }}>
                          {sr.status === 'done' ? '✅'
                            : sr.status === 'error' ? '❌'
                            : sr.status === 'running' ? '⚡'
                            : '⏳'}
                        </span>
                        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 13, color: '#f0f0f5', flex: 1 }}>
                          Étape {si + 1} — {sr.step.label}
                        </span>
                        {sr.status === 'running' && (
                          <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2, borderTopColor: '#f97316' }} />
                        )}
                      </div>

                      {/* Step description */}
                      <p style={{ color: '#666680', fontSize: 12, margin: sr.result.output ? '0 0 10px 22px' : '0 0 0 22px' }}>
                        {sr.step.description}
                      </p>

                      {/* Result output */}
                      {sr.result.output && (
                        <div style={{ marginLeft: 22 }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
                            <button
                              onClick={() => copyText(sr.result.output!)}
                              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '3px 10px', color: '#8888aa', fontSize: 11, cursor: 'pointer' }}
                            >📋 Copier</button>
                          </div>
                          <pre style={{
                            background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '12px',
                            fontSize: sr.result.outputType === 'json' || sr.result.outputType === 'sql' ? 12 : 13,
                            fontFamily: sr.result.outputType === 'json' || sr.result.outputType === 'sql' ? 'JetBrains Mono, monospace' : 'DM Sans, sans-serif',
                            color: sr.result.outputType === 'json' ? '#a5b4fc' : sr.result.outputType === 'sql' ? '#4ade80' : '#f0f0f5',
                            whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0,
                            maxHeight: 300, overflowY: 'auto'
                          }}>
                            {sr.result.output}
                          </pre>
                        </div>
                      )}

                      {sr.result.error && (
                        <p style={{ color: '#f87171', fontSize: 12, margin: '4px 0 0 22px' }}>
                          {sr.result.error}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Final message when done */}
                  {msg.status === 'done' && (
                    <div style={{
                      background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)',
                      borderRadius: 10, padding: '12px 16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>🎉</span>
                        <span style={{ color: '#4ade80', fontSize: 14, fontWeight: 600 }}>Terminé !</span>
                      </div>
                      <p style={{ color: '#8888aa', fontSize: 13, margin: '6px 0 0' }}>{msg.plan.finalMessage}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Simple agent message (no plan) */}
              {msg.role === 'agent' && !msg.plan && msg.content && (
                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${msg.status === 'error' ? 'rgba(248,113,113,0.25)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 12, padding: '12px 16px',
                  color: msg.status === 'error' ? '#f87171' : '#f0f0f5',
                  fontSize: 14, lineHeight: 1.7
                }}>
                  {msg.content}
                </div>
              )}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{
        background: 'rgba(17,17,24,0.95)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '16px 0 0',
        backdropFilter: 'blur(20px)'
      }}>
        {/* File preview */}
        {file && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
            background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)',
            borderRadius: 8, padding: '8px 12px'
          }}>
            <span style={{ fontSize: 16 }}>📎</span>
            <span style={{ color: '#f97316', fontSize: 13, flex: 1 }}>{file.name}</span>
            <button onClick={() => setFile(null)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 16 }}>×</button>
          </div>
        )}

        {/* Input row */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <button
            onClick={() => fileRef.current?.click()}
            title="Joindre un fichier"
            style={{
              width: 44, height: 44, borderRadius: 10, flexShrink: 0,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#8888aa', cursor: 'pointer', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s'
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,115,22,0.4)'; (e.currentTarget as HTMLElement).style.color = '#f97316' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = '#8888aa' }}
          >📎</button>
          <input
            ref={fileRef}
            type="file"
            style={{ display: 'none' }}
            onChange={e => setFile(e.target.files?.[0] ?? null)}
            accept=".pdf,.jpg,.jpeg,.png,.webp,.csv,.json,.xml,.txt,.md,.zip"
          />

          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Décrivez votre tâche... (Entrée pour envoyer, Maj+Entrée pour nouvelle ligne)"
            disabled={loading}
            style={{
              flex: 1, minHeight: 44, maxHeight: 140,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '11px 14px',
              color: '#f0f0f5', fontSize: 14,
              fontFamily: 'DM Sans, sans-serif',
              resize: 'none', outline: 'none',
              transition: 'border-color 0.15s',
              opacity: loading ? 0.6 : 1,
            }}
            onFocus={e => e.target.style.borderColor = '#f97316'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            style={{
              width: 44, height: 44, borderRadius: 10, flexShrink: 0,
              background: input.trim() && !loading ? '#f97316' : 'rgba(255,255,255,0.05)',
              border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              color: input.trim() && !loading ? 'white' : '#555570',
              fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s'
            }}
          >
            {loading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : '→'}
          </button>
        </div>

        <p style={{ color: '#333345', fontSize: 11, margin: '8px 0 0', textAlign: 'center' }}>
          Agent Zouti • 20 appels IA/heure • Vos fichiers ne quittent pas votre navigateur
        </p>
      </div>
    </div>
  )
}
