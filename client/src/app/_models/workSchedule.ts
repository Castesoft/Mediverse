import { FormInfo } from "src/app/_forms/form2";

export class WorkSchedule {
  id: number | null = null;
  startTime: string | null = null;
  endTime: string | null = null;
  dayOfWeek: number | null = null;

  constructor(init?: Partial<WorkSchedule>) {
    Object.assign(this, init);
  }
}

export const workScheduleInfo: FormInfo<WorkSchedule> = {
  dayOfWeek: { label: 'Día de la semana', type: 'number' },
  endTime: { label: 'Hora de fin', type: 'time' },
  id: { label: 'ID', type: 'number' },
  startTime: { label: 'Hora de inicio', type: 'time' },
} as FormInfo<WorkSchedule>;
