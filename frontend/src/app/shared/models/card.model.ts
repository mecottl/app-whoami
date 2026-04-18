export type CardLayout = 'VERTICAL' | 'HORIZONTAL' | 'SQUARE'
export type CardTemplate = 'DARK' | 'LIGHT' | 'NEON' | 'MINIMAL'

export interface Card {
  id: string
  name: string
  description: string
  birthDate: string
  layout: CardLayout
  template: CardTemplate
  createdAt?: string
  userId?: string
}

export interface CreateCardPayload {
  name: string
  description: string
  birthDate: string
  layout: CardLayout
  template: CardTemplate
}
