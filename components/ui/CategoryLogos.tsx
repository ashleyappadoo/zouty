// ZOUTI — Category SVG Logos
// One distinct SVG per category for visual debugging and branding

interface LogoProps {
  size?: number
  color?: string
  className?: string
}

// ── PDF & Documents ────────────────────────────────────────────────────────────
export function PdfLogo({ size = 32, color = '#f97316' }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="4" y="2" width="18" height="24" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M22 2l6 6v18a2 2 0 01-2 2H8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M22 2v6h6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 12h10M8 16h10M8 20h6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="26" cy="26" r="5" fill={color}/>
      <path d="M24 26h4M26 24v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// ── Images ─────────────────────────────────────────────────────────────────────
export function ImagesLogo({ size = 32, color = '#60a5fa' }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="2" y="6" width="28" height="20" rx="3" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="10" cy="13" r="3" stroke={color} strokeWidth="1.5" fill="none"/>
      <path d="M2 22l7-7 5 5 4-4 10 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 2l-4 4M26 4l-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  )
}

// ── AI Writing ─────────────────────────────────────────────────────────────────
export function WritingLogo({ size = 32, color = '#c084fc' }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M4 26l4-4L22 8a2 2 0 012.8 0l1.2 1.2a2 2 0 010 2.8L12 26H4z" stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round"/>
      <path d="M20 10l2 2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M4 26l2-2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      {/* AI sparkles */}
      <path d="M27 4l.6 1.4L29 6l-1.4.6L27 8l-.6-1.4L25 6l1.4-.6L27 4z" fill={color}/>
      <path d="M22 26l.4.9.9.4-.9.4L22 29l-.4-.9-.9-.4.9-.4L22 26z" fill={color} opacity="0.7"/>
    </svg>
  )
}

// ── Detection & AI ─────────────────────────────────────────────────────────────
export function DetectionLogo({ size = 32, color = '#4ade80' }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Brain/circuit */}
      <circle cx="16" cy="16" r="12" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="16" cy="16" r="4" stroke={color} strokeWidth="1.5" fill="none"/>
      {/* Scan lines */}
      <path d="M4 16h8M20 16h8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 4v8M16 20v8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      {/* Dot indicators */}
      <circle cx="8" cy="10" r="1.5" fill={color} opacity="0.6"/>
      <circle cx="24" cy="22" r="1.5" fill={color} opacity="0.6"/>
      <circle cx="24" cy="10" r="1.5" fill={color} opacity="0.6"/>
      <circle cx="8" cy="22" r="1.5" fill={color} opacity="0.6"/>
    </svg>
  )
}

// ── File Conversion ────────────────────────────────────────────────────────────
export function ConversionLogo({ size = 32, color = '#fbbf24' }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Left file */}
      <rect x="2" y="6" width="12" height="14" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M4 11h8M4 14h6M4 17h4" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      {/* Right file */}
      <rect x="18" y="12" width="12" height="14" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M20 17h8M20 20h6M20 23h4" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      {/* Arrow */}
      <path d="M14 13h4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 11l2 2-2 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Dev Tools ──────────────────────────────────────────────────────────────────
export function DevToolsLogo({ size = 32, color = '#a5b4fc' }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Terminal window */}
      <rect x="2" y="4" width="28" height="24" rx="3" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M2 11h28" stroke={color} strokeWidth="1.5"/>
      {/* Dots */}
      <circle cx="7" cy="7.5" r="1.5" fill={color} opacity="0.5"/>
      <circle cx="12" cy="7.5" r="1.5" fill={color} opacity="0.5"/>
      <circle cx="17" cy="7.5" r="1.5" fill={color} opacity="0.5"/>
      {/* Code brackets */}
      <path d="M8 17l-4 3 4 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 17l4 3-4 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 17l4 3-4 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
    </svg>
  )
}

