/**
 * Edad en años a partir de una fecha ISO. Usa componentes UTC para que
 * `1998-05-20T00:00:00Z` no se convierta en el día 19 en zonas negativas.
 */
export function ageFromBirthDate(iso: string | null | undefined): number | null {
  if (!iso) return null
  const b = new Date(iso)
  if (isNaN(b.getTime())) return null

  const now = new Date()
  let age = now.getUTCFullYear() - b.getUTCFullYear()
  const m = now.getUTCMonth() - b.getUTCMonth()
  if (m < 0 || (m === 0 && now.getUTCDate() < b.getUTCDate())) age--
  return age >= 0 ? age : null
}
