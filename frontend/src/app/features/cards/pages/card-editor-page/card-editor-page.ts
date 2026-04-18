import { Component, OnInit, computed, signal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { CardsService } from '../../data-access/cards.service'
import { FAVORITE_TYPES } from '../../../../shared/constants/favorite-types'

@Component({
  selector: 'app-card-editor',
  standalone: true,
  templateUrl: './card-editor-page.html',
  styleUrl: './card-editor-page.css'
})
export class CardEditorPage implements OnInit {
  id: string | null = null

  card = signal<any>(null)
  loading = signal(true)
  favorites = signal<any[]>([])
  searchResults = signal<any[]>([])
  searchQuery = signal('')
  searchType = signal<'MOVIE' | 'MUSIC'>(FAVORITE_TYPES.MOVIE)
  favoriteTypes = Object.values(FAVORITE_TYPES)

  private searchHandlers = {
    MOVIE: (query: string) => this.cardsService.searchMovies(query),
    MUSIC: (query: string) => this.cardsService.searchAlbums(query)
  }

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
      },
      error: () => {
        this.loading.set(false)
      }
    })

    this.cardsService.getFavorites(this.id).subscribe({
      next: (res) => {
        this.favorites.set(res as any)
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

    const { name, description, favoriteColor, layout, template } = this.card()

    const payload = {
      name,
      description,
      favoriteColor,
      layout,
      template
    }

    this.cardsService.updateCard(this.id, payload).subscribe({
      next: (res) => {
        this.card.set(res)
        console.log('guardado')
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  search() {
    const q = this.searchQuery()
    const type = this.searchType()

    if (!q) return

    const handler = this.searchHandlers[type]

    if (!handler) {
      console.log('No handler for type:', type)
      return
    }

    handler(q).subscribe((res) => {
      this.searchResults.set(res)
    })
  }

  addFavorite(item: any) {
    if (!this.id) return

    const type = this.searchType()
    const current = this.favorites().filter((favorite) => favorite.type === type)
    const order = [1, 2, 3].find(
      (slot) => !current.some((favorite) => favorite.order === slot)
    )

    if (!order) {
      console.log('maximo 3 favoritos por tipo')
      return
    }

    const payload = {
      title: item.title,
      imageUrl: item.imageUrl,
      externalId: String(item.id),
      type,
      order
    }

    this.cardsService.addFavorite(this.id, payload).subscribe((res) => {
      this.favorites.set([...this.favorites(), res])
    })
  }

  removeFavorite(favoriteId: string) {
    if (!this.id) return

    this.cardsService.deleteFavorite(this.id, favoriteId).subscribe(() => {
      this.favorites.set(
        this.favorites().filter((favorite) => favorite.id !== favoriteId)
      )
    })
  }

  groupedFavorites = computed(() => {
    const groups: Record<string, any[]> = {}

    for (const favorite of this.favorites()) {
      if (!groups[favorite.type]) {
        groups[favorite.type] = []
      }

      groups[favorite.type].push(favorite)
    }

    return groups
  })
}
