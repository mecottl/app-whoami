import { FavoriteType } from '../constants/favorite-types'

export type CardLayout = 'VERTICAL' | 'HORIZONTAL' | 'SQUARE'
export type CardTemplate = 'DARK' | 'LIGHT' | 'NEON' | 'MINIMAL'

export interface Favorite {
  id: string
  title: string
  imageUrl: string
  externalId: string
  order: number
}

export interface CardCategory {
  id: string
  name: string
  type: FavoriteType
  order: number
  favorites: Favorite[]
}

export interface Card {
  id: string
  name: string
  handle?: string | null
  location?: string | null
  description?: string | null
  birthDate: string
  favoriteColor?: string | null
  avatarUrl?: string | null
  layout: CardLayout
  template: CardTemplate
  createdAt?: string
  userId?: string
  categories?: CardCategory[]
}

export interface CreateCardPayload {
  name: string
  description?: string
  layout: CardLayout
  template: CardTemplate
  birthDate?: string
}

export interface UpdateCardPayload {
  name?: string
  handle?: string
  location?: string
  description?: string
  layout?: CardLayout
  template?: CardTemplate
  favoriteColor?: string
  avatarUrl?: string
}
