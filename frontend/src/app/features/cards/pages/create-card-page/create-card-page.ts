import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { CardsService } from '../../data-access/cards.service'
import {
  CardLayout,
  CardTemplate
} from '../../../../shared/models/card.model'

@Component({
  selector: 'app-create-card-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './create-card-page.html',
  styleUrl: './create-card-page.css'
})
export class CreateCardPageComponent {
  name = ''
  description = ''
  birthDate = ''
  layout: CardLayout = 'VERTICAL'
  template: CardTemplate = 'NEON'

  constructor(
    private cards: CardsService,
    private router: Router
  ) {}

  onSubmit() {
    this.cards
      .createCard({
        name: this.name,
        description: this.description,
        birthDate: this.birthDate,
        layout: this.layout,
        template: this.template
      })
      .subscribe(() => {
        this.router.navigate(['/dashboard'])
      })
  }
}
