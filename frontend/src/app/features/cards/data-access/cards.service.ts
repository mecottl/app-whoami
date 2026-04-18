import { Injectable } from '@angular/core'
import { ApiService } from '../../../core/services/api.service'
import { Card, CreateCardPayload } from '../../../shared/models/card.model'

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  constructor(private api: ApiService) { }

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

  getFavorites(cardId: string) {
    return this.api.get(`/cards/${cardId}/favorites`)
  }

  addFavorite(cardId: string, data: any) {
    return this.api.post(`/cards/${cardId}/favorites`, data)
  }

  deleteFavorite(cardId: string, favoriteId: string) {
    return this.api.delete(`/cards/${cardId}/favorites/${favoriteId}`)
  }

  searchMovies(query: string) {
    return this.api.get<any[]>(`/external/movies/search?q=${query}`)
  }

  searchAlbums(query: string) {
    return this.api.get<any[]>(`/external/albums/search?q=${query}`)
  }

}
