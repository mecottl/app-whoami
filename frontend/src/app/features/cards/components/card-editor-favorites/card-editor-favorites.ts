// src/app/features/cards/components/card-editor-favorites/card-editor-favorites.ts

import { Component, Input, signal, OnInit, Output, EventEmitter } from '@angular/core'
import { CardsService } from '../../data-access/cards.service'
import { FavoriteType } from '../../../../shared/constants/favorite-types'

type FavoriteItem = {
  id: string
  title: string
  imageUrl: string
  externalId: string
  order: number
}

type SearchResultItem = {
  id: string | number
  title: string
  imageUrl: string
}

@Component({
  selector: 'app-card-editor-favorites',
  standalone: true,
  templateUrl: './card-editor-favorites.html'
})
export class CardEditorFavoritesComponent implements OnInit {
  @Input() categoryId!: string
  @Input() type!: FavoriteType
  @Output() updated = new EventEmitter<void>()

  favorites = signal<FavoriteItem[]>([])

  searchQuery = signal('')
  searchResults = signal<SearchResultItem[]>([])

  selectedSlot = signal<number | null>(null)

  constructor(private cardsService: CardsService) { }

  ngOnInit() {
    this.loadFavorites()
  }

  loadFavorites() {
    this.cardsService.getFavoritesByCategory(this.categoryId).subscribe({
      next: (res) => this.favorites.set(res)

    })
  }

  selectSlot(slot: number) {
    this.selectedSlot.set(slot)
  }

  search() {
    const q = this.searchQuery()
    if (!q) return

    const handler =
      this.type === 'MOVIE'
        ? this.cardsService.searchMovies(q)
        : this.type === 'MUSIC'
          ? this.cardsService.searchAlbums(q)
          : null

    if (!handler) return

    handler.subscribe((res: SearchResultItem[]) => {
      this.searchResults.set(res)
    })
  }

  addFavorite(item: SearchResultItem) {
    const order = this.selectedSlot()
    if (!order) return

    const payload = {
      title: item.title,
      imageUrl: item.imageUrl,
      externalId: String(item.id),
      order
    }

    this.cardsService.addFavorite(this.categoryId, payload).subscribe({
      next: () => {
        this.loadFavorites()
        this.updated.emit()
        this.selectedSlot.set(null)
        this.searchQuery.set('')
        this.searchResults.set([])
      }
    })
  }

  removeFavorite(id: string) {
    this.cardsService.deleteFavorite(this.categoryId,id).subscribe({
      next: () => {
        this.loadFavorites()
        this.updated.emit()
      }
    })
  }

  getSlots() {
    return [1, 2, 3].map(order =>
      this.favorites().find(f => f.order === order) || null
    )
  }
}