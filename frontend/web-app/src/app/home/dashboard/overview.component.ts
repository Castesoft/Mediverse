import { Component, ViewChild } from '@angular/core';
import { ChartComponent, ApexOptions } from 'ng-apexcharts';
import { appointments } from '../../data/appointments';
import { patients } from '../../data/patients';
import { Appointment } from '../../_models/appointment';

@Component({
  selector: 'dashboard-multipurpose-route',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  @ViewChild('chart') chart!: ChartComponent;

  patients = patients;

  public radialBarOptions: Partial<ApexOptions>;
  public lineChartOptions: Partial<ApexOptions>;
  public pieChartOptions: Partial<ApexOptions>;
  public barChartOptions: Partial<ApexOptions>;
  appointments: Appointment[] = appointments.slice(4, 7);

  constructor() {
    this.radialBarOptions = {
      series: [37.5],
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
              show: true,
              fontWeight: '700',
              offsetY: -20,
            },
            value: {
              offsetY: -2,
              fontSize: '28px',
              fontWeight: '700',
              formatter: (val) => val + '%',
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
      labels: ['3/8 Citas'],
    };

    this.lineChartOptions = {
      series: [
        {
          name: 'Citas Médicas',
          data: [10, 15, 25, 30, 45, 55, 70],
        },
      ],
      chart: {
        type: 'line',
        height: 350,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
      },
    };

    this.pieChartOptions = {
      series: [44, 55, 13, 43],
      chart: {
        type: 'pie',
        height: 350,
      },
      labels: ['0-25', '25-30', '30-50', '50+'],
    };

    this.barChartOptions = {
      series: [
        {
          name: 'Cirugías',
          data: [5, 4, 8, 6, 4, 3, 2, 7],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        lineCap: 'round',
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
      },
      yaxis: {
        title: {
          text: 'Número de Cirugías',
        },
      },
      fill: {
        opacity: 1,
      },
    };
  }
}
