import { Component, ViewChild } from '@angular/core';
import { ChartComponent, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'dashboard-multipurpose-route',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  @ViewChild('chart') chart!: ChartComponent;

  public chartOptions: Partial<ApexOptions>;

  constructor() {
    this.chartOptions = {
      series: [76],
      chart: {
        fontFamily: 'Inter, Helvetica, "sans-serif"',
        type: 'radialBar',
        offsetY: -20,
        width: '100%',
        height: 600,
      },
      stroke: { lineCap: 'round' },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 5,
            size: '58%',
          },
          track: {
            show: true,
            background: '#f2f2f2',
            strokeWidth: '100%',
            opacity: 1,
            margin: 5,
            dropShadow: {
              enabled: false,
              top: 0,
              left: 0,
              blur: 3,
              opacity: 0.5,
            },
          },

          startAngle: -90,
          endAngle: 90,
          dataLabels: {
            name: {
              show: false,
              fontWeight: '700',
            },
            value: {
              offsetY: -2,
              fontSize: '28px',
              fontWeight: '700',
            },
          },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          shadeIntensity: 0.4,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 53, 91],
        },
      },
      labels: ['Average Results'],
    };
  }
}
