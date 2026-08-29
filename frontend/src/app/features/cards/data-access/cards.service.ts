// src/app/features/cards/data-access/cards.service.ts

import { Injectable } from '@angular/core'
import { ApiService } from '../../../core/services/api.service'
import {
  Card,
  CardCategory,
  Favorite,
  CreateCardPayload,
  UpdateCardPayload
} from '../../../shared/models/card.model'
import { FavoriteType } from '../../../shared/constants/favorite-types'

export type { CardCategory, Favorite } from '../../../shared/models/card.model'

export interface SearchResult {
  id: string
  title: string
  imageUrl: string | null
}

@Injectable({ providedIn: 'root' })
export class CardsService {
  constructor(private api: ApiService) {}

  // Cards
  getCards() {
    return this.api.get<Card[]>('/cards')
  }

  createCard(data: CreateCardPayload) {
    return this.api.post<Card, CreateCardPayload>('/cards', data)
  }

  getCardById(id: string) {
    return this.api.get<Card>(`/cards/${id}`)
  }

  updateCard(id: string, data: UpdateCardPayload) {
    return this.api.patch<Card, UpdateCardPayload>(`/cards/${id}`, data)
  }

  deleteCard(id: string) {
    return this.api.delete<void>(`/cards/${id}`)
  }

  // Categories
  getCategories(cardId: string) {
    return this.api.get<CardCategory[]>(`/cards/${cardId}/categories`)
  }

  createCategory(cardId: string, data: { name: string; type: FavoriteType }) {
    return this.api.post<CardCategory, { name: string; type: FavoriteType }>(
      `/cards/${cardId}/categories`,
      data
    )
  }

  deleteCategory(cardId: string, categoryId: string) {
    return this.api.delete<void>(`/cards/${cardId}/categories/${categoryId}`)
  }

  // Favorites
  getFavoritesByCategory(categoryId: string) {
    return this.api.get<Favorite[]>(`/categories/${categoryId}/favorites`)
  }

  addFavorite(categoryId: string, data: { title: string; imageUrl: string; externalId: string }) {
    return this.api.post<Favorite, typeof data>(`/categories/${categoryId}/favorites`, data)
  }

  deleteFavorite(categoryId: string, favoriteId: string) {
    return this.api.delete<void>(`/categories/${categoryId}/favorites/${favoriteId}`)
  }

  reorderFavorites(categoryId: string, items: { id: string; order: number }[]) {
    return this.api.patch<void, { items: { id: string; order: number }[] }>(
      `/categories/${categoryId}/favorites/reorder`,
      { items }
    )
  }

  // Search
  search(type: FavoriteType, query: string) {
    return this.api.get<SearchResult[]>(
      `/external/search?type=${type}&q=${encodeURIComponent(query)}`
    )
  }
}
