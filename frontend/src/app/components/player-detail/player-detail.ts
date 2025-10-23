import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { SkillRadarChartComponent } from '../skill-radar-chart/skill-radar-chart';
import { PlayerService } from '../../services/player';
import { AuthService } from '../../services/auth';

Chart.register(...registerables);

interface PlayerDetails {
  id: number;
  fifa_version: string;
  fifa_update: string;
  player_face_url: string;
  long_name: string;
  club_name: string;
  player_positions: string;
  nationality_name: string;
  overall: number;
  potential: number;
  value_eur: number;
  wage_eur: number;
  age: number;
  height_cm: number;
  weight_kg: number;
  preferred_foot: string;
  weak_foot: number;
  skill_moves: number;
  international_reputation: number;
  work_rate: string;
  body_type: string;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physic: number;
  attacking_crossing: number;
  attacking_finishing: number;
  attacking_heading_accuracy: number;
  attacking_short_passing: number;
  attacking_volleys: number;
  skill_dribbling: number;
  skill_curve: number;
  skill_fk_accuracy: number;
  skill_long_passing: number;
  skill_ball_control: number;
  movement_acceleration: number;
  movement_sprint_speed: number;
  movement_agility: number;
  movement_reactions: number;
  movement_balance: number;
  power_shot_power: number;
  power_jumping: number;
  power_stamina: number;
  power_strength: number;
  power_long_shots: number;
  mentality_aggression: number;
  mentality_interceptions: number;
  mentality_positioning: number;
  mentality_vision: number;
  mentality_penalties: number;
  mentality_composure: number;
  defending_marking: number;
  defending_standing_tackle: number;
  defending_sliding_tackle: number;
  goalkeeping_diving: number;
  goalkeeping_handling: number;
  goalkeeping_kicking: number;
  goalkeeping_positioning: number;
  goalkeeping_reflexes: number;
  goalkeeping_speed: number;
  player_traits: string;
}

