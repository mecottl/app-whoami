export type CardLayout = 'VERTICAL' | 'HORIZONTAL' | 'SQUARE'
export type CardTemplate = 'DARK' | 'LIGHT' | 'NEON' | 'MINIMAL'

export interface Card {
  id: string
  name: string
  description?: string | null
  birthDate: string
  favoriteColor?: string | null
  avatarUrl?: string | null
  layout: CardLayout
  template: CardTemplate
  createdAt?: string
  userId?: string
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
  description?: string
  layout?: CardLayout
  template?: CardTemplate
  favoriteColor?: string
  avatarUrl?: string
}
