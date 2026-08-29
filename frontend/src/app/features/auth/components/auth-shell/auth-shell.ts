import {
  Component,
  HostListener,
  Input,
  afterNextRender,
  inject,
  signal
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
  bgOffset = this.drawer.bgOffset

  /** evita que el clic/tecla que abrió el panel lo cierre de inmediato */
  ready = signal(false)

  constructor() {
    afterNextRender(() => {
      setTimeout(() => this.drawer.reveal(), 20)
      setTimeout(() => this.ready.set(true), 450)
    })
  }

  @HostListener('document:keydown.escape')
  close() {
    if (!this.open() || !this.ready()) return
    this.drawer.reset()
    setTimeout(() => {
      this.router.navigateByUrl('/').then(() => this.drawer.restoreScroll())
    }, 300)
  }
}