// ── Utilities ──────────────────────────────────────────────────────────────────
export function UtilitiesLogo({ size = 32, color = '#94a3b8' }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Wrench */}
      <path d="M20 4a6 6 0 00-6 6c0 .8.2 1.5.4 2.2L4 22.4A2 2 0 007.6 26l10.2-10.4c.7.2 1.4.4 2.2.4a6 6 0 000-12z" stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round"/>
      <circle cx="20" cy="10" r="2" fill={color}/>
      {/* Small elements */}
      <path d="M4 6h4M4 9h3" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <rect x="24" y="22" width="5" height="5" rx="1" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6"/>
    </svg>
  )
}

// ── Generic tool icon (fallback) ───────────────────────────────────────────────
export function ToolIcon({ size = 32, color = '#f97316' }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="2" y="2" width="28" height="28" rx="6" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="16" cy="16" r="6" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M16 10v2M16 20v2M10 16h2M20 16h2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// ── Category logo map ──────────────────────────────────────────────────────────
export const CATEGORY_LOGOS: Record<string, React.ComponentType<LogoProps>> = {
  pdf: PdfLogo,
  images: ImagesLogo,
  writing: WritingLogo,
  detection: DetectionLogo,
  conversion: ConversionLogo,
  devtools: DevToolsLogo,
  utilities: UtilitiesLogo,
}

export const CATEGORY_COLORS: Record<string, string> = {
  pdf: '#f97316',
  images: '#60a5fa',
  writing: '#c084fc',
  detection: '#4ade80',
  conversion: '#fbbf24',
  devtools: '#a5b4fc',
  utilities: '#94a3b8',
}

// Tool-specific mini icons for the debug sidebar
export const TOOL_SECTION_ICONS: Record<string, string> = {
  // PDF
  'pdf-merge': '🔗', 'pdf-split': '✂️', 'pdf-rotate': '🔄', 'images-to-pdf': '🖼️',
  'pdf-to-images': '📸', 'pdf-watermark': '💧', 'pdf-extract-text': '📝', 'pdf-summarize': '🧠',
  // Images
  'image-compress': '📦', 'image-convert': '🔄', 'image-resize': '📐', 'image-crop': '✂️',
  'image-bg-remove': '🪄', 'image-ocr': '🔍', 'qrcode': '📱', 'thumbnail': '▶️',
  // Writing
  'write-article': '📰', 'write-rephrase': '🔀', 'write-correct': '✅', 'write-improve': '⬆️',
  'write-summarize': '📋', 'write-expand': '📈', 'write-simplify': '🔡', 'write-email': '📧',
  'write-social': '📲', 'write-letter': '📬', 'write-product': '🛍️', 'write-keywords': '🔑', 'write-tone': '🎭',
  // Detection
  'ai-humanize': '🧬', 'ai-tone-analyze': '🎯', 'text-diff': '⚖️', 'readability': '📊',
  // Conversion
  'csv-to-json': '🔄', 'json-to-csv': '🔄', 'excel-to-csv': '📊', 'csv-to-excel': '📗',
  'xml-to-json': '🔀', 'md-to-html': '📝', 'html-to-md': '📄', 'txt-to-pdf': '📋',
  'zip-extract': '📦', 'base64': '🔐', 'url-encode': '🌐',
  // Dev
  'html-preview': '👁️', 'html-editor': '💻', 'json-format': '📋', 'json-download': '💾',
  'sql-gen': '🗄️', 'sql-format': '✨', 'sql-run': '▶️', 'regex-builder': '🔎',
  'minifier': '🗜️', 'jwt-decode': '🔑', 'mock-json': '🎲', 'code-diff': '📑', 'css-converter': '🎨',
  // Utilities
  'tva-calc': '💰', 'password-gen': '🔒', 'word-count': '📊', 'uuid-gen': '🎲',
  'lorem-ipsum': '📝', 'unit-convert': '📏', 'date-calc': '📅', 'color-picker': '🎨',
}
