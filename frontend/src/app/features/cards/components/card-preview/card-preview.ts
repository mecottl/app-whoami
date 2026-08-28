import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  ViewChild,
  computed,
  signal
} from '@angular/core'
import { Card } from '../../../../shared/models/card.model'
import { CardCategory } from '../../data-access/cards.service'
import { CardFaceComponent } from '../card-face/card-face'

interface LayoutSpec {
  w: number
  h: number
  exportScale: number
}

const LAYOUTS: Record<string, LayoutSpec> = {
  VERTICAL: { w: 540, h: 960, exportScale: 2 },
  SQUARE: { w: 540, h: 540, exportScale: 2 },
  HORIZONTAL: { w: 960, h: 540, exportScale: 2 }
}

@Component({
  selector: 'app-card-preview',
  standalone: true,
  imports: [CardFaceComponent],
  templateUrl: './card-preview.html',
  styleUrl: './card-preview.css'
})
export class CardPreviewComponent implements AfterViewInit, OnDestroy {
  private _card = signal<Card | null>(null)
  private _categories = signal<CardCategory[]>([])

  @Input({ required: true }) set card(v: Card) {
    this._card.set(v)
  }
  @Input() set categories(v: CardCategory[]) {
    this._categories.set(v ?? [])
  }
  @Input() age: number | null = null

  @ViewChild('slot') slotRef?: ElementRef<HTMLElement>
  @ViewChild('stage') stageRef?: ElementRef<HTMLElement>

  card$ = this._card.asReadonly()
  categories$ = this._categories.asReadonly()

  private slotW = signal(0)
  private slotH = signal(0)

  modalFit = signal(1)
  modalOpen = signal(false)
  busy = signal(false)
  error = signal('')
  shareOk = signal(false)

  private ro?: ResizeObserver

  spec = computed<LayoutSpec>(
    () => LAYOUTS[this._card()?.layout ?? 'VERTICAL'] ?? LAYOUTS['VERTICAL']
  )

  fit = computed(() => {
    const w = this.slotW()
    if (w <= 0) return 1
    const byW = w / this.spec().w
    const h = this.slotH()
    return h > 0 ? Math.min(byW, h / this.spec().h) : byW
  })

  dims = computed(() => ({
    w: Math.round(this.spec().w * this.fit()),
    h: Math.round(this.spec().h * this.fit())
  }))

  ngAfterViewInit() {
    const slot = this.slotRef?.nativeElement
    if (!slot) return
    this.ro = new ResizeObserver(() => this.measure())
    this.ro.observe(slot)
    this.measure()
  }

  ngOnDestroy() {
    this.ro?.disconnect()
  }

  private measure() {
    const slot = this.slotRef?.nativeElement
    if (!slot) return
    if (slot.clientWidth > 0) this.slotW.set(slot.clientWidth)
    this.slotH.set(slot.clientHeight)
  }

  openModal() {
    this.error.set('')
    this.shareOk.set(false)
    this.recalcModalFit()
    this.modalOpen.set(true)
  }

  closeModal() {
    this.modalOpen.set(false)
  }

  @HostListener('window:resize')
  onResize() {
    this.measure()
    if (this.modalOpen()) this.recalcModalFit()
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.modalOpen()) this.closeModal()
  }

  private recalcModalFit() {
    const { w, h } = this.spec()
    const availW = Math.min(window.innerWidth - 48, 900)
    const availH = window.innerHeight - 220
    this.modalFit.set(Math.min(availW / w, availH / h, 1.4))
  }

  private async render(): Promise<Blob> {
    const stage = this.stageRef!.nativeElement
    const { w, h, exportScale } = this.spec()
    const { domToBlob } = await import('modern-screenshot')
    const blob = await domToBlob(stage, {
      width: w,
      height: h,
      scale: exportScale,
      style: { transform: 'none' }
    })
    if (!blob) throw new Error('sin blob')
    return blob
  }

  private fileName() {
    const n = this._card()?.name || 'whoami'
    return `${n.replace(/\s+/g, '-').toLowerCase()}-card.png`
  }

  async share() {
    if (this.busy()) return
    this.busy.set(true)
    this.error.set('')
    this.shareOk.set(false)
    try {
      const blob = await this.render()
      const file = new File([blob], this.fileName(), { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Mi card de WhoAmI Studio' })
        this.shareOk.set(true)
      } else {
        this.downloadBlob(blob)
      }
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        this.error.set('No se pudo compartir la imagen.')
      }
    } finally {
      this.busy.set(false)
    }
  }

  async download() {
    if (this.busy()) return
    this.busy.set(true)
    this.error.set('')
    try {
      this.downloadBlob(await this.render())
    } catch {
      this.error.set('No se pudo generar la imagen.')
    } finally {
      this.busy.set(false)
    }
  }

  private downloadBlob(blob: Blob) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = this.fileName()
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}
