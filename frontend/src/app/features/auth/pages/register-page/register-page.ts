import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '../../data-access/auth.service'

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css'
})
export class RegisterPageComponent {
  email = ''
  password = ''
  name = ''
  birthDate = ''
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

    this.auth
      .register({
        email: this.email,
        password: this.password,
        name: this.name,
        birthDate: this.birthDate
      })
      .subscribe({
        next: (res) => {
          this.auth.saveToken(res.access_token)
          this.router.navigate(['/dashboard'])
        },
        error: (err) => {
          this.loading.set(false)
          this.error.set(
            err?.status === 409
              ? 'Ese email ya está registrado.'
              : 'No se pudo crear la cuenta. Revisa los datos.'
          )
        }
      })
  }
}
