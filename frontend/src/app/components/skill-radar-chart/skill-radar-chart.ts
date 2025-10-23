import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables, ChartConfiguration } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-skill-radar-chart',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './skill-radar-chart.html',
  styleUrls: ['./skill-radar-chart.scss']
})
export class SkillRadarChartComponent implements OnInit, OnDestroy {
  @Input() chartTitle: string = 'Habilidades';
  @Input() radarChartLabels: string[] = [];
  @Input() skillData: number[] = [];

  @ViewChild('radarCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chartInstance: Chart<'radar'> | null = null;

  ngOnInit(): void {
    setTimeout(() => this.renderChart(), 0);
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  private renderChart(): void {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement;

    const config: ChartConfiguration<'radar'> = {
      type: 'radar',
      data: {
        labels: this.radarChartLabels,
        datasets: [
          {
            label: 'Rating',
            data: this.skillData,
            backgroundColor: 'rgba(74, 144, 226, 0.3)',
            borderColor: '#50c878',
            borderWidth: 2,
            pointBackgroundColor: '#50c878',
            pointBorderColor: '#1e1e2f',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#50c878'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: this.chartTitle,
            color: '#ffffff',
            font: { size: 14, weight: 'bold' }
          }
        },
        scales: {
          r: {
            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            pointLabels: { color: '#ffffff', font: { size: 11 } },
            ticks: {
              stepSize: 20,
              backdropColor: 'transparent',
              color: '#b0b0c0'
            },
            suggestedMin: 0,
            suggestedMax: 100
          }
        }
      }
    };

    this.chartInstance = new Chart(ctx, config);
  }
}
