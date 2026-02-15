import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PlayerModel } from '../../models/player';
import { SkillGroupModel } from '../../models/skill-group';
import { BasicInfoComponent } from './basic-info/basic-info';
import { SkillsAnalysisComponent } from './skills-analysis/skills-analysis';
import { SkillsEditorComponent } from './skills-editor/skills-editor';
import { PlayerService } from '../../services/player';
import { AuthService } from '../../services/auth';

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
    this.initForm();
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

  /** Inicializa el formulario */
  initForm(): void {
    const ratingValidators = [
      Validators.required,
      Validators.min(0),
      Validators.max(100)
    ];

    const smallRatingValidators = [
      Validators.min(1),
      Validators.max(5)
    ];

    this.playerForm = this.fb.group({
      id: [{ value: 0, disabled: true }], // readonly

      fifa_version: ['', [Validators.required, Validators.maxLength(255)]],
      fifa_update: ['', [Validators.required, Validators.maxLength(255)]],
      player_face_url: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]],
      long_name: ['', [Validators.required, Validators.maxLength(255)]],
      player_positions: ['', Validators.required],

      club_name: ['', Validators.maxLength(255)],
      nationality_name: ['', Validators.maxLength(255)],

      overall: [0, ratingValidators],
      potential: [0, ratingValidators],

      value_eur: [0, [Validators.min(0)]],
      wage_eur: [0, [Validators.min(0)]],

      age: [18, [Validators.required, Validators.min(15), Validators.max(60)]],
      height_cm: [170, [Validators.min(120), Validators.max(230)]],
      weight_kg: [70, [Validators.min(40), Validators.max(150)]],

      preferred_foot: ['Left', Validators.required],

      weak_foot: [1, smallRatingValidators],
      skill_moves: [1, smallRatingValidators],
      international_reputation: [1, smallRatingValidators],

      work_rate: ['', Validators.maxLength(255)],
      body_type: ['', Validators.maxLength(255)],
      player_traits: ['', Validators.maxLength(255)],

      // Skills 0–100
      pace: [0, ratingValidators],
      shooting: [0, ratingValidators],
      passing: [0, ratingValidators],
      dribbling: [0, ratingValidators],
      defending: [0, ratingValidators],
      physic: [0, ratingValidators],

      attacking_crossing: [0, ratingValidators],
      attacking_finishing: [0, ratingValidators],
      attacking_heading_accuracy: [0, ratingValidators],
      attacking_short_passing: [0, ratingValidators],
      attacking_volleys: [0, ratingValidators],

      skill_dribbling: [0, ratingValidators],
      skill_curve: [0, ratingValidators],
      skill_fk_accuracy: [0, ratingValidators],
      skill_long_passing: [0, ratingValidators],
      skill_ball_control: [0, ratingValidators],

      movement_acceleration: [0, ratingValidators],
      movement_sprint_speed: [0, ratingValidators],
      movement_agility: [0, ratingValidators],
      movement_reactions: [0, ratingValidators],
      movement_balance: [0, ratingValidators],

      power_shot_power: [0, ratingValidators],
      power_jumping: [0, ratingValidators],
      power_stamina: [0, ratingValidators],
      power_strength: [0, ratingValidators],
      power_long_shots: [0, ratingValidators],

      mentality_aggression: [0, ratingValidators],
      mentality_interceptions: [0, ratingValidators],
      mentality_positioning: [0, ratingValidators],
      mentality_vision: [0, ratingValidators],
      mentality_penalties: [0, ratingValidators],
      mentality_composure: [0, ratingValidators],

      defending_marking: [0, ratingValidators],
      defending_standing_tackle: [0, ratingValidators],
      defending_sliding_tackle: [0, ratingValidators],

      goalkeeping_diving: [0, ratingValidators],
      goalkeeping_handling: [0, ratingValidators],
      goalkeeping_kicking: [0, ratingValidators],
      goalkeeping_positioning: [0, ratingValidators],
      goalkeeping_reflexes: [0, ratingValidators],
      goalkeeping_speed: [0, ratingValidators],

    });
  }

  initializeSkillGroups(): void {
    const groupsConfig: { title: string; keys: (keyof PlayerModel)[] }[] = [
      {
        title: 'Core Attributes',
        keys: ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physic']
      },
      {
        title: 'Attacking Skills',
        keys: [
          'attacking_crossing',
          'attacking_finishing',
          'attacking_heading_accuracy',
          'attacking_short_passing',
          'attacking_volleys'
        ]
      },
      {
        title: 'Technical Skills',
        keys: [
          'skill_dribbling',
          'skill_curve',
          'skill_fk_accuracy',
          'skill_long_passing',
          'skill_ball_control'
        ]
      },
      {
        title: 'Movement',
        keys: [
          'movement_acceleration',
          'movement_sprint_speed',
          'movement_agility',
          'movement_reactions',
          'movement_balance'
        ]
      },
      {
        title: 'Power',
        keys: [
          'power_shot_power',
          'power_jumping',
          'power_stamina',
          'power_strength',
          'power_long_shots'
        ]
      },
      {
        title: 'Mentality',
        keys: [
          'mentality_aggression',
          'mentality_interceptions',
          'mentality_positioning',
          'mentality_vision',
          'mentality_penalties',
          'mentality_composure'
        ]
      },
      {
        title: 'Defending',
        keys: [
          'defending_marking',
          'defending_standing_tackle',
          'defending_sliding_tackle'
        ]
      },
      {
        title: 'Goalkeeping',
        keys: [
          'goalkeeping_diving',
          'goalkeeping_handling',
          'goalkeeping_kicking',
          'goalkeeping_positioning',
          'goalkeeping_reflexes',
          'goalkeeping_speed'
        ]
      }
    ];

    this.skillGroups = groupsConfig.map(group => ({
      title: group.title,

      // Para el gráfico radar
      labels: group.keys.map(key => this.formatLabel(key)),

      // Para mapear valores dinámicos
      keys: group.keys,

      // Se llena cuando se carga el jugador
      data: group.keys.map(() => 0),

      // Para el editor
      formFields: group.keys.map(key => ({
        key,
        label: this.formatLabel(key)
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

  isFormValid(): boolean {
    if (!this.playerForm) return false;

    const requiredFields = [
      'fifa_version',
      'fifa_update',
      'player_face_url',
      'long_name',
      'player_positions',
      'overall',
      'potential',
      'age'
    ];

    return requiredFields.every(field => {
      const control = this.playerForm.get(field);
      return control && control.value !== null && control.value !== '';
    });
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
