import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '../../data-access/auth.service'

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPageComponent {
  email = ''
  password = ''
  error = signal('')
  loading = signal(false)

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.loading()) return
    this.error.set('')
    this.loading.set(true)

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.auth.saveToken(res.access_token)
        this.router.navigate(['/dashboard'])
      },
      error: () => {
        this.loading.set(false)
        this.error.set('No se pudo iniciar sesión. Revisa tus credenciales.')
      }
    })
  }
}
