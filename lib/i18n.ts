export type Lang = 'fr' | 'en'

export const translations = {
  // ── Navigation ──────────────────────────────────────────────────────────────
  nav: {
    search_placeholder: { fr: 'Rechercher un outil...', en: 'Search for a tool...' },
    v2_badge: { fr: '✨ V2 Pro', en: '✨ V2 Pro' },
    all_tools: { fr: 'Tous les outils', en: 'All tools' },
  },

  // ── Homepage ────────────────────────────────────────────────────────────────
  home: {
    badge: { fr: '⚡ {n} outils gratuits — Sans inscription', en: '⚡ {n} free tools — No sign-up' },
    headline_1: { fr: 'Tous vos outils.', en: 'All your tools.' },
    headline_2: { fr: 'Dans un seul endroit.', en: 'In one place.' },
    subtitle: { fr: '{n} outils IA gratuits — PDF, images, écriture, conversion, dev tools. Sans compte. Sans logiciel. 100% dans votre navigateur.', en: '{n} free AI tools — PDF, images, writing, conversion, dev tools. No account. No software. 100% in your browser.' },
    search_placeholder: { fr: 'Rechercher un outil... (ex: PDF, QR code, SQL, base64)', en: 'Search a tool... (e.g. PDF, QR code, SQL, base64)' },
    stats_tools: { fr: 'Outils disponibles', en: 'Available tools' },
    stats_ai: { fr: 'Propulsés par IA', en: 'AI-powered' },
    stats_no_login: { fr: 'Sans inscription', en: 'No sign-up' },
    stats_local: { fr: 'Traitement local', en: 'Local processing' },
    filter_all: { fr: 'Tous les outils', en: 'All tools' },
    use_tool: { fr: 'Utiliser →', en: 'Use →' },
    ai_badge: { fr: 'IA', en: 'AI' },
    n_tools: { fr: 'outils', en: 'tools' },
    search_results: { fr: '{n} résultat{s} pour "{q}"', en: '{n} result{s} for "{q}"' },
    no_results: { fr: 'Aucun outil trouvé. Essayez un autre terme.', en: 'No tool found. Try another search term.' },
  },

  // ── Why Zouti ───────────────────────────────────────────────────────────────
  why: {
    title: { fr: 'Pourquoi Zouti ?', en: 'Why Zouti?' },
    privacy_title: { fr: 'Vos données restent chez vous', en: 'Your data stays with you' },
    privacy_desc: { fr: '80% des outils fonctionnent 100% dans votre navigateur. Aucun fichier envoyé sur nos serveurs.', en: '80% of tools run 100% in your browser. No files sent to our servers.' },
    friction_title: { fr: 'Zéro friction', en: 'Zero friction' },
    friction_desc: { fr: 'Pas de compte, pas de téléchargement, pas de pub intrusive. Un outil, un résultat.', en: 'No account, no download, no intrusive ads. One tool, one result.' },
    ai_title: { fr: 'IA de pointe', en: 'State-of-the-art AI' },
    ai_desc: { fr: 'Les outils IA sont propulsés par Claude, l\'un des modèles les plus avancés du marché.', en: 'AI tools are powered by Claude, one of the most advanced models available.' },
    french_title: { fr: 'Fait pour la France', en: 'Built for French users' },
    french_desc: { fr: 'Interface en français, outils adaptés aux usages français (TVA, CGV, RGPD).', en: 'French interface, tools adapted to French usage (VAT, T&Cs, GDPR).' },
    free_title: { fr: 'Toujours gratuit', en: 'Always free' },
    free_desc: { fr: 'La V1 avec ses 65 outils restera toujours gratuite.', en: 'V1 with 65 tools will always remain free.' },
    all_in_one_title: { fr: '65 outils en un', en: '65 tools in one' },
    all_in_one_desc: { fr: 'PDF, images, écriture, dev tools — plus besoin de jongler entre 10 sites.', en: 'PDF, images, writing, dev tools — no more juggling between 10 different sites.' },
  },

  // ── V2 Section ──────────────────────────────────────────────────────────────
  v2: {
    badge: { fr: '✨ Zouti V2 — Bientôt disponible', en: '✨ Zouti V2 — Coming soon' },
    title: { fr: 'Plus puissant.\nPlus rapide. Pro.', en: 'More powerful.\nFaster. Pro.' },
    desc: { fr: 'La V2 apportera des fonctionnalités avancées en abonnement : compression PDF, conversion PDF↔Word, upscaler IA, détecteur de contenu IA et plus.', en: 'V2 will bring advanced paid features: PDF compression, PDF↔Word conversion, AI upscaler, AI content detector, and more.' },
    notify_placeholder: { fr: 'votre@email.fr', en: 'your@email.com' },
    notify_btn: { fr: 'M\'avertir', en: 'Notify me' },
    notify_success: { fr: 'Merci ! Vous serez notifié au lancement.', en: 'Thanks! You\'ll be notified at launch.' },
    v1_label: { fr: 'Zouti V1', en: 'Zouti V1' },
    v1_price: { fr: 'Gratuit', en: 'Free' },
    v1_desc: { fr: '65 outils, toujours', en: '65 tools, forever' },
    v2_label: { fr: 'Zouti V2 Pro', en: 'Zouti V2 Pro' },
    v2_price: { fr: '~9€/mois', en: '~€9/mo' },
    v2_desc: { fr: 'Fonctionnalités avancées', en: 'Advanced features' },
    features: {
      fr: ['Compression PDF intelligente', 'PDF ↔ Word / Excel', 'Upscaler IA d\'images', 'Détecteur contenu IA', 'Fichiers jusqu\'à 100MB', 'Traitement par lot'],
      en: ['Smart PDF compression', 'PDF ↔ Word / Excel', 'AI image upscaler', 'AI content detector', 'Files up to 100MB', 'Batch processing'],
    },
  },

  // ── Tool Layout ─────────────────────────────────────────────────────────────
  tool: {
    home: { fr: 'Accueil', en: 'Home' },
    ai_badge: { fr: '✦ IA', en: '✦ AI' },
    free_badge: { fr: 'Gratuit', en: 'Free' },
    ad_label: { fr: 'Publicité', en: 'Advertisement' },
    about_title: { fr: 'À propos de', en: 'About' },
    about_suffix: { fr: ' — Outil gratuit proposé par Zouti, sans inscription ni téléchargement requis.', en: ' — Free tool by Zouti, no sign-up or download required.' },
    about_ai: { fr: ' Propulsé par intelligence artificielle.', en: ' Powered by artificial intelligence.' },
    about_secure: { fr: ' Utilisation 100% sécurisée, vos données restent dans votre navigateur.', en: ' 100% secure, your data stays in your browser.' },
    v2_badge: { fr: 'V2 Pro →', en: 'V2 Pro →' },
  },

  // ── Tool UI — shared ────────────────────────────────────────────────────────
  ui: {
    select_file: { fr: 'Sélectionnez un fichier', en: 'Select a file' },
    drop_here: { fr: 'Glissez votre fichier ici ou', en: 'Drop your file here or' },
    click_to_select: { fr: 'cliquez pour sélectionner', en: 'click to select' },
    generate: { fr: '✦ Générer', en: '✦ Generate' },
    generating: { fr: 'Traitement IA...', en: 'AI processing...' },
    copy: { fr: '📋 Copier', en: '📋 Copy' },
    copied: { fr: '✓ Copié !', en: '✓ Copied!' },
    download: { fr: '💾 Télécharger', en: '💾 Download' },
    reuse: { fr: '♻️ Réutiliser', en: '♻️ Reuse' },
    result: { fr: 'Résultat', en: 'Result' },
    ctrl_enter: { fr: 'Ctrl+Entrée pour lancer', en: 'Ctrl+Enter to run' },
    chars: { fr: 'caractères', en: 'characters' },
    words: { fr: 'mots', en: 'words' },
    error_prefix: { fr: 'Erreur : ', en: 'Error: ' },
    convert: { fr: '🔄 Convertir', en: '🔄 Convert' },
    converting: { fr: 'Conversion...', en: 'Converting...' },
    processing: { fr: 'Traitement...', en: 'Processing...' },
    compare: { fr: '⚖️ Comparer', en: '⚖️ Compare' },
    calculate: { fr: 'Calculer', en: 'Calculate' },
    apply: { fr: 'Appliquer', en: 'Apply' },
    reset: { fr: '🗑️ Réinitialiser', en: '🗑️ Reset' },
    loading_model: { fr: 'Chargement du modèle IA...', en: 'Loading AI model...' },
    all_pages: { fr: 'Toutes les pages', en: 'All pages' },
    specific_pages: { fr: 'Pages spécifiques', en: 'Specific pages' },
    output_format: { fr: 'Format de sortie', en: 'Output format' },
    quality: { fr: 'Qualité', en: 'Quality' },
    size: { fr: 'Taille', en: 'Size' },
    original: { fr: 'Original', en: 'Original' },
    preview: { fr: 'Aperçu', en: 'Preview' },
    source_code: { fr: 'Code source', en: 'Source code' },
    live_preview: { fr: 'Aperçu en direct', en: 'Live preview' },
    dialect: { fr: 'Dialecte SQL', en: 'SQL Dialect' },
    encode: { fr: '🔐 Encoder', en: '🔐 Encode' },
    decode: { fr: '🔓 Décoder', en: '🔓 Decode' },
    plain_text: { fr: 'Texte brut', en: 'Plain text' },
    execute: { fr: '▶️ Exécuter', en: '▶️ Execute' },
    execution_ok: { fr: '✓ Requête exécutée avec succès', en: '✓ Query executed successfully' },
    rows_returned: { fr: 'ligne{s} retournée{s}', en: 'row{s} returned' },
    generate_btn: { fr: 'Générer', en: 'Generate' },
  },

  // ── Rate limit UI ───────────────────────────────────────────────────────────
  rateLimit: {
    title: { fr: '⏱️ Limite atteinte', en: '⏱️ Limit reached' },
    message: { fr: 'Vous avez utilisé vos 20 appels IA gratuits cette heure. Réessayez dans {min} minutes.', en: 'You\'ve used your 20 free AI calls this hour. Try again in {min} minutes.' },
    remaining: { fr: '{n} appels restants cette heure', en: '{n} calls remaining this hour' },
  },

  // ── Footer ──────────────────────────────────────────────────────────────────
  footer: {
    tagline: { fr: 'Le mot "zouti" signifie "outil" en créole.', en: '"Zouti" means "tool" in Creole.' },
    free_badge: { fr: '✓ Gratuit', en: '✓ Free' },
    no_login_badge: { fr: '⚡ Sans inscription', en: '⚡ No sign-up' },
    v2_title: { fr: '✨ Zouti V2 — Bientôt disponible', en: '✨ Zouti V2 — Coming soon' },
    v2_desc: { fr: 'Compression avancée, PDF↔Word, upscaler IA et plus encore.', en: 'Advanced compression, PDF↔Word, AI upscaler and more.' },
    notify_btn: { fr: 'Être notifié →', en: 'Get notified →' },
    copyright: { fr: '© {year} Zouti — Tous droits réservés', en: '© {year} Zouti — All rights reserved' },
    legal: { fr: 'Mentions légales', en: 'Legal' },
    privacy: { fr: 'Confidentialité', en: 'Privacy' },
    terms: { fr: 'CGU', en: 'Terms' },
  },

  // ── Category labels & descriptions ──────────────────────────────────────────
  categories: {
    pdf: {
      label: { fr: 'PDF & Documents', en: 'PDF & Documents' },
      description: { fr: 'Fusionnez, découpez, convertissez vos fichiers PDF', en: 'Merge, split, convert your PDF files' },
    },
    images: {
      label: { fr: 'Images', en: 'Images' },
      description: { fr: 'Compressez, convertissez, éditez vos images', en: 'Compress, convert, edit your images' },
    },
    writing: {
      label: { fr: 'Écriture IA', en: 'AI Writing' },
      description: { fr: 'Rédigez, reformulez, améliorez vos textes avec l\'IA', en: 'Write, rephrase, improve your texts with AI' },
    },
    detection: {
      label: { fr: 'Détection & IA', en: 'Detection & AI' },
      description: { fr: 'Analysez et humanisez les textes générés par IA', en: 'Analyze and humanize AI-generated texts' },
    },
    conversion: {
      label: { fr: 'Conversion Fichiers', en: 'File Conversion' },
      description: { fr: 'Convertissez CSV, JSON, Excel et autres formats', en: 'Convert CSV, JSON, Excel and other formats' },
    },
    devtools: {
      label: { fr: 'Dev Tools', en: 'Dev Tools' },
      description: { fr: 'Outils pour développeurs : SQL, JSON, HTML, regex', en: 'Developer tools: SQL, JSON, HTML, regex' },
    },
    utilities: {
      label: { fr: 'Utilitaires', en: 'Utilities' },
      description: { fr: 'Calculateurs, générateurs et outils pratiques', en: 'Calculators, generators and practical tools' },
    },
  },
} as const

