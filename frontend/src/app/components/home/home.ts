import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  constructor(private router: Router) { }

  goToList(): void {
    this.router.navigate(['/players']);
  }

  createPlayer(): void {
    this.router.navigate(['/players/create']);
  }
}
