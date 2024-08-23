import { Component, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-doctor-schedule-tab',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './doctor-schedule-tab.component.html',
  styleUrl: './doctor-schedule-tab.component.scss'
})
export class DoctorScheduleTabComponent {

  onSelectSchedule = output<any>();

  selectedDay: any = null;
  schedule = [
    {
      day: "Lunes",
      dayNumber: 19,
      month: 'Agosto',
      monthNumber: 8,
      year: 2024,
      availability: [
        {
          start: "08:00",
          end: "09:00",
          available: true
        },
        {
          start: "09:00",
          end: "10:00",
          available: true
        },
        {
          start: "10:00",
          end: "11:00",
          available: false
        },
        {
          start: "11:00",
          end: "12:00",
          available: true
        },
        {
          start: "12:00",
          end: "13:00",
          available: false
        },
        {
          start: "13:00",
          end: "14:00",
          available: false
        },
        {
          start: "14:00",
          end: "15:00",
          available: true
        },
        {
          start: "15:00",
          end: "16:00",
          available: true
        },
        {
          start: "16:00",
          end: "17:00",
          available: true
        },
        {
          start: "17:00",
          end: "18:00",
          available: true
        },
        {
          start: "18:00",
          end: "19:00",
          available: true
        }
      ]
    },
    {
      day: "Martes",
      dayNumber: 20,
       month: 'Agosto',
      monthNumber: 8,
      year: 2024,
      availability: [
        {
          start: "08:00",
          end: "09:00",
          available: true
        },
        {
          start: "09:00",
          end: "10:00",
          available: true
        },
        {
          start: "10:00",
          end: "11:00",
          available: false
        },
        {
          start: "11:00",
          end: "12:00",
          available: true
        },
        {
          start: "12:00",
          end: "13:00",
          available: false
        },
        {
          start: "13:00",
          end: "14:00",
          available: false
        },
        {
          start: "14:00",
          end: "15:00",
          available: true
        },
        {
          start: "15:00",
          end: "16:00",
          available: true
        },
        {
          start: "16:00",
          end: "17:00",
          available: true
        },
        {
          start: "17:00",
          end: "18:00",
          available: true
        },
        {
          start: "18:00",
          end: "19:00",
          available: true
        }
      ]
    },
    {
      day: "Miércoles",
      dayNumber: 21,
       month: 'Agosto',
      monthNumber: 8,
      year: 2024,
      availability: [
        {
          start: "08:00",
          end: "09:00",
          available: true
        },
        {
          start: "09:00",
          end: "10:00",
          available: true
        },
        {
          start: "10:00",
          end: "11:00",
          available: false
        },
        {
          start: "11:00",
          end: "12:00",
          available: true
        },
        {
          start: "12:00",
          end: "13:00",
          available: false
        },
        {
          start: "13:00",
          end: "14:00",
          available: false
        },
        {
          start: "14:00",
          end: "15:00",
          available: true
        },
        {
          start: "15:00",
          end: "16:00",
          available: true
        },
        {
          start: "16:00",
          end: "17:00",
          available: true
        },
        {
          start: "17:00",
          end: "18:00",
          available: true
        },
        {
          start: "18:00",
          end: "19:00",
          available: true
        }
      ]
    },
    {
      day: "Jueves",
      dayNumber: 22,
       month: 'Agosto',
      monthNumber: 8,
      year: 2024,
      availability: [
        {
          start: "08:00",
          end: "09:00",
          available: true
        },
        {
          start: "09:00",
          end: "10:00",
          available: true
        },
        {
          start: "10:00",
          end: "11:00",
          available: false
        },
        {
          start: "11:00",
          end: "12:00",
          available: true
        },
        {
          start: "12:00",
          end: "13:00",
          available: false
        },
        {
          start: "13:00",
          end: "14:00",
          available: false
        },
        {
          start: "14:00",
          end: "15:00",
          available: true
        },
        {
          start: "15:00",
          end: "16:00",
          available: true
        },
        {
          start: "16:00",
          end: "17:00",
          available: true
        },
        {
          start: "17:00",
          end: "18:00",
          available: true
        },
        {
          start: "18:00",
          end: "19:00",
          available: true
        }
      ]
    },
    {
      day: "Viernes",
      dayNumber: 23,
       month: 'Agosto',
      monthNumber: 8,
      year: 2024,
      availability: [
        {
          start: "08:00",
          end: "09:00",
          available: true
        },
        {
          start: "09:00",
          end: "10:00",
          available: true
        },
        {
          start: "10:00",
          end: "11:00",
          available: false
        },
        {
          start: "11:00",
          end: "12:00",
          available: true
        },
        {
          start: "12:00",
          end: "13:00",
          available: false
        },
        {
          start: "13:00",
          end: "14:00",
          available: false
        },
        {
          start: "14:00",
          end: "15:00",
          available: true
        },
        {
          start: "15:00",
          end: "16:00",
          available: true
        },
        {
          start: "16:00",
          end: "17:00",
          available: true
        },
        {
          start: "17:00",
          end: "18:00",
          available: true
        },
        {
          start: "18:00",
          end: "19:00",
          available: true
        }
      ]
    },
    {
      day: "Sábado",
      dayNumber: 24,
       month: 'Agosto',
      monthNumber: 8,
      year: 2024,
      availability: [
        {
          start: "08:00",
          end: "09:00",
          available: true
        },
        {
          start: "09:00",
          end: "10:00",
          available: true
        },
        {
          start: "10:00",
          end: "11:00",
          available: false
        },
        {
          start: "11:00",
          end: "12:00",
          available: true
        },
        {
          start: "12:00",
          end: "13:00",
          available: false
        },
        {
          start: "13:00",
          end: "14:00",
          available: false
        },
        {
          start: "14:00",
          end: "15:00",
          available: true
        },
        {
          start: "15:00",
          end: "16:00",
          available: true
        },
        {
          start: "16:00",
          end: "17:00",
          available: true
        },
        {
          start: "17:00",
          end: "18:00",
          available: true
        },
        {
          start: "18:00",
          end: "19:00",
          available: true
        }
      ]
    },
    {
      day: "Domingo",
      dayNumber: 25,
       month: 'Agosto',
      monthNumber: 8,
      year: 2024,
      availability: [
        {
          start: "08:00",
          end: "09:00",
          available: true
        },
        {
          start: "09:00",
          end: "10:00",
          available: true
        },
        {
          start: "10:00",
          end: "11:00",
          available: false
        },
        {
          start: "11:00",
          end: "12:00",
          available: true
        },
      ]
    },
    {
      day: "Lunes",
      dayNumber: 26,
       month: 'Agosto',
      monthNumber: 8,
      year: 2024,
      availability: [
        {
          start: "08:00",
          end: "09:00",
          available: true
        },
        {
          start: "09:00",
          end: "10:00",
          available: true
        },
        {
          start: "10:00",
          end: "11:00",
          available: false
        },
        {
          start: "11:00",
          end: "12:00",
          available: true
        },
      ]
    }
  ]

  selectDay(day: any) {
    this.selectedDay = day;
  }

  scheduleAppointment(day: any, time: any) {
    this.onSelectSchedule.emit({ day, time });
  }

  ngOnInit() {
    this.selectedDay = this.schedule[0];
  }
}
