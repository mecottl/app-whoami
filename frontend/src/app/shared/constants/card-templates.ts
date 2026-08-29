import { CardLayout, CardTemplate } from '../models/card.model'

export const CARD_TEMPLATES: { value: CardTemplate; label: string; hint: string }[] = [
  { value: 'DARK', label: 'Ficha', hint: 'catálogo, monoespaciada' },
  { value: 'LIGHT', label: 'Editorial', hint: 'perfil de revista' },
  { value: 'SWISS', label: 'Suizo', hint: 'rejilla, sans, sin adornos' },
  { value: 'MINIMAL', label: 'Minimalista', hint: 'nombre grande, aire' },
  { value: 'PRESS', label: 'Periódico', hint: 'portada de diario' },
  { value: 'VINTAGE', label: 'Antiguo', hint: 'documento envejecido' },
  { value: 'COMIC', label: 'Cómic', hint: 'pop-art, ben-day, tinta' },
  { value: 'GRAFFITI', label: 'Grafiti', hint: 'muro, spray, marcador' },
  { value: 'FUTURE', label: 'Futurista', hint: 'interfaz, HUD, tu color' },
  { value: 'GLASS', label: 'Glassmorphism', hint: 'cristal, blur, degradado' },
  { value: 'Y2K', label: 'Y2K', hint: 'cromo, holo, 2000s' },
  { value: 'RETRO', label: 'Retro', hint: '70s, papel, arcoíris' },
  { value: 'PIXEL', label: 'Pixel art', hint: 'arcade, 8-bit, neón' }
]

export const TEMPLATE_LABEL: Record<CardTemplate, string> = {
  DARK: 'Ficha',
  LIGHT: 'Editorial',
  MINIMAL: 'Minimalista',
  PRESS: 'Periódico',
  COMIC: 'Cómic',
  FUTURE: 'Futurista',
  VINTAGE: 'Antiguo',
  GLASS: 'Glassmorphism',
  VECTOR: 'Cómic',
  RETRO: 'Retro',
  PIXEL: 'Pixel art',
  Y2K: 'Y2K',
  SWISS: 'Suizo',
  GRAFFITI: 'Grafiti'
}

export const CARD_LAYOUTS: { value: CardLayout; label: string }[] = [
  { value: 'VERTICAL', label: 'Vertical (9:16)' },
  { value: 'SQUARE', label: 'Cuadrado (1:1)' },
  { value: 'HORIZONTAL', label: 'Horizontal (16:9)' }
]
