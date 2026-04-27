'use client'

// PDF Tools
import { PdfMergeTool, PdfSplitTool, PdfRotateTool } from './PdfTools'
import { ImagesToPdfTool, PdfToImagesTool, PdfWatermarkTool, PdfExtractTextTool, PdfSummarizeTool } from './PdfTools2'

// Image Tools
import { ImageCompressTool, ImageConvertTool, ImageResizeTool, ImageCropTool, BgRemoveTool, OcrTool, QrCodeTool, ThumbnailTool } from './ImageTools'

// Writing Tools
import { ArticleWriterTool, RephraseTool, CorrectTool, ImproveTool, SummarizeTool, ExpandTool, SimplifyTool, EmailGeneratorTool, SocialPostTool, LetterGeneratorTool, ProductDescriptionTool, KeywordExtractorTool, ToneChangerTool } from './WritingTools'

// Detection Tools
import { HumanizerTool, ToneAnalyzerTool, TextDiffTool, ReadabilityTool } from './DetectionTools'

// Conversion Tools
import { CsvToJsonTool, JsonToCsvTool, ExcelToCsvTool, CsvToExcelTool, XmlToJsonTool, MarkdownToHtmlTool, HtmlToMarkdownTool, TxtToPdfTool, ZipExtractTool, Base64Tool, UrlEncodeTool } from './ConversionTools'

// Dev Tools
import { HtmlPreviewTool, HtmlEditorTool, JsonFormatterTool, JsonDownloadTool, SqlGeneratorTool, SqlFormatterTool, SqlRunnerTool, RegexBuilderTool, MinifierTool, JwtDecoderTool, MockJsonTool, CodeDiffTool, CssConverterTool } from './DevTools'

// Utility Tools
import { TvaCalcTool, PasswordGenTool, WordCountTool, UuidGenTool, LoremIpsumTool, UnitConverterTool, DateCalcTool, ColorPickerTool } from './UtilityTools'

const TOOL_MAP: Record<string, React.ComponentType> = {
  // PDF
  'pdf-merge': PdfMergeTool,
  'pdf-split': PdfSplitTool,
  'pdf-rotate': PdfRotateTool,
  'images-to-pdf': ImagesToPdfTool,
  'pdf-to-images': PdfToImagesTool,
  'pdf-watermark': PdfWatermarkTool,
  'pdf-extract-text': PdfExtractTextTool,
  'pdf-summarize': PdfSummarizeTool,
  // Images
  'image-compress': ImageCompressTool,
  'image-convert': ImageConvertTool,
  'image-resize': ImageResizeTool,
  'image-crop': ImageCropTool,
  'image-bg-remove': BgRemoveTool,
  'image-ocr': OcrTool,
  'qrcode': QrCodeTool,
  'thumbnail': ThumbnailTool,
  // Writing
  'write-article': ArticleWriterTool,
  'write-rephrase': RephraseTool,
  'write-correct': CorrectTool,
  'write-improve': ImproveTool,
  'write-summarize': SummarizeTool,
  'write-expand': ExpandTool,
  'write-simplify': SimplifyTool,
  'write-email': EmailGeneratorTool,
  'write-social': SocialPostTool,
  'write-letter': LetterGeneratorTool,
  'write-product': ProductDescriptionTool,
  'write-keywords': KeywordExtractorTool,
  'write-tone': ToneChangerTool,
  // Detection
  'ai-humanize': HumanizerTool,
  'ai-tone-analyze': ToneAnalyzerTool,
  'text-diff': TextDiffTool,
  'readability': ReadabilityTool,
  // Conversion
  'csv-to-json': CsvToJsonTool,
  'json-to-csv': JsonToCsvTool,
  'excel-to-csv': ExcelToCsvTool,
  'csv-to-excel': CsvToExcelTool,
  'xml-to-json': XmlToJsonTool,
  'md-to-html': MarkdownToHtmlTool,
  'html-to-md': HtmlToMarkdownTool,
  'txt-to-pdf': TxtToPdfTool,
  'zip-extract': ZipExtractTool,
  'base64': Base64Tool,
  'url-encode': UrlEncodeTool,
  // Dev
  'html-preview': HtmlPreviewTool,
  'html-editor': HtmlEditorTool,
  'json-format': JsonFormatterTool,
  'json-download': JsonDownloadTool,
  'sql-gen': SqlGeneratorTool,
  'sql-format': SqlFormatterTool,
  'sql-run': SqlRunnerTool,
  'regex-builder': RegexBuilderTool,
  'minifier': MinifierTool,
  'jwt-decode': JwtDecoderTool,
  'mock-json': MockJsonTool,
  'code-diff': CodeDiffTool,
  'css-converter': CssConverterTool,
  // Utilities
  'tva-calc': TvaCalcTool,
  'password-gen': PasswordGenTool,
  'word-count': WordCountTool,
  'uuid-gen': UuidGenTool,
  'lorem-ipsum': LoremIpsumTool,
  'unit-convert': UnitConverterTool,
  'date-calc': DateCalcTool,
  'color-picker': ColorPickerTool,
}

export default function ToolRenderer({ toolId }: { toolId: string }) {
  const Component = TOOL_MAP[toolId]
  if (!Component) return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8888aa' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
      <h2 style={{ fontFamily: 'Syne, sans-serif', color: '#f0f0f5', marginBottom: 8 }}>Outil en cours de déploiement</h2>
      <p>Cet outil sera disponible très prochainement.</p>
    </div>
  )
  return <Component />
}
