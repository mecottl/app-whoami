import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService } from '../../../core/services/api.service'
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload
} from '../../../shared/models/auth.model'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'token'

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  login(data: LoginPayload) {
    return this.api.post<AuthResponse, LoginPayload>('/auth/login', data)
  }

  register(data: RegisterPayload) {
    return this.api.post<unknown, RegisterPayload>('/auth/register', data)
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token)
  }

  getToken() {
    return localStorage.getItem(this.tokenKey)
  }

  logout() {
    localStorage.removeItem(this.tokenKey)
    this.router.navigate(['/login'])
  }

  isAuthenticated() {
    return !!this.getToken()
  }
}