// Helper to get a translation value
export function t(path: string, lang: Lang, vars?: Record<string, string | number>): string {
  const keys = path.split('.')
  let current: any = translations
  for (const key of keys) {
    if (current == null) return path
    current = current[key]
  }
  if (!current) return path
  let result: string = current[lang] ?? current['fr'] ?? path
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      result = result.replace(`{${k}}`, String(v))
      // Handle plural {s}
      if (k === 'n') result = result.replace('{s}', Number(v) > 1 ? 's' : '')
    })
  }
  return result
}

// Tool name translations (for the 65 tools)
export const toolTranslations: Record<string, { name: { fr: string; en: string }; description: { fr: string; en: string } }> = {
  'pdf-merge': { name: { fr: 'Fusion PDF', en: 'Merge PDF' }, description: { fr: 'Combinez plusieurs fichiers PDF en un seul', en: 'Combine multiple PDF files into one' } },
  'pdf-split': { name: { fr: 'Découper PDF', en: 'Split PDF' }, description: { fr: 'Extrayez des pages spécifiques de votre PDF', en: 'Extract specific pages from your PDF' } },
  'pdf-rotate': { name: { fr: 'Rotation & Pages PDF', en: 'Rotate PDF Pages' }, description: { fr: 'Réorganisez et faites pivoter les pages', en: 'Reorder and rotate PDF pages' } },
  'images-to-pdf': { name: { fr: 'Images → PDF', en: 'Images to PDF' }, description: { fr: 'Convertissez des images en fichier PDF', en: 'Convert images to a PDF file' } },
  'pdf-to-images': { name: { fr: 'PDF → Images', en: 'PDF to Images' }, description: { fr: 'Convertissez chaque page PDF en image', en: 'Convert each PDF page to an image' } },
  'pdf-watermark': { name: { fr: 'Filigrane PDF', en: 'PDF Watermark' }, description: { fr: 'Ajoutez un filigrane à votre PDF', en: 'Add a watermark to your PDF' } },
  'pdf-extract-text': { name: { fr: 'Extraire texte PDF', en: 'Extract PDF Text' }, description: { fr: 'Extrayez le texte d\'un PDF', en: 'Extract text from a PDF file' } },
  'pdf-summarize': { name: { fr: 'Résumeur de PDF (IA)', en: 'PDF Summarizer (AI)' }, description: { fr: 'Résumé intelligent de votre PDF', en: 'AI-powered summary of your PDF' } },
  'image-compress': { name: { fr: 'Compresser Image', en: 'Compress Image' }, description: { fr: 'Réduisez le poids de vos images', en: 'Reduce image file size' } },
  'image-convert': { name: { fr: 'Convertir Format Image', en: 'Convert Image Format' }, description: { fr: 'Convertissez entre JPG, PNG, WebP...', en: 'Convert between JPG, PNG, WebP...' } },
  'image-resize': { name: { fr: 'Redimensionner Image', en: 'Resize Image' }, description: { fr: 'Modifiez la taille de vos images', en: 'Change your image dimensions' } },
  'image-crop': { name: { fr: 'Recadrage Intelligent', en: 'Smart Crop' }, description: { fr: 'Recadrez vos images intelligemment', en: 'Intelligently crop your images' } },
  'image-bg-remove': { name: { fr: 'Supprimer le fond (IA)', en: 'Remove Background (AI)' }, description: { fr: 'Supprimez l\'arrière-plan automatiquement', en: 'Automatically remove image background' } },
  'image-ocr': { name: { fr: 'Extraire texte image (OCR)', en: 'Image to Text (OCR)' }, description: { fr: 'Convertissez le texte d\'une image', en: 'Extract text from an image' } },
  'qrcode': { name: { fr: 'Générateur QR Code', en: 'QR Code Generator' }, description: { fr: 'Créez des QR codes personnalisés', en: 'Create custom QR codes' } },
  'thumbnail': { name: { fr: 'Miniature YouTube', en: 'YouTube Thumbnail' }, description: { fr: 'Créez des miniatures YouTube optimisées', en: 'Create optimized YouTube thumbnails' } },
  'write-article': { name: { fr: 'Rédacteur d\'articles', en: 'Article Writer' }, description: { fr: 'Générez des articles complets et SEO', en: 'Generate complete SEO articles' } },
  'write-rephrase': { name: { fr: 'Reformulateur', en: 'Paraphraser' }, description: { fr: 'Reformulez n\'importe quel texte', en: 'Rephrase any text' } },
  'write-correct': { name: { fr: 'Correcteur orthographique', en: 'Spell Checker' }, description: { fr: 'Corrigez orthographe et grammaire', en: 'Fix spelling and grammar' } },
  'write-improve': { name: { fr: 'Améliorateur de texte', en: 'Text Improver' }, description: { fr: 'Rendez vos textes plus percutants', en: 'Make your texts more impactful' } },
  'write-summarize': { name: { fr: 'Résumeur de texte', en: 'Text Summarizer' }, description: { fr: 'Condensez n\'importe quel texte', en: 'Condense any text to key points' } },
  'write-expand': { name: { fr: 'Développeur de texte', en: 'Text Expander' }, description: { fr: 'Étendez et enrichissez vos textes courts', en: 'Expand and enrich your short texts' } },
  'write-simplify': { name: { fr: 'Simplificateur de texte', en: 'Text Simplifier' }, description: { fr: 'Rendez les textes complexes accessibles', en: 'Make complex texts easy to understand' } },
  'write-email': { name: { fr: 'Générateur d\'emails pro', en: 'Professional Email Generator' }, description: { fr: 'Rédigez des emails professionnels', en: 'Write professional emails instantly' } },
  'write-social': { name: { fr: 'Posts réseaux sociaux', en: 'Social Media Posts' }, description: { fr: 'Créez des posts LinkedIn, Instagram, X', en: 'Create LinkedIn, Instagram, X posts' } },
  'write-letter': { name: { fr: 'Générateur de lettres', en: 'Letter Generator' }, description: { fr: 'Rédigez des lettres formelles', en: 'Write formal and administrative letters' } },
  'write-product': { name: { fr: 'Description produit', en: 'Product Description' }, description: { fr: 'Générez des descriptions e-commerce', en: 'Generate e-commerce product descriptions' } },
  'write-keywords': { name: { fr: 'Extracteur mots-clés SEO', en: 'SEO Keyword Extractor' }, description: { fr: 'Extrayez les mots-clés principaux', en: 'Extract main SEO keywords' } },
  'write-tone': { name: { fr: 'Changeur de ton', en: 'Tone Changer' }, description: { fr: 'Adaptez le registre de votre texte', en: 'Adapt the tone of your text' } },
  'ai-humanize': { name: { fr: 'Humaniseur de texte IA', en: 'AI Text Humanizer' }, description: { fr: 'Transformez un texte IA en écriture naturelle', en: 'Transform AI text to natural writing' } },
  'ai-tone-analyze': { name: { fr: 'Analyseur de ton', en: 'Tone Analyzer' }, description: { fr: 'Détectez le registre d\'un texte', en: 'Detect the tone and register of text' } },
  'text-diff': { name: { fr: 'Comparateur de versions', en: 'Version Comparator' }, description: { fr: 'Comparez deux textes et visualisez les diff', en: 'Compare two texts and see differences' } },
  'readability': { name: { fr: 'Analyseur de lisibilité', en: 'Readability Analyzer' }, description: { fr: 'Calculez le score de lisibilité Flesch', en: 'Calculate Flesch readability score' } },
  'csv-to-json': { name: { fr: 'CSV → JSON', en: 'CSV to JSON' }, description: { fr: 'Convertissez vos CSV en JSON', en: 'Convert CSV to JSON format' } },
  'json-to-csv': { name: { fr: 'JSON → CSV', en: 'JSON to CSV' }, description: { fr: 'Transformez vos JSON en CSV', en: 'Transform JSON data to CSV' } },
  'excel-to-csv': { name: { fr: 'Excel → CSV', en: 'Excel to CSV' }, description: { fr: 'Exportez vos Excel en CSV', en: 'Export Excel sheets to CSV' } },
  'csv-to-excel': { name: { fr: 'CSV → Excel', en: 'CSV to Excel' }, description: { fr: 'Convertissez vos CSV en Excel', en: 'Convert CSV to Excel format' } },
  'xml-to-json': { name: { fr: 'XML → JSON', en: 'XML to JSON' }, description: { fr: 'Parsez vos fichiers XML en JSON', en: 'Parse XML files to JSON' } },
  'md-to-html': { name: { fr: 'Markdown → HTML', en: 'Markdown to HTML' }, description: { fr: 'Convertissez Markdown en HTML', en: 'Convert Markdown to HTML code' } },
  'html-to-md': { name: { fr: 'HTML → Markdown', en: 'HTML to Markdown' }, description: { fr: 'Convertissez HTML en Markdown', en: 'Convert HTML to Markdown syntax' } },
  'txt-to-pdf': { name: { fr: 'TXT → PDF', en: 'TXT to PDF' }, description: { fr: 'Créez un PDF à partir de texte brut', en: 'Create a PDF from plain text' } },
  'zip-extract': { name: { fr: 'Extraction ZIP', en: 'ZIP Extractor' }, description: { fr: 'Extrayez vos archives ZIP', en: 'Extract ZIP archive contents' } },
  'base64': { name: { fr: 'Encodeur/Décodeur Base64', en: 'Base64 Encoder/Decoder' }, description: { fr: 'Encodez et décodez en Base64', en: 'Encode and decode Base64' } },
  'url-encode': { name: { fr: 'Encodeur/Décodeur URL', en: 'URL Encoder/Decoder' }, description: { fr: 'Encodez et décodez les URLs', en: 'Encode and decode URLs' } },
  'html-preview': { name: { fr: 'Visualiseur HTML live', en: 'Live HTML Preview' }, description: { fr: 'Prévisualisez votre HTML en direct', en: 'Preview your HTML in real-time' } },
  'html-editor': { name: { fr: 'Éditeur HTML/CSS/JS', en: 'HTML/CSS/JS Editor' }, description: { fr: 'Éditeur de code avec preview live', en: 'Code editor with live preview' } },
  'json-format': { name: { fr: 'JSON Formatter', en: 'JSON Formatter' }, description: { fr: 'Formatez et validez votre JSON', en: 'Format and validate your JSON' } },
  'json-download': { name: { fr: 'JSON → Fichier', en: 'JSON to File' }, description: { fr: 'Téléchargez votre JSON en fichier', en: 'Download your JSON as a file' } },
  'sql-gen': { name: { fr: 'Générateur SQL (IA)', en: 'SQL Generator (AI)' }, description: { fr: 'Décrivez votre requête, obtenez le SQL', en: 'Describe your query, get the SQL' } },
  'sql-format': { name: { fr: 'Formateur SQL', en: 'SQL Formatter' }, description: { fr: 'Formatez vos requêtes SQL', en: 'Format and prettify SQL queries' } },
  'sql-run': { name: { fr: 'Exécuteur SQL', en: 'SQL Runner' }, description: { fr: 'Exécutez SQLite dans le navigateur', en: 'Run SQLite queries in your browser' } },
  'regex-builder': { name: { fr: 'Regex Builder (IA)', en: 'Regex Builder (AI)' }, description: { fr: 'Générez des regex avec l\'IA', en: 'Generate regex patterns with AI' } },
  'minifier': { name: { fr: 'Minifier / Beautifier', en: 'Minifier / Beautifier' }, description: { fr: 'Minifiez ou formatez HTML, CSS, JS, JSON', en: 'Minify or beautify HTML, CSS, JS, JSON' } },
  'jwt-decode': { name: { fr: 'Décodeur JWT', en: 'JWT Decoder' }, description: { fr: 'Décodez et inspectez vos tokens JWT', en: 'Decode and inspect JWT tokens' } },
  'mock-json': { name: { fr: 'Générateur JSON Mock', en: 'Mock JSON Generator' }, description: { fr: 'Générez des données JSON de test', en: 'Generate mock JSON test data' } },
  'code-diff': { name: { fr: 'Diff de code', en: 'Code Diff' }, description: { fr: 'Comparez deux versions de code', en: 'Compare two versions of code' } },
  'css-converter': { name: { fr: 'Convertisseur CSS px/rem/em', en: 'CSS px/rem/em Converter' }, description: { fr: 'Convertissez entre unités CSS', en: 'Convert between CSS units' } },
  'tva-calc': { name: { fr: 'Calculateur TVA France', en: 'French VAT Calculator' }, description: { fr: 'Calculez HT/TTC avec TVA française', en: 'Calculate prices with French VAT' } },
  'password-gen': { name: { fr: 'Générateur mot de passe', en: 'Password Generator' }, description: { fr: 'Créez des mots de passe forts', en: 'Create strong secure passwords' } },
  'word-count': { name: { fr: 'Compteur de mots', en: 'Word Counter' }, description: { fr: 'Comptez mots, caractères, phrases', en: 'Count words, characters, sentences' } },
  'uuid-gen': { name: { fr: 'Générateur UUID', en: 'UUID Generator' }, description: { fr: 'Générez des UUID v4 uniques', en: 'Generate unique v4 UUIDs' } },
  'lorem-ipsum': { name: { fr: 'Générateur Lorem Ipsum', en: 'Lorem Ipsum Generator' }, description: { fr: 'Générez du Lorem Ipsum pour vos maquettes', en: 'Generate Lorem Ipsum for mockups' } },
  'unit-convert': { name: { fr: 'Convertisseur d\'unités', en: 'Unit Converter' }, description: { fr: 'Convertissez poids, longueur, température', en: 'Convert weight, length, temperature' } },
  'date-calc': { name: { fr: 'Calculateur de dates', en: 'Date Calculator' }, description: { fr: 'Calculez délais et jours ouvrés', en: 'Calculate date differences and workdays' } },
  'color-picker': { name: { fr: 'Testeur de couleurs', en: 'Color Picker' }, description: { fr: 'Convertissez HEX, RGB, HSL', en: 'Convert between HEX, RGB, HSL' } },
}
