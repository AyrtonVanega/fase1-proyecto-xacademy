import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { ChartSeries } from '../player-skill-timeline';

interface SkillStats {
  label: string;
  max: number;
  min: number;
  avg: number;
  variation: number;
}

@Component({
  selector: 'app-skill-stats-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skill-stats-summary.html',
  styleUrl: './skill-stats-summary.scss'
})
export class SkillStatsSummaryComponent implements OnChanges {

  @Input({ required: true })
  series: ChartSeries[] = [];

  stats: SkillStats[] = [];

  ngOnChanges(): void {
    this.stats = this.series.map(s => {

      const values = s.data.map(d => d.value);

      const max = Math.max(...values);
      const min = Math.min(...values);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const variation = values[values.length - 1] - values[0];

      return {
        label: s.label,
        max,
        min,
        avg: Number(avg.toFixed(1)),
        variation
      };
    });
  }
}