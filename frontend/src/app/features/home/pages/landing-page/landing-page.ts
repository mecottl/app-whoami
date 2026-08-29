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
    name: '',
    handle: '@alexrvra',
    location: 'CDMX',
    description: 'Diseño de producto de día, discos raros de noche.',
    birthDate: '1997-04-12T00:00:00.000Z',
    favoriteColor: '#1330e6',
    avatarUrl: '',
    layout: 'VERTICAL',
    template: 'LIGHT'
  }

  readonly demoCategories: CardCategory[] = [
    {
      id: 'c1',
      name: 'Películas',
      type: 'MOVIE',
      order: 1,
      favorites: [
        { id: 'f1', title: 'Dune: Part Two', imageUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', externalId: '1', order: 1 },
        { id: 'f2', title: 'Interstellar', imageUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', externalId: '2', order: 2 }
      ]
    },
    {
      id: 'c2',
      name: 'Discos',
      type: 'MUSIC',
      order: 2,
      favorites: [
        { id: 'f3', title: 'Random Access Memories', imageUrl: 'https://cdn-images.dzcdn.net/images/cover/311bba0fc112d15f72c8b5a65f0456c1/250x250-000000-80-0-0.jpg', externalId: '3', order: 1 }
      ]
    }
  ]

  readonly categories = [
    'Películas',
    'Series',
    'Música',
    'Libros',
    'Juegos',
    'Deportes',
    'Anime',

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
