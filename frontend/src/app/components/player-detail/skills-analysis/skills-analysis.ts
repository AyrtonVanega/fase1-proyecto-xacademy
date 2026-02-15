import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillRadarChartComponent } from '../../skill-radar-chart/skill-radar-chart'

export interface SkillGroup {
  title: string;
  labels: string[];
  data: number[];
}

@Component({
  selector: 'app-skills-analysis',
  standalone: true,
  imports: [
    CommonModule,
    SkillRadarChartComponent,
  ],
  templateUrl: './skills-analysis.html',
  styleUrls: ['./skills-analysis.scss']
})
export class SkillsAnalysisComponent {

  @Input({ required: true }) skillGroups!: SkillGroup[];

}
