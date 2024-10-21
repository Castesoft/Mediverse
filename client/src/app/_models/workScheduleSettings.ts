import { FormInfo } from "src/app/_forms/form2";

export class WorkScheduleSettings {
  startTime: string | null = null;
  endTime: string | null = null;
  minutesPerBlock: number | null = null;

  constructor(init?: Partial<WorkScheduleSettings>) {
    Object.assign(this, init);
  }
}

export const workScheduleSettingsInfo: FormInfo<WorkScheduleSettings> = {
  endTime: { label: 'Hora de fin', type: 'time' },
  minutesPerBlock: { label: 'Minutos por bloque', type: 'number' },
  startTime: { label: 'Hora de inicio', type: 'time' },
} as FormInfo<WorkScheduleSettings>;
