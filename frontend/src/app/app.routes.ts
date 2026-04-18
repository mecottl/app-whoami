import { Routes } from '@angular/router'
import { authGuard } from './core/guards/auth.guard'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/home/pages/landing-page/landing-page').then(
        (m) => m.LandingPageComponent
      )
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page').then(
        (m) => m.LoginPageComponent
      )
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register-page/register-page').then(
        (m) => m.RegisterPageComponent
      )
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/cards/pages/dashboard-page/dashboard-page').then(
        (m) => m.DashboardPageComponent
      )
  },
  {
    path: 'create-card',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/cards/pages/create-card-page/create-card-page').then(
        (m) => m.CreateCardPageComponent
      )
  },
  {
    path: 'cards/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/cards/pages/card-editor-page/card-editor-page').then(
        (m) => m.CardEditorPage
      )
  },
  {
    path: '**',
    redirectTo: ''
  }
]
