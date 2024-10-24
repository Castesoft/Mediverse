import { FormInfo } from "src/app/_forms/form2";
import { AvailableTime, availableTimeInfo } from "src/app/_models/availableTime";

export class AvailableDay {
  day: string | null = null;
  dayNumber: number | null = null;
  month: string | null = null;
  monthNumber: number | null = null;
  year: number | null = null;
  availableTimes: AvailableTime[] = [];

  constructor(init?: Partial<AvailableDay>) {
    Object.assign(this, init);
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
