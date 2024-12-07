
export class WorkSchedule {
  id: number | null = null;
  startTime: string | null = null;
  endTime: string | null = null;
  dayOfWeek: number | null = null;

  constructor(init?: Partial<WorkSchedule>) {
    Object.assign(this, init);
  }
}
