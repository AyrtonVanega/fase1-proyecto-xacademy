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
        path: 'import',
        loadComponent: () =>
          import('./components/player-import/player-import')
            .then(m => m.PlayerImportComponent)
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./components/player-detail/player-detail')
            .then(m => m.PlayerDetailComponent)
      },
      {
        path: ':id/skills/timeline',
        loadComponent: () =>
          import('./components/player-skill-timeline/player-skill-timeline')
            .then(m => m.PlayerSkillTimelineComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  },
];
