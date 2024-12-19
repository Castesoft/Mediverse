
export default class DateOptions {
  hideToggleButton: boolean | null = null;

  constructor(init?: Partial<DateOptions>) {
    Object.assign(this, init);
  }
  
}
