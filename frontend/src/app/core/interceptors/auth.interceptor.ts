import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, throwError } from 'rxjs'
import { AuthService } from '../../features/auth/data-access/auth.service'
import { API_URL } from '../../shared/constants/api'

/**
 * - Añade el header Authorization a las peticiones al backend.
 * - Si el backend responde 401 con un token presente (sesión caducada),
 *   cierra sesión y redirige al login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService)
  const token = auth.getToken()

  const isApi = req.url.startsWith(API_URL)
  const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register')

  const authReq =
    token && isApi && !isAuthEndpoint
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && token && !isAuthEndpoint) {
        auth.logout()
      }
      return throwError(() => err)
    })
  )
}
