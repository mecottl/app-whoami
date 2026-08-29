import { Component, OnInit, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { CardsService } from '../../data-access/cards.service'
import { AuthService } from '../../../auth/data-access/auth.service'
import { CardLayout, CardTemplate } from '../../../../shared/models/card.model'
import { CARD_TEMPLATES, CARD_LAYOUTS } from '../../../../shared/constants/card-templates'

@Component({
  selector: 'app-create-card-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './create-card-page.html',
  styleUrl: './create-card-page.css'
})
export class CreateCardPageComponent implements OnInit {
  name = ''
  description = ''
  birthDate = ''
  layout: CardLayout = 'VERTICAL'
  template: CardTemplate = 'LIGHT'

  templates = CARD_TEMPLATES
  layouts = CARD_LAYOUTS

  needsBirthDate = signal(false)
  error = signal('')
  loading = signal(false)

  constructor(
    private cards: CardsService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.me().subscribe({
      next: (me) => this.needsBirthDate.set(!me?.birthDate)
    })
  }

  onSubmit() {
    if (this.loading()) return
    this.error.set('')
    this.loading.set(true)

    this.cards
      .createCard({
        name: this.name.trim(),
        description: this.description.trim() || undefined,
        layout: this.layout,
        template: this.template,
        birthDate: this.needsBirthDate() ? this.birthDate : undefined
      })
      .subscribe({
        next: (card) => this.router.navigate(['/cards', card.id]),
        error: () => {
          this.loading.set(false)
          this.error.set('No se pudo crear la card. Revisa los campos.')
        }
      })
  }
}
