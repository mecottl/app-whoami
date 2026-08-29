import { CardLayout, CardTemplate } from '../models/card.model'

export const CARD_TEMPLATES: { value: CardTemplate; label: string; hint: string }[] = [
  { value: 'DARK', label: 'Ficha', hint: 'catálogo, monoespaciada' },
  { value: 'LIGHT', label: 'Editorial', hint: 'perfil de revista' },
  { value: 'NEON', label: 'Etiqueta', hint: 'tu color, tipo sticker' },
  { value: 'MINIMAL', label: 'Póster', hint: 'el nombre lo es todo' },
  { value: 'PRESS', label: 'Periódico', hint: 'portada de diario' },
  { value: 'COMIC', label: 'Cómic', hint: 'viñeta, bordes gruesos' },
  { value: 'FUTURE', label: 'Futurista', hint: 'interfaz, HUD' },
  { value: 'VINTAGE', label: 'Antiguo', hint: 'documento envejecido' }
]

export const TEMPLATE_LABEL: Record<CardTemplate, string> = Object.fromEntries(
  CARD_TEMPLATES.map((t) => [t.value, t.label])
) as Record<CardTemplate, string>

export const CARD_LAYOUTS: { value: CardLayout; label: string }[] = [
  { value: 'VERTICAL', label: 'Vertical (9:16)' },
  { value: 'SQUARE', label: 'Cuadrado (1:1)' },
  { value: 'HORIZONTAL', label: 'Horizontal (16:9)' }
]
