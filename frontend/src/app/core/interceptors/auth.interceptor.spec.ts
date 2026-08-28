import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TestBed } from '@angular/core/testing'
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http'
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing'
import { authInterceptor } from './auth.interceptor'
import { AuthService } from '../../features/auth/data-access/auth.service'
import { API_URL } from '../../shared/constants/api'

describe('authInterceptor', () => {
  let http: HttpClient
  let httpMock: HttpTestingController
  const logout = vi.fn()

  beforeEach(() => {
    logout.mockClear()
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        {
          provide: AuthService,
          useValue: { getToken: () => 'tok-123', logout }
        }
      ]
    })
    http = TestBed.inject(HttpClient)
    httpMock = TestBed.inject(HttpTestingController)
  })

  it('añade el header Authorization a las llamadas al backend', () => {
    http.get(`${API_URL}/cards`).subscribe()
    const req = httpMock.expectOne(`${API_URL}/cards`)
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok-123')
    req.flush([])
  })

  it('NO añade el header al endpoint de login', () => {
    http.post(`${API_URL}/auth/login`, {}).subscribe()
    const req = httpMock.expectOne(`${API_URL}/auth/login`)
    expect(req.request.headers.has('Authorization')).toBe(false)
    req.flush({})
  })

  it('cierra sesión si el backend responde 401', () => {
    http.get(`${API_URL}/cards`).subscribe({ error: () => {} })
    httpMock
      .expectOne(`${API_URL}/cards`)
      .flush({}, { status: 401, statusText: 'Unauthorized' })
    expect(logout).toHaveBeenCalledOnce()
  })
})
