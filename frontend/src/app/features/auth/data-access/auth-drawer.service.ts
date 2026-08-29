import { Injectable, inject, signal } from '@angular/core'
import { NavigationStart, Router } from '@angular/router'

const AUTH_PATHS = ['/login', '/register']
const isAuth = (url: string) => AUTH_PATHS.some((p) => url.startsWith(p))

/**
 * Estado compartido del panel deslizante de acceso. Vive en la raíz para que
 * al pasar de /login a /register el panel no se cierre ni vuelva a animarse.
 *
 * Además recuerda el scroll del landing al abrir el panel, para que el fondo
 * atenuado se vea donde estabas y al cerrar se vuelva ahí (sin saltar arriba).
 */
@Injectable({ providedIn: 'root' })
export class AuthDrawerService {
  private router = inject(Router)

  readonly open = signal(false)
  /** px que hay que subir el landing de fondo para alinearlo con el scroll previo */
  readonly bgOffset = signal(0)

  private savedScroll = 0

  constructor() {
    this.router.events.subscribe((e) => {
      if (!(e instanceof NavigationStart)) return
      const from = this.router.url
      if (isAuth(e.url) && !isAuth(from)) {
        this.savedScroll = window.scrollY || 0
        this.bgOffset.set(this.savedScroll)
      }
    })
  }

  reveal() {
    this.open.set(true)
  }

  reset() {
    this.open.set(false)
  }

  /** vuelve al landing a la posición en la que estabas. Reintenta un rato
      porque el landing tarda un frame o dos en tener toda su altura. */
  restoreScroll() {
    const y = this.savedScroll
    if (y <= 0) return

    const apply = () => window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior })

    let n = 0
    const id = setInterval(() => {
      apply()
      const reached = Math.abs(window.scrollY - y) < 2
      if (reached || n++ > 12) clearInterval(id)
    }, 40)
    apply()
  }
}
