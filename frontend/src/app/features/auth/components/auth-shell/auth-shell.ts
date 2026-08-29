import {
  Component,
  HostListener,
  Input,
  afterNextRender,
  inject
} from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { LandingPageComponent } from '../../../home/pages/landing-page/landing-page'
import { AuthDrawerService } from '../../data-access/auth-drawer.service'

@Component({
  selector: 'app-auth-shell',
  standalone: true,
  imports: [RouterLink, LandingPageComponent],
  templateUrl: './auth-shell.html',
  styleUrl: './auth-shell.css'
})
export class AuthShellComponent {
  private router = inject(Router)
  private drawer = inject(AuthDrawerService)

  @Input() eyebrow = ''
  @Input() heading = ''
  @Input() sub = ''

  open = this.drawer.open

  constructor() {
    afterNextRender(() => {
      setTimeout(() => this.drawer.reveal(), 20)
    })
  }

  @HostListener('document:keydown.escape')
  close() {
    if (!this.open()) return
    this.drawer.reset()
    setTimeout(() => this.router.navigateByUrl('/'), 300)
  }
}
