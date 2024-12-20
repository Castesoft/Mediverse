import { DateFilterFn } from '@angular/material/datepicker';

export default class DateOptions {
  hideToggleButton: boolean | null = null;
  matTimepickerMin: Date | null = null;

  get dateFilter(): DateFilterFn<Date | null> {
    return this._dateFilter;
  }
  set dateFilter(value: DateFilterFn<Date | null>) {
    this._dateFilter = value;
  }
  private _dateFilter: any;

  constructor(init?: Partial<DateOptions>) {

    Object.assign(this, init);
  }

}
