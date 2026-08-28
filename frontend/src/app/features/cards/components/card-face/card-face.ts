import { Component, Input, computed, signal } from '@angular/core'
import { Card } from '../../../../shared/models/card.model'
import { CardCategory } from '../../data-access/cards.service'
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
  private _card = signal<Card | null>(null)
  private _categories = signal<CardCategory[]>([])

  @Input({ required: true }) set card(v: Card) {
    this._card.set(v)
  }
  @Input() set categories(v: CardCategory[]) {
    this._categories.set(v ?? [])
  }
  @Input() age: number | null = null

  card$ = this._card.asReadonly()

  private layout = computed(() => this._card()?.layout ?? 'VERTICAL')

  layoutClass = computed(() => `layout-${this.layout().toLowerCase()}`)
  themeClass = computed(
    () => `tpl-${(this._card()?.template ?? 'DARK').toLowerCase()}`
  )
  populated = computed(() =>
    this._categories().filter((c) => c.favorites?.length)
  )

  /** Nº de columnas para la rejilla de categorías. */
  cols = computed(() => {
    const n = this.populated().length
    const l = this.layout()
    if ((l === 'SQUARE' || l === 'HORIZONTAL') && n >= 3) return 2
    return 1
  })

  /**
   * font-size dinámico del `.wa-card`: todo el interior usa `em`, así que
   * este número escala la card entera para que quepan las categorías.
   */
  fontSize = computed(() => {
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

    // altura estimada del contenido en "em" a font-size 15
    let em = this.layout() === 'HORIZONTAL' ? 0 : 5 // header (en horizontal va aparte)
    if (this._card()?.description) em += 4.8 // hasta 3 líneas
    em += rows * (2.1 + favsPerRow * 2.7) // por fila: título + favoritos
    em += (rows - 1) * 1.6 // separación entre filas

    const availPx = this.layout() === 'HORIZONTAL' ? h - padY : h - padY
    const scale = availPx / (em * 15)
    return clamp(15 * scale, 10.5, 18)
  })

  initials = computed(() => {
    const nm = this._card()?.name?.trim() ?? ''
    if (!nm) return '?'
    return nm
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('')
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
