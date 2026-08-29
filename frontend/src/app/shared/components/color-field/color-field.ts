import { Component, ElementRef, Input, Output, EventEmitter, ViewChild } from '@angular/core'

const SWATCHES = [
  '#1330e6', // cobalto
  '#0f766e', // teal
  '#166534', // bosque
  '#7c2d12', // óxido
  '#9d174d', // ciruela
  '#b45309', // ámbar
  '#dc2626', // rojo
  '#db2777', // fucsia
  '#4338ca', // índigo
  '#334155', // pizarra
  '#111111' // tinta
]

@Component({
  selector: 'app-color-field',
  standalone: true,
  templateUrl: './color-field.html',
  styleUrl: './color-field.css'
})
export class ColorFieldComponent {
  @Input() color = '#1330e6'
  @Output() colorChange = new EventEmitter<string>()

  @ViewChild('native') nativeInput?: ElementRef<HTMLInputElement>

  readonly swatches = SWATCHES

  isCustom() {
    return !this.swatches.some(
      (s) => s.toLowerCase() === (this.color ?? '').toLowerCase()
    )
  }

  pick(hex: string) {
    this.color = hex
    this.colorChange.emit(hex)
  }

  openNative() {
    this.nativeInput?.nativeElement.click()
  }

  onNative(event: Event) {
    this.pick((event.target as HTMLInputElement).value)
  }
}
