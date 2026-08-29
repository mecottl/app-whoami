import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  computed,
  signal
} from '@angular/core'
import { Card } from '../../../../shared/models/card.model'
import { CardFaceComponent } from '../card-face/card-face'
import { ageFromBirthDate } from '../../../../shared/utils/age'

const CANVAS: Record<string, { w: number; h: number }> = {
  VERTICAL: { w: 540, h: 960 },
  SQUARE: { w: 540, h: 540 },
  HORIZONTAL: { w: 960, h: 540 }
}

/** Miniatura no interactiva de una card (dashboard, landing, …). */
@Component({
  selector: 'app-card-thumb',
  standalone: true,
  imports: [CardFaceComponent],
  template: `
    <div #box class="thumb" [style.aspect-ratio]="spec().w + ' / ' + spec().h">
      @if (card$(); as c) {
        <div
          class="thumb-stage"
          [style.width.px]="spec().w"
          [style.height.px]="spec().h"
          [style.transform]="'scale(' + fit() + ')'"
        >
          <app-card-face [card]="c" [categories]="c.categories ?? []" [age]="age()" />
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }
      .thumb {
        width: 100%;
        min-width: 0;
        overflow: hidden;
        border-radius: var(--radius);
        background: var(--surface-2);
      }
      .thumb-stage {
        transform-origin: top left;
        pointer-events: none;
      }
    `
  ]
})
export class CardThumbComponent implements AfterViewInit, OnDestroy {
  private _card = signal<Card | null>(null)
  @Input({ required: true }) set card(v: Card) {
    this._card.set(v)
  }
  card$ = this._card.asReadonly()

  @ViewChild('box') boxRef?: ElementRef<HTMLElement>
  private w = signal(0)
  private ro?: ResizeObserver

  spec = computed(
    () => CANVAS[this._card()?.layout ?? 'VERTICAL'] ?? CANVAS['VERTICAL']
  )
  fit = computed(() => (this.w() > 0 ? this.w() / this.spec().w : 0.001))
  age = computed(() => ageFromBirthDate(this._card()?.birthDate))

  ngAfterViewInit() {
    const el = this.boxRef?.nativeElement
    if (!el) return
    this.ro = new ResizeObserver(() => {
      if (el.clientWidth > 0) this.w.set(el.clientWidth)
    })
    this.ro.observe(el)
    if (el.clientWidth > 0) this.w.set(el.clientWidth)
  }

  ngOnDestroy() {
    this.ro?.disconnect()
  }
}
