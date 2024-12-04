
export class DateRange {

  constructor(init?: Partial<DateRange>) {
    Object.assign(this, init);
  }

  start: Date | null = null;
  end: Date | null = null;
}
