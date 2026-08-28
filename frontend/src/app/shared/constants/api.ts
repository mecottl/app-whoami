export const API_URL = 'http://localhost:3000'

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
