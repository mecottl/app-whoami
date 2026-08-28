import { Injectable, signal } from '@angular/core'

export type ThemePref = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly pref = signal<ThemePref>(this.read())

  constructor() {
    this.apply(this.pref())

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (this.pref() === 'system') this.apply('system')
      })
  }

  set(pref: ThemePref) {
    this.pref.set(pref)
    try {
      localStorage.setItem(STORAGE_KEY, pref)
    } catch {
      /* almacenamiento no disponible */
    }
    this.apply(pref)
  }

  /** Alterna claro <-> oscuro tomando en cuenta el tema efectivo actual. */
  toggle() {
    this.set(this.resolved() === 'dark' ? 'light' : 'dark')
  }

  /** Tema realmente aplicado ahora mismo. */
  resolved(): 'light' | 'dark' {
    const pref = this.pref()
    if (pref === 'light' || pref === 'dark') return pref
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  private apply(pref: ThemePref) {
    const root = document.documentElement
    if (pref === 'system') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', pref)
    }
  }

  private read(): ThemePref {
    try {
      const v = localStorage.getItem(STORAGE_KEY)
      if (v === 'light' || v === 'dark' || v === 'system') return v
    } catch {
      /* ignore */
    }
    return 'system'
  }
}
