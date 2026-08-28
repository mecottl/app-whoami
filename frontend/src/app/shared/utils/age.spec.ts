import { describe, it, expect, vi, afterEach } from 'vitest'
import { ageFromBirthDate } from './age'

describe('ageFromBirthDate', () => {
  afterEach(() => vi.useRealTimers())

  it('devuelve null para entradas vacías o inválidas', () => {
    expect(ageFromBirthDate(null)).toBeNull()
    expect(ageFromBirthDate('')).toBeNull()
    expect(ageFromBirthDate('no-es-fecha')).toBeNull()
  })

  it('calcula la edad en UTC (no cambia por zona horaria)', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-20T04:00:00Z')) // medianoche en UTC-4
    // cumple justo hoy
    expect(ageFromBirthDate('2000-05-20T00:00:00.000Z')).toBe(26)
    // cumple mañana
    expect(ageFromBirthDate('2000-05-21T00:00:00.000Z')).toBe(25)
  })
})
