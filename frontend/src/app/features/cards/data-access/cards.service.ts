// src/app/features/cards/data-access/cards.service.ts

import { Injectable } from '@angular/core'
import { ApiService } from '../../../core/services/api.service'
import { Card, CreateCardPayload } from '../../../shared/models/card.model'

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  constructor(private api: ApiService) { }

  // 🧾 Cards
  getCards() {
    return this.api.get<Card[]>('/cards')
  }

  createCard(data: CreateCardPayload) {
    return this.api.post<Card, CreateCardPayload>('/cards', data)
  }

  getCardById(id: string) {
    return this.api.get<Card>(`/cards/${id}`)
  }

  updateCard(id: string, data: Partial<CreateCardPayload>) {
    return this.api.patch<Card, Partial<CreateCardPayload>>(`/cards/${id}`, data)
  }

  // 🗂️ Categories
  getCategories(cardId: string) {
    return this.api.get<any[]>(`/cards/${cardId}/categories`)
  }

  createCategory(cardId: string, data: any) {
    return this.api.post(`/cards/${cardId}/categories`, data)
  }

  deleteCategory(cardId: string, categoryId: string) {
    return this.api.delete(`/cards/${cardId}/categories/${categoryId}`)
  }

  // ⭐ Favorites (NUEVO)
  getFavoritesByCategory(categoryId: string) {
    return this.api.get<any[]>(`/categories/${categoryId}/favorites`)
  }

  addFavorite(categoryId: string, data: any) {
    return this.api.post(`/categories/${categoryId}/favorites`, data)
  }

  deleteFavorite(categoryId: string, favoriteId: string) {
    return this.api.delete(`/categories/${categoryId}/favorites/${favoriteId}`)
  }

  // 🔍 Search
  searchMovies(query: string) {
    return this.api.get<any[]>(`/external/movies/search?q=${query}`)
  }

  searchAlbums(query: string) {
    return this.api.get<any[]>(`/external/albums/search?q=${query}`)
  }

  updateFavoriteOrder(categoryId: string, id: string, order: number) {
    return this.api.patch(`/categories/${categoryId}/favorites/${id}/order`, { order })
  }

  reorderFavorites(categoryId: string, items: { id: string; order: number }[]) {
    return this.api.patch(
      `/categories/${categoryId}/favorites/reorder`,
      { items }
    )
  }
}