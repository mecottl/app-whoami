import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { CardFaceComponent } from '../../../cards/components/card-face/card-face'
import { Card } from '../../../../shared/models/card.model'
import { CardCategory } from '../../../cards/data-access/cards.service'

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, CardFaceComponent],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPageComponent {
  readonly demoCard: Card = {
    id: 'demo',
    name: 'Alex Rivera',
    handle: '@alexrvra',
    location: 'CDMX',
    description: 'Diseño de producto de día, discos raros de noche.',
    birthDate: '1997-04-12T00:00:00.000Z',
    favoriteColor: '#d1402a',
    avatarUrl: '',
    layout: 'VERTICAL',
    template: 'DARK'
  }

  readonly demoCategories: CardCategory[] = [
    {
      id: 'c1',
      name: 'Discos',
      type: 'MUSIC',
      order: 1,
      favorites: [
        { id: 'f1', title: 'In Rainbows', imageUrl: '', externalId: '1', order: 1 },
        { id: 'f2', title: 'Blonde', imageUrl: '', externalId: '2', order: 2 },
        { id: 'f3', title: 'Discovery', imageUrl: '', externalId: '3', order: 3 }
      ]
    },
    {
      id: 'c2',
      name: 'Películas',
      type: 'MOVIE',
      order: 2,
      favorites: [
        { id: 'f4', title: 'Perfect Days', imageUrl: '', externalId: '4', order: 1 },
        { id: 'f5', title: 'La La Land', imageUrl: '', externalId: '5', order: 2 }
      ]
    },
    {
      id: 'c3',
      name: 'Libros',
      type: 'BOOK',
      order: 3,
      favorites: [
        { id: 'f6', title: 'Solaris — Stanisław Lem', imageUrl: '', externalId: '6', order: 1 }
      ]
    }
  ]

  readonly categories = [
    'Películas',
    'Series',
    'Música',
    'Libros',
    'Juegos',
    'Deportes'
  ]

  readonly steps = [
    {
      n: '01',
      t: 'Tu identidad',
      d: 'Nombre, edad, ciudad, un @ y una frase. Lo básico de quién eres.'
    },
    {
      n: '02',
      t: 'Tus rankings',
      d: 'Top 3 por categoría. Buscamos las portadas reales por ti.'
    },
    {
      n: '03',
      t: 'Tu estilo',
      d: 'Elige plantilla y color. Vertical, cuadrado u horizontal.'
    },
    {
      n: '04',
      t: 'Compártelo',
      d: 'Exporta a PNG en resolución para stories y compártelo.'
    }
  ]
}
