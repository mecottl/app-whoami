// src/app/features/cards/components/card-preview/card-preview.ts

import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-card-preview',
  standalone: true,
  templateUrl: './card-preview.html'
})
export class CardPreviewComponent {
  @Input() card!: any
  @Input() categories: any[] = []
}