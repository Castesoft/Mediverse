import { FormInfo } from "src/app/_models/forms/formTypes";
import { WorkSchedule } from "src/app/_models/workSchedules/workSchedule";


export const workScheduleFormInfo: FormInfo<WorkSchedule> = {
  dayOfWeek: { label: 'Día de la semana', type: 'number' },
  endTime: { label: 'Hora de fin', type: 'time' },
  id: { label: 'ID', type: 'number' },
  startTime: { label: 'Hora de inicio', type: 'time' },
} as FormInfo<WorkSchedule>;
