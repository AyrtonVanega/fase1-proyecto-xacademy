import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { HomeComponent } from './components/home/home';
import { authGuard } from './guards/auth';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'players',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/players-list/players-list')
            .then(m => m.PlayersListComponent)
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./components/player-detail/player-detail')
            .then(m => m.PlayerDetailComponent)
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./components/player-detail/player-detail')
            .then(m => m.PlayerDetailComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  },
];
