// src/app/features/cards/pages/card-editor-page/card-editor-page.ts

import { Component, OnInit, signal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { CardsService } from '../../data-access/cards.service'
import { FAVORITE_TYPES, FavoriteType } from '../../../../shared/constants/favorite-types'
import { CardEditorFavoritesComponent } from '../../components/card-editor-favorites/card-editor-favorites'

@Component({
  selector: 'app-card-editor',
  standalone: true,
  imports: [CardEditorFavoritesComponent],
  templateUrl: './card-editor-page.html'
})
export class CardEditorPage implements OnInit {
  id: string | null = null

  card = signal<any>(null)
  loading = signal(true)

  activeCategories = signal<FavoriteType[]>([])
  selectedCategoryToAdd = signal<FavoriteType>(FAVORITE_TYPES.MOVIE)

  favoriteTypes = Object.values(FAVORITE_TYPES)

  constructor(
    private route: ActivatedRoute,
    private cardsService: CardsService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')
    if (!this.id) return

    this.cardsService.getCardById(this.id).subscribe({
      next: (data) => {
        this.card.set(data)
        this.loading.set(false)
      }
    })
  }

  updateField(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).value

    this.card.set({
      ...this.card(),
      [field]: value
    })
  }

  save() {
    if (!this.id || !this.card()) return

    const payload = this.card()

    this.cardsService.updateCard(this.id, payload).subscribe({
      next: (res) => {
        this.card.set(res)
        console.log('guardado')
      }
    })
  }

  addCategory() {
    const type = this.selectedCategoryToAdd()

    if (this.activeCategories().includes(type)) return
    if (this.activeCategories().length >= 3) return

    this.activeCategories.set([...this.activeCategories(), type])
  }

  removeCategory(type: FavoriteType) {
    this.activeCategories.set(
      this.activeCategories().filter(t => t !== type)
    )
  }
}