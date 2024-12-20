
export default class Evolution {
  content: string | null = null;

  constructor(init?: Partial<Evolution>) {
    Object.assign(this, init);
  }

}
