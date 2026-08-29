// Debe coincidir EXACTAMENTE con el enum FavoriteType de backend/prisma/schema.prisma
export const FAVORITE_TYPES = {
  MOVIE: 'MOVIE',
  SERIES: 'SERIES',
  ANIME: 'ANIME',
  MUSIC: 'MUSIC',
  ARTIST: 'ARTIST',
  BOOK: 'BOOK',
  GAME: 'GAME',
  SPORT: 'SPORT'
} as const

export type FavoriteType = (typeof FAVORITE_TYPES)[keyof typeof FAVORITE_TYPES]

// Todas tienen búsqueda en el backend (GAME necesita RAWG_API_KEY configurada).
export const SEARCHABLE_FAVORITE_TYPES: FavoriteType[] = [
  FAVORITE_TYPES.MOVIE,
  FAVORITE_TYPES.SERIES,
  FAVORITE_TYPES.ANIME,
  FAVORITE_TYPES.MUSIC,
  FAVORITE_TYPES.ARTIST,
  FAVORITE_TYPES.BOOK,
  FAVORITE_TYPES.GAME,
  FAVORITE_TYPES.SPORT
]

export const TYPE_LABELS: Record<FavoriteType, string> = {
  MOVIE: 'Películas',
  SERIES: 'Series',
  ANIME: 'Anime',
  MUSIC: 'Discos',
  ARTIST: 'Artistas',
  BOOK: 'Libros',
  GAME: 'Juegos',
  SPORT: 'Deportes'
}

export const SEARCH_PLACEHOLDERS: Record<FavoriteType, string> = {
  MOVIE: 'Buscar película…',
  SERIES: 'Buscar serie…',
  ANIME: 'Buscar anime…',
  MUSIC: 'Buscar álbum…',
  ARTIST: 'Buscar artista…',
  BOOK: 'Buscar libro…',
  GAME: 'Buscar juego…',
  SPORT: 'Buscar equipo…'
}
