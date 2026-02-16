import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PlayerModel } from '../../models/player';
import { SkillGroupModel } from '../../models/skill-group';
import { BasicInfoComponent } from './basic-info/basic-info';
import { SkillsAnalysisComponent } from './skills-analysis/skills-analysis';
import { SkillsEditorComponent } from './skills-editor/skills-editor';
import { PlayerService } from '../../services/player';
import { AuthService } from '../../services/auth';
import { PLAYER_SKILLS_CONFIG } from '../../config/player-skill';
import { buildPlayerForm } from '../../factories/player-form';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BasicInfoComponent,
    SkillsAnalysisComponent,
    SkillsEditorComponent,
  ],
  templateUrl: './player-detail.html',
  styleUrls: ['./player-detail.scss']
})
export class PlayerDetailComponent implements OnInit, OnDestroy {
  player: PlayerModel | null = null;
  loading = true;
  isSaving = false;
  isEditing = false;
  isCreationMode = false;
  playerForm!: FormGroup;
  skillGroups: SkillGroupModel[] = [];
  id: number | null = null;
  basicInfoFields = [
    { key: 'id', label: 'ID', type: 'number', readonly: true },
    { key: 'long_name', label: 'Nombre Completo', type: 'text' },
    { key: 'age', label: 'Edad', type: 'number', min: 0, max: 100 },
    { key: 'nationality_name', label: 'Nacionalidad', type: 'text' },
    { key: 'club_name', label: 'Club', type: 'text' },
    { key: 'player_positions', label: 'Posiciones', type: 'text' },
    { key: 'overall', label: 'Overall', type: 'number', min: 0, max: 100 },
    { key: 'potential', label: 'Potential', type: 'number', min: 0, max: 100 },
    { key: 'fifa_version', label: 'FIFA Version', type: 'text' },
    { key: 'fifa_update', label: 'FIFA Update', type: 'text' },
    { key: 'player_face_url', label: 'URL Foto', type: 'text' },
    { key: 'value_eur', label: 'Valor (€)', type: 'number' },
    { key: 'wage_eur', label: 'Sueldo (€)', type: 'number' },
    { key: 'height_cm', label: 'Altura (cm)', type: 'number' },
    { key: 'weight_kg', label: 'Peso (kg)', type: 'number' },
    { key: 'preferred_foot', label: 'Pie Preferido', type: 'select' },
    { key: 'weak_foot', label: 'Weak Foot', type: 'number', min: 0, max: 5 },
    { key: 'skill_moves', label: 'Skill Moves', type: 'number', min: 0, max: 5 },
    { key: 'international_reputation', label: 'Reputación Internacional', type: 'number', min: 0, max: 5 },
    { key: 'work_rate', label: 'Work Rate', type: 'text' },
    { key: 'body_type', label: 'Tipo de Cuerpo', type: 'text' },
    { key: 'player_traits', label: 'Rasgos del Jugador', type: 'text' },
  ];

  private playerSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {
    this.playerForm = buildPlayerForm(this.fb);
    this.initializeSkillGroups();
  }

  ngOnInit(): void {
    // Si no hay token, redirige al login
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      // Modo Vista
      this.id = Number(idParam);
      this.isCreationMode = false;
      this.playerForm.disable();
      this.playerForm.get('id')?.disable();
      this.loadPlayer(this.id);
    } else {
      // Modo Creación/Edicion
      this.isCreationMode = true;
      this.isEditing = true;
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    if (this.playerSubscription) {
      this.playerSubscription.unsubscribe();
    }
  }

  initializeSkillGroups(): void {
    this.skillGroups = PLAYER_SKILLS_CONFIG.map(group => ({
      title: group.title,

      // Para el gráfico radar
      labels: group.keys.map(key => this.formatLabel(key as string)),

      // Para mapear valores dinámicos
      keys: group.keys,

      // Se llena cuando se carga el jugador
      data: group.keys.map(() => 0),

      // Para el editor
      formFields: group.keys.map(key => ({
        key,
        label: this.formatLabel(key as string)
      }))
    }));
  }

  private formatLabel(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  loadPlayer(id: number): void {
    this.loading = true;
    if (this.playerSubscription) this.playerSubscription.unsubscribe();

    this.playerSubscription = this.playerService.getById(id).subscribe({
      next: data => {
        this.player = data;
        this.playerForm.patchValue(data);
        this.mapSkillsToCharts(data);
        this.loading = false;
      },
      error: err => {
        console.error('Error al cargar jugador:', err);
        this.loading = false;
      }
    });
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.playerForm.enable();
    } else {
      this.playerForm.disable();
      this.playerForm.get('id')?.disable(); // mantener ID disabled
      if (this.player) {
        this.playerForm.patchValue(this.player);
      }
    }

    if (this.isCreationMode && !this.isEditing) {
      this.router.navigate(['/players']);
    }
  }

  savePlayer(): void {
    if (this.playerForm.invalid) {
      this.playerForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const data = this.playerForm.value;

    const operation = this.isCreationMode
      ? this.playerService.createPlayer(data)
      : this.playerService.updatePlayer(this.id!, data);

    operation.subscribe({
      next: (response: any) => {
        const player = response.jugador || response;
        if (!player?.id) {
          console.error('No se obtuvo "id" en la respuesta. Respuesta completa:', response);
          this.isSaving = false;
          return;
        }

        this.player = player;
        this.playerForm.patchValue(player);
        this.isSaving = false;
        this.isEditing = false;
        this.mapSkillsToCharts(player);

        // Redirige automaticamente al detalle del nuevo jugador
        if (this.isCreationMode) {
          this.router.navigate([`/players/${player.id}`]);
        }
      },

      error: err => {
        console.error('Error al guardar jugador:', err);
        this.isSaving = false;
      }
    });
  }

  mapSkillsToCharts(player: PlayerModel): void {
    this.skillGroups.forEach(group => {
      group.data = group.keys.map(key => player[key] as number);
    });
  }

  goBack(): void {
    this.router.navigate(['/players']);
  }
}
