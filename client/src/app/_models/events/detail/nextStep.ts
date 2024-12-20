
export default class NextStep {
  content: string | null = null;

  constructor(init?: Partial<NextStep>) {
    Object.assign(this, init);
  }
}
