import { Component, Input, OnInit } from '@angular/core';
import { Appointment } from '../../../../types';

@Component({
  selector: 'schedule-summary-card',
  templateUrl: './schedule-summary-card.component.html',
  styleUrls: ['./schedule-summary-card.component.scss'],
})
export class ScheduleSummaryCardComponent implements OnInit {
  @Input({ required: true }) appointment!: Appointment;

  startingHour?: string;
  endingHour?: string;

  ngOnInit(): void {
    const endingHour = new Date(this.appointment.time);
    endingHour.setHours(endingHour.getHours() + 1);
    this.endingHour = endingHour.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    });

    this.startingHour = new Date(this.appointment.time).toLocaleTimeString(
      'en-US',
      {
        hour: 'numeric',
        minute: 'numeric',
      }
    );
  }
}
