
export class WorkScheduleSettings {
  startTime: string | null = null;
  endTime: string | null = null;
  minutesPerBlock: number | null = null;

  constructor(init?: Partial<WorkScheduleSettings>) {
    Object.assign(this, init);
  }
}
