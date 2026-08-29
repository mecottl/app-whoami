import {
  Component,
  ElementRef,
  Input,
  afterNextRender,
  computed,
  effect,
  inject,
  signal
} from '@angular/core'
import { Card, CardCategory } from '../../../../shared/models/card.model'
import { imgProxy } from '../../../../shared/constants/api'

/** Alto útil (px) del lienzo por layout, descontando el padding vertical. */
const CANVAS: Record<string, { h: number; padY: number }> = {
  VERTICAL: { h: 960, padY: 92 },
  SQUARE: { h: 540, padY: 76 },
  HORIZONTAL: { h: 540, padY: 80 }
}

@Component({
  selector: 'app-card-face',
  standalone: true,
  templateUrl: './card-face.html',
  styleUrl: './card-face.css'
})
export class CardFaceComponent {
  private host = inject(ElementRef<HTMLElement>)

  private _card = signal<Card | null>(null)
  private _categories = signal<CardCategory[]>([])
  private _age = signal<number | null>(null)

  @Input({ required: true }) set card(v: Card) {
    this._card.set(v)
  }
  @Input() set categories(v: CardCategory[]) {
    this._categories.set(v ?? [])
  }
  @Input() set age(v: number | null) {
    this._age.set(v)
  }

  card$ = this._card.asReadonly()

  private layout = computed(() => this._card()?.layout ?? 'VERTICAL')

  private static readonly KNOWN_TEMPLATES = new Set([
    'DARK', 'LIGHT', 'MINIMAL', 'PRESS', 'COMIC', 'FUTURE', 'VINTAGE',
    'GLASS', 'RETRO', 'PIXEL', 'Y2K', 'SWISS', 'GRAFFITI'
  ])

  // "Vector" se fusionó con "Cómic": misma plantilla.
  private static readonly TEMPLATE_ALIASES: Record<string, string> = {
    VECTOR: 'COMIC',
    NEON: 'LIGHT'
  }

  template = computed(() => {
    const raw = this._card()?.template ?? 'DARK'
    const t = CardFaceComponent.TEMPLATE_ALIASES[raw] ?? raw
    return CardFaceComponent.KNOWN_TEMPLATES.has(t) ? t : 'LIGHT'
  })
  layoutClass = computed(() => `layout-${this.layout().toLowerCase()}`)
  themeClass = computed(() => `tpl-${this.template().toLowerCase()}`)
  populated = computed(() =>
    this._categories().filter((c) => c.favorites?.length)
  )

  cols = computed(() => {
    const n = this.populated().length
    const l = this.layout()
    if ((l === 'SQUARE' || l === 'HORIZONTAL') && n >= 3) return 2
    return 1
  })

  /** Ajuste fino tras medir: si el contenido se sale, se encoge. */
  private fitScale = signal(1)

  /** Estimación inicial del font-size (todo el interior está en `em`). */
  private baseFontSize = computed(() => {
    const cats = this.populated()
    const n = cats.length
    if (n === 0) return 15

    const { h, padY } = CANVAS[this.layout()]
    const cols = this.cols()
    const rows = Math.ceil(n / cols)
    const favsPerRow = Math.max(
      ...chunk(cats, cols).map((row) =>
        Math.max(...row.map((c) => c.favorites?.length ?? 0))
      )
    )

    let em = this.layout() === 'HORIZONTAL' ? 2 : 5.5
    if (this._card()?.description) em += 5
    em += rows * (2.3 + favsPerRow * 2.9)
    em += (rows - 1) * 1.9

    const scale = (h - padY) / (em * 15)
    return clamp(15 * scale, 9, 19)
  })

  fontSize = computed(() =>
    Math.round(this.baseFontSize() * this.fitScale() * 100) / 100
  )

  constructor() {
    afterNextRender(() => this.startRefit())
    // reinicia el ajuste cuando cambia el contenido
    effect(() => {
      this._card()
      this._categories()
      this._age()
      this.fitScale.set(1)
      queueMicrotask(() => this.startRefit())
    })
  }

  private startRefit(pass = 0) {
    const card = this.host.nativeElement.querySelector(
      '.wa-card'
    ) as HTMLElement | null
    if (!card || pass > 6) return

    const over = card.scrollHeight - card.clientHeight
    if (over > 2) {
      const ratio = card.clientHeight / card.scrollHeight
      const next = Math.max(0.42, this.fitScale() * ratio * 0.97)
      if (next < this.fitScale() - 0.005) {
        this.fitScale.set(next)
        requestAnimationFrame(() => this.startRefit(pass + 1))
      }
    }
  }

  initials = computed(() => {
    const nm = this._card()?.name?.trim() ?? ''
    if (!nm) return '?'
    return nm
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('')
  })

  handleText = computed(() => {
    const h = this._card()?.handle?.trim()
    if (!h) return ''
    return h.startsWith('@') ? h : `@${h}`
  })

  metaBits = computed(() => {
    const c = this._card()
    const bits: string[] = []
    if (c?.location?.trim()) bits.push(c.location.trim())
    const age = this._age()
    if (age != null) bits.push(`${age} años`)
    return bits
  })

  img(url: string) {
    return imgProxy(url)
  }
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}
