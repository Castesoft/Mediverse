import { FormInfo } from "src/app/_models/forms/formTypes";
import { WorkScheduleSettings } from "src/app/_models/workSchedules/workScheduleSettings/workScheduleSettings";


export const workScheduleSettingsFormInfo: FormInfo<WorkScheduleSettings> = {
  endTime: { label: 'Hora de fin', type: 'time' },
  minutesPerBlock: { label: 'Minutos por bloque', type: 'number' },
  startTime: { label: 'Hora de inicio', type: 'time' },
} as FormInfo<WorkScheduleSettings>;
