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

  private url = signal(this.router.url)

  onAuthRoute = computed(() =>
    ['/login', '/register'].some((r) => this.url().startsWith(r))
  )
  isAuthed = computed(() => this.auth.isLoggedIn() && !this.onAuthRoute())
  brandLink = computed(() => (this.auth.isLoggedIn() ? '/dashboard' : '/'))

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
