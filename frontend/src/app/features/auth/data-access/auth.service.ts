import { Injectable, computed, signal } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService } from '../../../core/services/api.service'
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload
} from '../../../shared/models/auth.model'

const TOKEN_KEY = 'token'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token = signal<string | null>(this.read())
  readonly isLoggedIn = computed(() => !!this._token())

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  login(data: LoginPayload) {
    return this.api.post<AuthResponse, LoginPayload>('/auth/login', data)
  }

  register(data: RegisterPayload) {
    return this.api.post<AuthResponse, RegisterPayload>('/auth/register', data)
  }

  me() {
    return this.api.get<{
      id: string
      email: string
      name: string
      birthDate: string | null
    }>('/auth/me')
  }

  saveToken(token: string) {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      /* ignore */
    }
    this._token.set(token)
  }

  getToken() {
    return this._token()
  }

  logout() {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      /* ignore */
    }
    this._token.set(null)
    this.router.navigate(['/login'])
  }

  isAuthenticated() {
    return !!this._token()
  }

  private read(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  }
}
