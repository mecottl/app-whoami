/**
 * Base del backend.
 *
 * - En local: http://localhost:3000
 * - En producción: mismo origen + `/api` (Vercel enruta /api/* al backend),
 *   salvo que se defina `window.__WHOAMI_API__` en index.html para apuntar
 *   a un backend en otro dominio (Railway, Render, …).
 */
function resolveApiUrl(): string {
  const override = (globalThis as unknown as { __WHOAMI_API__?: string })
    .__WHOAMI_API__
  if (typeof override === 'string' && override) return override.replace(/\/$/, '')

  if (typeof window === 'undefined') return 'http://localhost:3000'

  const host = window.location.hostname
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:3000'
  }
  return `${window.location.origin}/api`
}

export const API_URL = resolveApiUrl()

/**
 * Envuelve una URL de imagen externa con el proxy del backend.
 * Evita fallos de CORS al mostrarla y al exportar la card a PNG.
 */
export function imgProxy(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('data:')) return url
  if (url.startsWith(API_URL)) return url
  return `${API_URL}/external/img?url=${encodeURIComponent(url)}`
}
