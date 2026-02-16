import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlayerModel } from '../../models/player';
import { SkillGroupModel } from '../../models/skill-group';
import { BasicInfoComponent } from './basic-info/basic-info';
import { SkillsAnalysisComponent } from './skills-analysis/skills-analysis';
import { SkillsEditorComponent } from './skills-editor/skills-editor';
import { PlayerService } from '../../services/player';
import { PLAYER_SKILLS_CONFIG } from '../../config/player-skill';
import { BASIC_INFO_CONFIG } from '../../config/basic-info';
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
export class PlayerDetailComponent implements OnInit {
  player: PlayerModel | null = null;
  loading = true;
  isSaving = false;
  playerForm!: FormGroup;
  skillGroups: SkillGroupModel[] = [];
  id: number | null = null;
  mode: 'view' | 'edit' | 'create' = 'view';
  basicInfoFields = BASIC_INFO_CONFIG;

  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService,
    private fb: FormBuilder,
  ) {
    this.playerForm = buildPlayerForm(this.fb);
    this.initializeSkillGroups();
  }

  get isEditMode(): boolean {
    return this.mode === 'edit';
  }

  get isCreateMode(): boolean {
    return this.mode === 'create';
  }

  get isViewMode(): boolean {
    return this.mode === 'view';
  }

  // El componente puede iniciar en modo vista (con ID) o en modo creación (sin ID)
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      // Modo Vista
      this.id = Number(idParam);
      this.mode = 'view';
      this.playerForm.disable();
      this.loadPlayer(this.id);
    } else {
      // Modo Creación
      this.mode = 'create';
      this.playerForm.enable();
      this.loading = false;
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

    this.playerService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
    switch (this.mode) {

      case 'view':
        this.mode = 'edit';
        this.playerForm.enable();
        break;

      case 'edit':
        this.mode = 'view';
        this.playerForm.disable();
        if (this.player) {
          this.playerForm.patchValue(this.player);
        }
        break;

      case 'create':
        this.router.navigate(['/players']);
        break;
    }
  }

  savePlayer(): void {
    if (this.playerForm.invalid) {
      this.playerForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    const payload = this.playerForm.getRawValue();

    const request$ =
      this.mode === 'create'
        ? this.playerService.createPlayer(payload)
        : this.playerService.updatePlayer(this.id!, payload);

    request$.subscribe({
      next: (response) => this.handleSaveSuccess(response),
      error: (err) => this.handleSaveError(err)
    });
  }

  private handleSaveSuccess(response: any): void {
    const player = response.jugador || response;

    if (!player?.id) {
      console.error('No se obtuvo id en la respuesta:', response);
      this.isSaving = false;
      return;
    }

    this.player = player;
    this.playerForm.patchValue(player);
    this.mapSkillsToCharts(player);

    if (this.mode === 'create') {
      this.router.navigate([`/players/${player.id}`]);
    } else {
      this.mode = 'view';
      this.playerForm.disable();
    }

    this.isSaving = false;
  }

  private handleSaveError(error: any): void {
    console.error('Error al guardar jugador:', error);
    this.isSaving = false;
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
