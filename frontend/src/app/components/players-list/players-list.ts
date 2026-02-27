import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlayerService } from '../../services/player';

@Component({
  selector: 'app-players-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './players-list.html',
  styleUrls: ['./players-list.scss']
})
export class PlayersListComponent implements OnInit {
  players: any[] = [];
  loading: boolean = false;

  // Filtros
  filters = {
    name: '',
    fifa_version: '',
    nationality: '',
    club: '',
    position: ''
  };

  page: number = 1;
  totalPages: number = 1;
  total: number = 0;

  constructor(
    private playerService: PlayerService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.loading = true;
    this.playerService.getAll(this.filters, this.page).subscribe({
      next: (response) => {
        this.players = response.data;
        this.totalPages = response.totalPages;
        this.total = response.total;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar jugadores', err);
        this.loading = false;
      }
    });
  }

  search(): void {
    this.page = 1;
    this.loadPlayers();
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadPlayers();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadPlayers();
    }
  }

  exportCsv(): void {
    this.playerService.exportPlayers(this.filters).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'players.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al exportar jugadores', err);
        alert('No se pudo descargar el archivo.');
      }
    });
  }

  verInfo(id: number): void {
    this.router.navigate(['/players', id]);
  }

  createPlayer(): void {
    this.router.navigate(['/players/create']);
  }

  importCsv(): void {
    this.router.navigate(['/players/import']);
  }
}