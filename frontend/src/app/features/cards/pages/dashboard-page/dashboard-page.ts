import { Component, OnInit, signal } from '@angular/core'
import { DatePipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { CardsService } from '../../data-access/cards.service'
import { Card } from '../../../../shared/models/card.model'
import { CardThumbComponent } from '../../components/card-thumb/card-thumb'

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink, DatePipe, CardThumbComponent],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css'
})
export class DashboardPageComponent implements OnInit {
  cards = signal<Card[]>([])
  loading = signal(true)
  error = signal('')
  deletingId = signal<string | null>(null)

  constructor(private cardsService: CardsService) {}

  ngOnInit() {
    this.load()
  }

  load() {
    this.loading.set(true)
    this.error.set('')
    this.cardsService.getCards().subscribe({
      next: (res) => {
        this.cards.set(res)
        this.loading.set(false)
      },
      error: () => {
        this.error.set('No se pudieron cargar tus cards.')
        this.loading.set(false)
      }
    })
  }

  remove(card: Card) {
    if (this.deletingId()) return
    if (!confirm(`¿Eliminar la card de "${card.name}"? No se puede deshacer.`)) return

    this.deletingId.set(card.id)
    this.cardsService.deleteCard(card.id).subscribe({
      next: () => {
        this.cards.update((list) => list.filter((c) => c.id !== card.id))
        this.deletingId.set(null)
      },
      error: () => {
        this.error.set('No se pudo eliminar la card.')
        this.deletingId.set(null)
      }
    })
  }

  countFavs(card: Card) {
    return (card.categories ?? []).reduce(
      (n, c) => n + (c.favorites?.length ?? 0),
      0
    )
  }

  templateLabel(card: Card) {
    return { DARK: 'Tinta', LIGHT: 'Papel', MINIMAL: 'Mínima', NEON: 'Color' }[
      card.template
    ]
  }
}
