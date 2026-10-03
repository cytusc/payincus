import { onUnmounted, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'
import { useConfigStore } from '@/stores/config'

interface SeoOptions {
  title: string
  description: string
  canonical?: string
  keywords?: string
  robots?: string
  ogType?: string
  image?: string
  /** 页面级结构化数据（schema.org）。传 null / 省略则不注入。 */
  jsonLd?: Record<string, unknown> | null
}

const PAGE_JSON_LD_ID = 'seo-page-json-ld'

const defaultTitle = typeof document !== 'undefined' ? document.title : 'HoyoVm'
const defaultDescription = typeof document !== 'undefined'
  ? (document.querySelector('meta[name="description"]') as HTMLMetaElement | null)?.content || ''
  : ''
const defaultKeywords = typeof document !== 'undefined'
  ? (document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null)?.content || ''
  : ''
const defaultRobots = typeof document !== 'undefined'
  ? (document.querySelector('meta[name="robots"]') as HTMLMetaElement | null)?.content || 'index,follow'
  : 'index,follow'
const defaultCanonical = typeof document !== 'undefined'
  ? (document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null)?.href || ''
  : ''

function toAbsoluteUrl(url: string): string {
  if (typeof window === 'undefined') {
    return url
  }
  return new URL(url, window.location.origin).href
}

function upsertMetaByName(name: string, content: string): void {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('name', name)
    document.head.appendChild(element)
  }

  element.content = content
}

function upsertMetaByProperty(property: string, content: string): void {
  let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('property', property)
    document.head.appendChild(element)
  }

  element.content = content
}

function upsertCanonical(href: string): void {
  let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }

  element.href = href
}

function upsertJsonLd(data: SeoOptions['jsonLd']): void {
  const existing = document.getElementById(PAGE_JSON_LD_ID)

  if (!data) {
    existing?.remove()
    return
  }

  let script = existing as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.id = PAGE_JSON_LD_ID
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }

  script.textContent = JSON.stringify(data)
}

function applySeo(options: SeoOptions): void {
  const configStore = useConfigStore()
  const brandName = configStore.brandName?.trim() || 'HoyoVm'
  const image = toAbsoluteUrl(options.image || configStore.brandLogoUrl?.trim() || '/hoyovm_logo.webp')
  const canonical = options.canonical || window.location.href
  const robots = options.robots || defaultRobots

  document.title = options.title
  upsertMetaByName('description', options.description)
  upsertMetaByName('keywords', options.keywords || defaultKeywords)
  upsertMetaByName('robots', robots)

  upsertMetaByProperty('og:site_name', brandName)
  upsertMetaByProperty('og:type', options.ogType || 'website')
  upsertMetaByProperty('og:title', options.title)
  upsertMetaByProperty('og:description', options.description)
  upsertMetaByProperty('og:url', canonical)
  upsertMetaByProperty('og:image', image)

  upsertMetaByName('twitter:card', 'summary_large_image')
  upsertMetaByName('twitter:title', options.title)
  upsertMetaByName('twitter:description', options.description)
  upsertMetaByName('twitter:image', image)

  upsertCanonical(canonical)
  upsertJsonLd(options.jsonLd ?? null)
}

function restoreDefaults(): void {
  if (typeof document === 'undefined') {
    return
  }

  const configStore = useConfigStore()
  const brandName = configStore.brandName?.trim() || 'HoyoVm'
  const brandSubtitle = configStore.brandSubtitle?.trim() || '全球多节点 NAT VPS 平台'
  const brandLogoUrl = toAbsoluteUrl(configStore.brandLogoUrl?.trim() || '/hoyovm_logo.webp')
  const title = defaultTitle.replace(/HoyoVm/g, brandName)
  const description = defaultDescription || brandSubtitle

  document.title = title
  upsertMetaByName('description', description)
  upsertMetaByName('keywords', defaultKeywords)
  upsertMetaByName('robots', defaultRobots)
  upsertMetaByProperty('og:site_name', brandName)
  upsertMetaByProperty('og:type', 'website')
  upsertMetaByProperty('og:title', title)
  upsertMetaByProperty('og:description', description)
  upsertMetaByProperty('og:url', window.location.href)
  upsertMetaByProperty('og:image', brandLogoUrl)
  upsertMetaByName('twitter:card', 'summary_large_image')
  upsertMetaByName('twitter:title', title)
  upsertMetaByName('twitter:description', description)
  upsertMetaByName('twitter:image', brandLogoUrl)
  upsertCanonical(defaultCanonical || window.location.href)
  upsertJsonLd(null)
}

export function usePageSeo(options: MaybeRefOrGetter<SeoOptions>): void {
  watchEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    applySeo(toValue(options))
  })

  onUnmounted(() => {
    restoreDefaults()
  })
}
