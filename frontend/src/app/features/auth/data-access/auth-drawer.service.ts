import { Injectable, signal } from '@angular/core'

/**
 * Estado compartido del panel deslizante de acceso. Vive en la raíz para que
 * al pasar de /login a /register el panel no se cierre ni vuelva a animarse.
 */
@Injectable({ providedIn: 'root' })
export class AuthDrawerService {
  readonly open = signal(false)

  reveal() {
    this.open.set(true)
  }

  reset() {
    this.open.set(false)
  }
}