interface SkillGroup {
  title: string;
  labels: string[]; // Nombres de las etiquetas para el gráfico (ej: 'Attacking Heading Accuracy')
  keys: string[];   // Nombres de la propiedad en PlayerDetails (ej: 'attacking_heading_accuracy')
  data: number[];   // El array de valores (ej: [90, 85, ...])
  formFields: { key: string; label: string }[];
}

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkillRadarChartComponent,
  ],
  templateUrl: './player-detail.html',
  styleUrls: ['./player-detail.scss']
})
export class PlayerDetailComponent implements OnInit, OnDestroy {
  player: PlayerDetails | null = null;
  loading = true;
  isSaving = false;
  isEditing = false;
  isCreationMode = false;
  playerForm!: FormGroup;
  skillGroups: SkillGroup[] = [];
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
    { key: 'preferred_foot', label: 'Pie Preferido', type: 'text' },
    { key: 'weak_foot', label: 'Weak Foot', type: 'number', min: 0, max: 5 },
    { key: 'skill_moves', label: 'Skill Moves', type: 'number', min: 0, max: 5 },
    { key: 'international_reputation', label: 'Reputación Internacional', type: 'number', min: 0, max: 5 },
    { key: 'work_rate', label: 'Work Rate', type: 'text' },
    { key: 'body_type', label: 'Tipo de Cuerpo', type: 'text' },
    { key: 'player_traits', label: 'Rasgos del Jugador', type: 'text' },
  ];

  private playerSubscription: Subscription | null = null;

  @ViewChildren(SkillRadarChartComponent) chartComponents!: QueryList<SkillRadarChartComponent>;

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
      // Modo Detalle / Edición
      this.id = Number(idParam);
      this.isCreationMode = false;
      this.isEditing = false;
      this.loadPlayer(this.id);
    } else {
      // Modo Creación
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
    this.playerForm = this.fb.group({
      id: [{ value: 0, disabled: true }], // readonly
      fifa_version: ['', Validators.required],
      fifa_update: ['', Validators.required],
      player_face_url: ['', Validators.required],
      long_name: ['', Validators.required],
      club_name: [''],
      player_positions: ['', Validators.required],
      nationality_name: [''],
      overall: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      potential: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      value_eur: [0],
      wage_eur: [0],
      age: [0, [Validators.required, Validators.min(18), Validators.max(40)]],
      height_cm: [0],
      weight_kg: [0],
      preferred_foot: [''],
      weak_foot: [0],
      skill_moves: [0],
      international_reputation: [0],
      work_rate: [''],
      body_type: [''],
      pace: [0],
      shooting: [0],
      passing: [0],
      dribbling: [0],
      defending: [0],
      physic: [0],
      attacking_crossing: [0],
      attacking_finishing: [0],
      attacking_heading_accuracy: [0],
      attacking_short_passing: [0],
      attacking_volleys: [0],
      skill_dribbling: [0],
      skill_curve: [0],
      skill_fk_accuracy: [0],
      skill_long_passing: [0],
      skill_ball_control: [0],
      movement_acceleration: [0],
      movement_sprint_speed: [0],
      movement_agility: [0],
      movement_reactions: [0],
      movement_balance: [0],
      power_shot_power: [0],
      power_jumping: [0],
      power_stamina: [0],
      power_strength: [0],
      power_long_shots: [0],
      mentality_aggression: [0],
      mentality_interceptions: [0],
      mentality_positioning: [0],
      mentality_vision: [0],
      mentality_penalties: [0],
      mentality_composure: [0],
      defending_marking: [0],
      defending_standing_tackle: [0],
      defending_sliding_tackle: [0],
      goalkeeping_diving: [0],
      goalkeeping_handling: [0],
      goalkeeping_kicking: [0],
      goalkeeping_positioning: [0],
      goalkeeping_reflexes: [0],
      goalkeeping_speed: [0],
      player_traits: [''],
    });
  }

  initializeSkillGroups(): void {
    const config = [
      { title: 'Core Attributes', keys: ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physic'] },
      { title: 'Attacking Skills', keys: ['attacking_crossing', 'attacking_finishing', 'attacking_heading_accuracy', 'attacking_short_passing', 'attacking_volleys'] },
      { title: 'Technical Skills', keys: ['skill_dribbling', 'skill_curve', 'skill_fk_accuracy', 'skill_long_passing', 'skill_ball_control'] },
      { title: 'Movement', keys: ['movement_acceleration', 'movement_sprint_speed', 'movement_agility', 'movement_reactions', 'movement_balance'] },
      { title: 'Power', keys: ['power_shot_power', 'power_jumping', 'power_stamina', 'power_strength', 'power_long_shots'] },
      { title: 'Mentality', keys: ['mentality_aggression', 'mentality_interceptions', 'mentality_positioning', 'mentality_vision', 'mentality_penalties', 'mentality_composure'] },
      { title: 'Defending', keys: ['defending_marking', 'defending_standing_tackle', 'defending_sliding_tackle'] },
      { title: 'Goalkeeping', keys: ['goalkeeping_diving', 'goalkeeping_handling', 'goalkeeping_kicking', 'goalkeeping_positioning', 'goalkeeping_reflexes', 'goalkeeping_speed'] },
    ];

    this.skillGroups = config.map(group => ({
      title: group.title,
      labels: group.keys.map(k => this.formatLabel(k)),
      keys: group.keys,
      data: [],
      formFields: group.keys.map(k => ({ key: k, label: this.formatLabel(k) })),
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

    if (!this.isEditing && this.player) {
      this.playerForm.patchValue(this.player);
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

  mapSkillsToCharts(player: PlayerDetails): void {
    this.skillGroups.forEach(group => {
      group.data = group.keys.map(key => (player as any)[key]);
    });
  }

  goBack(): void {
    this.router.navigate(['/players']);
  }
}
