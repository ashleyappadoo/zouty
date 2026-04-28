'use client'
import { useParams } from 'next/navigation'
import { getToolBySlug } from '@/lib/tools-registry'
import ToolLayout from '@/components/tools/ToolLayout'
import ToolRenderer from '@/components/tools/ToolRenderer'

export default function ToolPage() {
  const params = useParams()
  const slug = params?.slug as string
  const category = params?.category as string

  const tool = getToolBySlug(slug)
  if (!tool || tool.category !== category) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', color: '#8888aa' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔧</div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f5' }}>Outil non trouvé</h2>
      </div>
    )
  }

  return (
    <ToolLayout tool={tool}>
      <ToolRenderer toolId={tool.id} />
    </ToolLayout>
  )
}
