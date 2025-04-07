export default class MultiselectOptions {
  showActions: boolean = false;

  constructor(init?: Partial<MultiselectOptions>) {
    Object.assign(this, init);
  }
}

