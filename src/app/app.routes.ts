import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth/auth-guard';
import { guestGuard } from '@core/guards/guest/guest-guard';
import { REQUIRES_AUTH } from './shared/constants/requires-auth.const';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages/discover/discover').then((m) => m.Discover),
  },
  {
    path: 'library',
    loadComponent: () => import('@pages/library/library').then((m) => m.Library),
    canActivate: [authGuard],
    data: { [REQUIRES_AUTH]: true },
  },
  {
    path: 'playlists',
    redirectTo: 'library',
    pathMatch: 'full',
  },
  {
    path: 'playlists/:id',
    loadComponent: () => import('@pages/playlist/playlist').then((m) => m.Playlist),
    canActivate: [authGuard],
    data: { [REQUIRES_AUTH]: true },
  },
  {
    path: 'about',
    loadComponent: () => import('@pages/about/about').then((m) => m.About),
  },
  {
    path: 'login',
    loadComponent: () => import('@app/pages/auth/login/login').then((m) => m.Login),
    canActivate: [guestGuard],
  },
  {
    path: 'signup',
    loadComponent: () => import('@app/pages/auth/signup/signup').then((m) => m.Signup),
    canActivate: [guestGuard],
  },
  {
    path: 'search',
    loadComponent: () => import('@app/pages/search/search').then((m) => m.Search),
  },
  {
    path: 'account',
    loadComponent: () => import('@pages/account/account').then((m) => m.Account),
    canActivate: [authGuard],
    data: { [REQUIRES_AUTH]: true },
  },
  {
    path: '**',
    loadComponent: () => import('@pages/not-found/not-found').then((m) => m.NotFound),
  },
];
