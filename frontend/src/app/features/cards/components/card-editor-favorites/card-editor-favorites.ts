import { Component, Input, signal, OnInit, Output, EventEmitter } from '@angular/core'
import { CardsService } from '../../data-access/cards.service'
import { FavoriteType } from '../../../../shared/constants/favorite-types'
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop'
import { NgFor } from '@angular/common'

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
  templateUrl: './card-editor-favorites.html',
  imports: [NgFor, DragDropModule]
})
export class CardEditorFavoritesComponent implements OnInit {
  @Input() categoryId!: string
  @Input() type!: FavoriteType
  @Output() updated = new EventEmitter<void>()

  favorites = signal<FavoriteItem[]>([])

  searchQuery = signal('')
  searchResults = signal<SearchResultItem[]>([])

  constructor(private cardsService: CardsService) { }

  ngOnInit() {
    this.loadFavorites()
  }

  loadFavorites() {
    this.cardsService.getFavoritesByCategory(this.categoryId).subscribe({
      next: (res) => {
        const sorted = [...res].sort((a, b) => a.order - b.order)
        this.favorites.set(sorted)
      }
    })
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
    const order = this.favorites().length + 1

    if (order > 3) return

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
        this.searchQuery.set('')
        this.searchResults.set([])
      }
    })
  }

  removeFavorite(id: string) {
    this.cardsService.deleteFavorite(this.categoryId, id).subscribe({
      next: () => {
        this.loadFavorites()
        this.updated.emit()
      }
    })
  }

  drop(event: CdkDragDrop<FavoriteItem[]>) {
    if (event.previousIndex === event.currentIndex) return

    const list = [...this.favorites()]

    moveItemInArray(list, event.previousIndex, event.currentIndex)

    list.forEach((item, index) => {
      item.order = index + 1
    })

    this.favorites.set(list)

    this.cardsService.reorderFavorites(this.categoryId, list)
      .subscribe()
  }
}
