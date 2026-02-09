import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import fm from 'front-matter'

// Configure markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code class="language-${lang}">${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

// Custom image renderer to prepend base URL for relative paths
const defaultImageRender = md.renderer.rules.image || function(tokens: any[], idx: number, options: any, _env: any, self: any) {
  return self.renderToken(tokens, idx, options)
}

md.renderer.rules.image = function(tokens: any[], idx: number, options: any, env: any, self: any) {
  const token = tokens[idx]
  const srcIndex = token.attrIndex('src')
  if (srcIndex >= 0) {
    const src = token.attrs![srcIndex][1]
    // Prepend base URL for relative paths (not http/https/data URLs)
    if (src && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('/')) {
      const BASE_URL = import.meta.env.BASE_URL || '/'
      token.attrs![srcIndex][1] = `${BASE_URL}${src}`
    }
  }
  return defaultImageRender(tokens, idx, options, env, self)
}

// Fix relative image src paths in raw HTML (for <img> tags written directly in markdown)
function fixHtmlImagePaths(html: string): string {
  const BASE_URL = import.meta.env.BASE_URL || '/'
  return html.replace(
    /<img\s([^>]*?)src="(?!http|data:|\/)(.*?)"([^>]*?)>/g,
    (match, before, src, after) => `<img ${before}src="${BASE_URL}${src}"${after}>`
  )
}

// Parse Markdown file (with front-matter)
export function parseMarkdown(rawContent: string): { 
  attributes: Record<string, any>
  content: string
  html: string 
} {
  const { attributes, body } = fm(rawContent)
  let html = md.render(body)
  html = fixHtmlImagePaths(html)
  
  return {
    attributes: attributes as Record<string, any>,
    content: body,
    html
  }
}

// Render Markdown to HTML
export function renderMarkdown(content: string): string {
  return md.render(content)
}

// Extract excerpt (before <!-- more --> or first 200 chars)
export function extractExcerpt(content: string, maxLength: number = 200): string {
  // Check for <!-- more --> marker
  const moreIndex = content.indexOf('<!-- more -->')
  if (moreIndex !== -1) {
    const excerpt = content.substring(0, moreIndex)
    // Remove Markdown formatting
    return stripMarkdown(excerpt).trim()
  }

  // Otherwise take first maxLength characters
  const stripped = stripMarkdown(content)
  if (stripped.length <= maxLength) {
    return stripped
  }
  return stripped.substring(0, maxLength) + '...'
}

// Remove Markdown formatting
function stripMarkdown(content: string): string {
  return content
    // Remove headings
    .replace(/^#+\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove list markers
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    // Remove horizontal rules
    .replace(/^---+$/gm, '')
    // Remove extra blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// Format date
export function formatDate(dateStr: string, format: 'full' | 'short' | 'relative' = 'full'): string {
  const date = new Date(dateStr)
  
  if (format === 'relative') {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  if (format === 'short') {
    return `${month}-${day}`
  }
  
  return `${year}-${month}-${day}`
}

// Estimate reading time
export function estimateReadingTime(content: string): number {
  const words = content.length
  const wordsPerMinute = 300 // Reading speed ~300 chars/min
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}
