import { AvailableTime, availableTimeInfo } from "src/app/_models/availableTime";
import { FormInfo } from "src/app/_models/forms/formTypes";

export class AvailableDay {
  day: string | null = null;
  dayNumber: number | null = null;
  month: string | null = null;
  monthNumber: number | null = null;
  year: number | null = null;
  availableTimes: AvailableTime[] = [];
  selectedTime: AvailableTime = new AvailableTime();

  constructor(init?: Partial<Omit<AvailableDay, 'findIndex'>>) {
    Object.assign(this, init);
  }

  findIndex(time: AvailableTime): number {
    return this.availableTimes.indexOf(time);
  }
}

export const availableDayInfo: FormInfo<AvailableDay> = {
  availableTimes: availableTimeInfo,
  day: { label: 'Día', type: 'text' },
  dayNumber: { label: 'Número de día', type: 'number' },
  month: { label: 'Mes', type: 'text' },
  monthNumber: { label: 'Número de mes', type: 'number' },
  year: { label: 'Año', type: 'number' },
} as FormInfo<AvailableDay>;
