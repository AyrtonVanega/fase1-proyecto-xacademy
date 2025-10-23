import { Routes } from '@angular/router';
import { PlayersListComponent } from './components/players-list/players-list';
import { PlayerDetailComponent } from './components/player-detail/player-detail';
import { LoginComponent } from './components/login/login';
import { HomeComponent } from './components/home/home';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'players', component: PlayersListComponent },
  { path: 'players/create', component: PlayerDetailComponent },
  { path: 'players/:id', component: PlayerDetailComponent },
  { path: '**', redirectTo: '' },
];
