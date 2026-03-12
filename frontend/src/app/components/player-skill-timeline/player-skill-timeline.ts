import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { PlayerModel } from '../../models/player';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../services/player';
import { SkillSelectorComponent } from './skill-selector/skill-selector';
import { PLAYER_SKILLS_CONFIG } from '../../config/player-skill';
import { SkillTimelineChartComponent } from './skill-timeline-chart/skill-timeline-chart';
import { PlayerHeaderComponent } from './player-header/player-header';

interface BackendTimelineResponse {
  playerId: number;
  years: string[];
  skills: Record<string, number[]>;
}

export interface ChartSeries {
  label: string;
  data: { year: number; value: number }[];
}

@Component({
  selector: 'app-player-skill-timeline',
  standalone: true,
  imports: [
    CommonModule,
    SkillSelectorComponent,
    SkillTimelineChartComponent,
    PlayerHeaderComponent,
  ],
  templateUrl: './player-skill-timeline.html',
  styleUrl: './player-skill-timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerSkillTimelineComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private playerService = inject(PlayerService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  player: PlayerModel | null = null;
  playerId!: number;

  selectedSkills: string[] = ['pace'];
  skillGroups = PLAYER_SKILLS_CONFIG;

  chartData: ChartSeries[] = [];

  playerLoading = true;
  timelineLoading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.playerId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPlayer();
  }

  private loadPlayer(): void {
    this.playerLoading = true;

    this.playerService.getById(this.playerId)
      .subscribe({
        next: (player) => {
          this.player = player;
          this.playerLoading = false;
          this.cdr.markForCheck();
          this.loadTimeline();
        },
        error: () => {
          this.player = null;
          this.playerLoading = false;
          this.error = 'Jugador no encontrado';
          this.cdr.markForCheck();
        }
      });
  }

  private loadTimeline(): void {
    if (!this.selectedSkills.length) {
      this.chartData = [];
      return;
    }

    this.timelineLoading = true;
    this.error = null;

    this.playerService.getSkillTimeline(this.playerId, this.selectedSkills)
      .subscribe({
        next: (response: BackendTimelineResponse) => {
          this.chartData = this.transformToChartData(response);
          this.timelineLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.error = 'Error cargando timeline';
          this.timelineLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  private transformToChartData(
    response: BackendTimelineResponse
  ): ChartSeries[] {

    const years = response.years.map(y => Number(y));

    return Object.entries(response.skills).map(([skill, values]) => ({
      label: skill,
      data: years.map((year, index) => ({
        year,
        value: values[index]
      }))
    }));
  }

  onSkillToggle(skill: string): void {

    const exists = this.selectedSkills.includes(skill);

    this.selectedSkills = exists
      ? this.selectedSkills.filter(s => s !== skill)
      : [...this.selectedSkills, skill];

    this.loadTimeline();
  }

  goBack(): void {
    this.router.navigate([`/players/${this.playerId}`]);
  }
}
