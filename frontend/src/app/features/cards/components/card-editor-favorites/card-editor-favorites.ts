import { Component, Input, OnInit, Output, EventEmitter, signal, computed } from '@angular/core'
import { CardsService, Favorite, SearchResult } from '../../data-access/cards.service'
import {
  FavoriteType,
  SEARCHABLE_FAVORITE_TYPES,
  SEARCH_PLACEHOLDERS
} from '../../../../shared/constants/favorite-types'
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop'
import { imgProxy } from '../../../../shared/constants/api'

@Component({
  selector: 'app-card-editor-favorites',
  standalone: true,
  templateUrl: './card-editor-favorites.html',
  styleUrl: './card-editor-favorites.css',
  imports: [DragDropModule]
})
export class CardEditorFavoritesComponent implements OnInit {
  @Input({ required: true }) categoryId!: string
  @Input({ required: true }) type!: FavoriteType
  @Output() updated = new EventEmitter<void>()

  favorites = signal<Favorite[]>([])
  searchQuery = signal('')
  searchResults = signal<SearchResult[]>([])
  searching = signal(false)
  searchError = signal('')

  canSearch = computed(() => SEARCHABLE_FAVORITE_TYPES.includes(this.type))
  full = computed(() => this.favorites().length >= 3)
  placeholder = computed(() => SEARCH_PLACEHOLDERS[this.type] ?? 'Buscar…')

  constructor(private cardsService: CardsService) {}

  img(url: string | null) {
    return imgProxy(url)
  }

  ngOnInit() {
    this.loadFavorites()
  }

  loadFavorites() {
    this.cardsService.getFavoritesByCategory(this.categoryId).subscribe({
      next: (res) => this.favorites.set([...res].sort((a, b) => a.order - b.order))
    })
  }

  search() {
    const q = this.searchQuery().trim()
    if (!q || !this.canSearch()) return

    this.searching.set(true)
    this.searchError.set('')
    this.cardsService.search(this.type, q).subscribe({
      next: (res) => {
        this.searchResults.set(res)
        this.searching.set(false)
      },
      error: (err) => {
        this.searching.set(false)
        const msg = err?.error?.message
        this.searchError.set(
          typeof msg === 'string' && msg ? msg : 'No se pudo buscar.'
        )
      }
    })
  }

  addFavorite(item: SearchResult) {
    if (this.full()) return
    this.cardsService
      .addFavorite(this.categoryId, {
        title: item.title,
        imageUrl: item.imageUrl ?? '',
        externalId: String(item.id)
      })
      .subscribe({
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

  drop(event: CdkDragDrop<Favorite[]>) {
    if (event.previousIndex === event.currentIndex) return

    const list = [...this.favorites()]
    moveItemInArray(list, event.previousIndex, event.currentIndex)
    list.forEach((item, i) => (item.order = i + 1))
    this.favorites.set(list)

    this.cardsService
      .reorderFavorites(
        this.categoryId,
        list.map((f) => ({ id: f.id, order: f.order }))
      )
      .subscribe({
        next: () => this.updated.emit(),
        error: () => this.loadFavorites()
      })
  }
}
