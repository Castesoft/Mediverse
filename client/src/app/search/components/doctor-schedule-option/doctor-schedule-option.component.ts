import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { AvailableTime } from "src/app/_models/availableTime";
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-doctor-schedule-option',
  imports: [
    NgClass
  ],
  templateUrl: './doctor-schedule-option.component.html',
  styleUrl: './doctor-schedule-option.component.scss'
})
export class DoctorScheduleOptionComponent {
  availableTime: InputSignal<AvailableTime> = input.required();
  selectedTime: InputSignal<AvailableTime | null> = input.required();

  scheduleAppointment: OutputEmitterRef<AvailableTime> = output();

  isSelected(): boolean {
    return this.selectedTime() === this.availableTime();
  }

  onSchedule(): void {
    if (this.availableTime().available) {
      this.scheduleAppointment.emit(this.availableTime());
    }
  }
}
