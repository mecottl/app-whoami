import { Component } from '@angular/core'
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
  success = ''
  error = ''

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.success = ''
    this.error = ''

    this.auth.register({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.success = 'Cuenta creada. Ahora puedes iniciar sesion.'
        this.router.navigate(['/login'])
      },
      error: () => {
        this.error = 'No se pudo crear la cuenta.'
      }
    })
  }
}
