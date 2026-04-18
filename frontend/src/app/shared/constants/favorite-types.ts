// favorite-types.ts
export const FAVORITE_TYPES = {
  MOVIE: 'MOVIE',
  MUSIC: 'MUSIC',
  SERIES: 'SERIES',
  BOOK: 'BOOK',
  GAME: 'GAME'
    
} as const

export type FavoriteType = typeof FAVORITE_TYPES[keyof typeof FAVORITE_TYPES]