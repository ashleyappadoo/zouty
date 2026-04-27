import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { TOOLS, getToolBySlug } from '@/lib/tools-registry'
import ToolLayout from '@/components/tools/ToolLayout'
import ToolRenderer from '@/components/tools/ToolRenderer'

interface Props {
  params: { category: string; slug: string }
}

export async function generateStaticParams() {
  return TOOLS.map(tool => ({ category: tool.category, slug: tool.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getToolBySlug(params.slug)
  if (!tool) return { title: 'Outil non trouvé' }
  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    keywords: tool.tags,
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      type: 'website',
    },
    alternates: { canonical: `https://zouti.fr/tools/${tool.category}/${tool.slug}` },
  }
}

export default function ToolPage({ params }: Props) {
  const tool = getToolBySlug(params.slug)
  if (!tool || tool.category !== params.category) notFound()

  return (
    <ToolLayout tool={tool}>
      <ToolRenderer toolId={tool.id} />
    </ToolLayout>
  )
}
