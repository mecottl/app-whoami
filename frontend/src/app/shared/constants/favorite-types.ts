// Debe coincidir EXACTAMENTE con el enum FavoriteType de backend/prisma/schema.prisma
export const FAVORITE_TYPES = {
  MOVIE: 'MOVIE',
  MUSIC: 'MUSIC',
  SERIES: 'SERIES',
  BOOK: 'BOOK',
  GAME: 'GAME',
  SPORT: 'SPORT'
} as const

export type FavoriteType = (typeof FAVORITE_TYPES)[keyof typeof FAVORITE_TYPES]

// Todas tienen búsqueda en el backend (GAME necesita RAWG_API_KEY configurada).
export const SEARCHABLE_FAVORITE_TYPES: FavoriteType[] = [
  FAVORITE_TYPES.MOVIE,
  FAVORITE_TYPES.SERIES,
  FAVORITE_TYPES.MUSIC,
  FAVORITE_TYPES.BOOK,
  FAVORITE_TYPES.GAME,
  FAVORITE_TYPES.SPORT
]

export const TYPE_LABELS: Record<FavoriteType, string> = {
  MOVIE: 'Películas',
  MUSIC: 'Música',
  SERIES: 'Series',
  BOOK: 'Libros',
  GAME: 'Juegos',
  SPORT: 'Deportes'
}

export const SEARCH_PLACEHOLDERS: Record<FavoriteType, string> = {
  MOVIE: 'Buscar película…',
  MUSIC: 'Buscar álbum…',
  SERIES: 'Buscar serie…',
  BOOK: 'Buscar libro…',
  GAME: 'Buscar juego…',
  SPORT: 'Buscar equipo…'
}
