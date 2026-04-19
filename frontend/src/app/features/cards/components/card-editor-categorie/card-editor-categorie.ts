// src/app/features/cards/components/card-editor-category/card-editor-category.ts

import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CardEditorFavoritesComponent } from '../card-editor-favorites/card-editor-favorites'
import { FavoriteType } from '../../../../shared/constants/favorite-types'

@Component({
  selector: 'app-card-editor-category',
  standalone: true,
  imports: [CardEditorFavoritesComponent],
  template: `
    <div>
      <h3>{{ category.name }}</h3>

      <button (click)="onRemove()">Eliminar</button>

      <app-card-editor-favorites
        [categoryId]="category.id"
        [type]="category.type"
      />
    </div>
  `
})
export class CardEditorCategoryComponent {
  @Input() category!: any
  @Output() remove = new EventEmitter<string>()
  @Output() refresh = new EventEmitter<void>()

  onRemove() {
    this.remove.emit(this.category.id)
  }
}