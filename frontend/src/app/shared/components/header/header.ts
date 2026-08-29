import { Component, computed, inject, signal } from '@angular/core'
import { Router, RouterLink, NavigationEnd } from '@angular/router'
import { filter } from 'rxjs'
import { AuthService } from '../../../features/auth/data-access/auth.service'
import { ThemeService } from '../../../core/services/theme.service'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  private auth = inject(AuthService)
  private router = inject(Router)
  theme = inject(ThemeService)

  // se actualiza en cada navegación para re-evaluar el estado de sesión
  private url = signal(this.router.url)

  isAuthed = computed(() => (this.url(), this.auth.isLoggedIn()))
  brandLink = computed(() =>
    (this.url(), this.auth.isLoggedIn()) ? '/dashboard' : '/'
  )

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.url.set(e.urlAfterRedirects))
  }

  toggleTheme() {
    this.theme.toggle()
  }

  logout() {
    this.auth.logout()
  }
}
