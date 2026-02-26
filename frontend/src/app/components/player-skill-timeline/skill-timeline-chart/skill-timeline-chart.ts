import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

export interface ChartSeries {
  label: string;
  data: { year: number; value: number }[];
}

@Component({
  selector: 'app-skill-timeline-chart',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './skill-timeline-chart.html',
  styleUrl: './skill-timeline-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillTimelineChartComponent
  implements AfterViewInit, OnChanges, OnDestroy {

  @Input() series: ChartSeries[] = [];
  @Input() loading: boolean = false;

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart!: Chart;
  private viewReady = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.viewReady) return;
    if (changes['series']) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private createChart(): void {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.series[0]?.data.map(p => p.year),
        datasets: this.series.map((s, index) => ({
          label: s.label,
          data: s.data.map(p => p.value),
          borderColor: this.getColor(index),
          backgroundColor: this.getColor(index),
          tension: 0.3,
          fill: false
        }))
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100
          }
        }
      }
    });
  }

  private updateChart(): void {
    if (!this.chart) {
      this.createChart();
      return;
    }

    this.chart.data.labels = this.series[0]?.data.map(p => p.year);

    this.chart.data.datasets = this.series.map((s, index) => ({
      label: s.label,
      data: s.data.map(p => p.value),
      borderColor: this.getColor(index),
      backgroundColor: this.getColor(index),
      tension: 0.3,
      fill: false
    }));

    this.chart.update();
  }

  private getColor(index: number): string {
    const colors = [
      '#4da3ff',
      '#ff6b6b',
      '#51cf66',
      '#f59f00',
      '#845ef7',
      '#22b8cf'
    ];

    return colors[index % colors.length];
  }
}