import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CardEditorFavoritesComponent } from '../card-editor-favorites/card-editor-favorites'
import { CardCategory } from '../../data-access/cards.service'

@Component({
  selector: 'app-card-editor-category',
  standalone: true,
  imports: [CardEditorFavoritesComponent],
  templateUrl: './card-editor-categorie.html',
  styleUrl: './card-editor-categorie.css'
})
export class CardEditorCategoryComponent {
  @Input({ required: true }) category!: CardCategory
  @Output() remove = new EventEmitter<string>()
  @Output() updated = new EventEmitter<void>()
}
