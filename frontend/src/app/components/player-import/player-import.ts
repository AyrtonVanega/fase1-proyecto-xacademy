import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PlayerService } from '../../services/player';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-import',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './player-import.html',
  styleUrl: './player-import.scss'
})
export class PlayerImportComponent {

  selectedFile: File | null = null;
  loading = false;
  result: any = null;
  error: string | null = null;

  constructor(
    private playerService: PlayerService,
    private router: Router
  ) { }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file && file.name.endsWith('.csv')) {
      this.selectedFile = file;
      this.error = null;
    } else {
      this.error = 'Debe seleccionar un archivo CSV válido';
      this.selectedFile = null;
    }
  }

  import() {
    if (!this.selectedFile) return;

    this.loading = true;
    this.result = null;
    this.error = null;

    this.playerService.importPlayers(this.selectedFile)
      .subscribe({
        next: (res) => {
          this.result = res;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Error al importar';
          this.loading = false;
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/players']);
  }
}
