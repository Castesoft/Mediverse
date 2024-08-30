import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-account-schedules',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './account-schedules.component.html',
  styleUrl: './account-schedules.component.scss'
})
export class AccountSchedulesComponent implements OnInit, OnDestroy {
  private accountService = inject(AccountService);
  
  startTime = '08:00';
  endTime = '18:00';
  minutesPerBlock = 60;
  displayDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  dayIndices = [1, 2, 3, 4, 5, 6, 0];

  timeSlotsPerDay: string[] = [];
  timeSlots: string[] = [];
  selectedBlocks: Set<string> = new Set();

  isMouseDown: boolean = false;
  startSelection: any = null;

  private globalMouseUpListener: () => void = () => {};

  ngOnInit() {
    this.setWorkSchedules();

    for (const day of this.displayDays) {
      this.generateTimeSlotsForDay(day);
    }

    this.globalMouseUpListener = this.onGlobalMouseUp.bind(this);
    document.addEventListener('mouseup', this.globalMouseUpListener);

    if (this.accountService.current()!.workScheduleSettings) {
      if (this.accountService.current()!.workScheduleSettings!.startTime) {
        this.startTime = this.accountService.current()!.workScheduleSettings!.startTime!.split(':')[0] + ':' + this.accountService.current()!.workScheduleSettings!.startTime!.split(':')[1];
      }
      if (this.accountService.current()!.workScheduleSettings!.endTime) {
        this.endTime = this.accountService.current()!.workScheduleSettings!.endTime!.split(':')[0] + ':' + this.accountService.current()!.workScheduleSettings!.endTime!.split(':')[1];
      }
      if (this.accountService.current()!.workScheduleSettings!.minutesPerBlock) {
        this.minutesPerBlock = this.accountService.current()!.workScheduleSettings!.minutesPerBlock!;
      }
      this.updateSchedule();
      this.setWorkSchedules();
    }
  }

  ngOnDestroy() {
    document.removeEventListener('mouseup', this.globalMouseUpListener);
  }

  setWorkSchedules() {
    const workSchedules = this.accountService.current()!.workSchedules;
    for (const workSchedule of workSchedules) {
      const block = `${workSchedule.startTime.split(':')[0]}:${workSchedule.startTime.split(':')[1]}-${workSchedule.endTime.split(':')[0]}:${workSchedule.endTime.split(':')[1]}-${workSchedule.dayOfWeek}`;
      this.selectedBlocks.add(block);
    }
  }

  onGlobalMouseUp() {
    this.isMouseDown = false;
    this.startSelection = null;
  }

  generateTimeSlotsForDay(day: string) {
    const timeSlots = [];
    const timeSlotsPerDay = [];
    let time = this.startTime;
    const dayIndex = this.dayIndices[this.displayDays.indexOf(day)];
    while (time < this.endTime) {
      const startTime = time;
      const endTime = this.addMinutes(time, this.minutesPerBlock);
      
      if (endTime <= this.endTime) {
        timeSlots.push(`${startTime}-${endTime}-${dayIndex}`);
        timeSlotsPerDay.push(`${startTime}-${endTime}`);
        time = endTime;
      } else {
        break;
      }
    }
    this.timeSlots = [...this.timeSlots, ...timeSlots];
    this.timeSlotsPerDay = timeSlotsPerDay;
  }

  addMinutes(time: string, minutes: number) {
    const [hours, mins] = time.split(':').map(Number);
    const date = new Date(0, 0, 0, hours, mins);
    date.setMinutes(date.getMinutes() + minutes);
    return date.toTimeString().slice(0, 5);
  }

  onMouseDown(time: string, day: string) {
    this.isMouseDown = true;
    const dayIndex = this.dayIndices[this.displayDays.indexOf(day)];
    const block = `${time}-${dayIndex}`;
    this.startSelection = { time, dayIndex, remove: this.selectedBlocks.has(block) };
    this.toggleBlockSelection(time, dayIndex);
  }

  onMouseOver(time: string, day: string) {
    if (this.isMouseDown && this.startSelection) {
      const { time: startTime, dayIndex: startDayIndex } = this.startSelection;

      const startRow = this.timeSlotsPerDay.indexOf(startTime);
      const currentRow = this.timeSlotsPerDay.indexOf(time);

      const startCol = this.dayIndices.indexOf(startDayIndex);
      const currentCol = this.displayDays.indexOf(day);

      const minRow = Math.min(startRow, currentRow);
      const maxRow = Math.max(startRow, currentRow);
      const minCol = Math.min(startCol, currentCol);
      const maxCol = Math.max(startCol, currentCol);

      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          const currentTime = this.timeSlotsPerDay[row];
          const currentDayIndex = this.dayIndices[col];
          if (this.startSelection.remove) {
            this.removeBlockSelection(currentTime, currentDayIndex);
          } else {
            this.addBlockSelection(currentTime, currentDayIndex);
          }
        }
      }
    }
  }

  addBlockSelection(time: string, dayIndex: number) {
    const block = `${time}-${dayIndex}`;
    if (!this.selectedBlocks.has(block)) {
      this.selectedBlocks.add(block);
    }
  }

  removeBlockSelection(time: string, dayIndex: number) {
    const block = `${time}-${dayIndex}`;
    if (this.selectedBlocks.has(block)) {
      this.selectedBlocks.delete(block);
    }
  }

  toggleBlockSelection(time: string, dayIndex: number) {
    const block = `${time}-${dayIndex}`;
    if (this.selectedBlocks.has(block)) {
      this.selectedBlocks.delete(block);
    } else {
      this.selectedBlocks.add(block);
    }
  }

  isSelected(time: string, day: string) {
    const dayIndex = this.dayIndices[this.displayDays.indexOf(day)];
    return this.selectedBlocks.has(`${time}-${dayIndex}`);
  }

  updateSchedule() {
    this.timeSlots = [];
    this.timeSlotsPerDay = [];
    this.selectedBlocks.clear();
    for (const day of this.displayDays) {
      this.generateTimeSlotsForDay(day);
    }
  }

  updateWorkSchedule() {
    const blocks = Array.from(this.selectedBlocks);
    this.accountService.updateWorkSchedule(blocks, this.startTime, this.endTime, this.minutesPerBlock).subscribe(() => {
      this.updateSchedule();
      this.setWorkSchedules();
    });
  }
}
