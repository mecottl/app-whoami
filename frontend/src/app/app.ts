import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { HeaderComponent } from './shared/components/header/header'
import { ThemeService } from './core/services/theme.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Instancia el servicio para que aplique el tema al arrancar.
  private theme = inject(ThemeService)
}
