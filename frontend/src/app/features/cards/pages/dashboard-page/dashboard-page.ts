import { Component, OnInit, signal } from '@angular/core'
import { DatePipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { CardsService } from '../../data-access/cards.service'
import { Card } from '../../../../shared/models/card.model'
import { AuthService } from '../../../auth/data-access/auth.service'

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css'
})
export class DashboardPageComponent implements OnInit {
  cards = signal<Card[]>([])

  constructor(
    private cardsService: CardsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cardsService.getCards().subscribe({
      next: (res) => {
        this.cards.set(res)
      }
    })
  }

  logout() {
    this.authService.logout()
  }
}
