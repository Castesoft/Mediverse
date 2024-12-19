export default class MaterialOptions {
  appearance: 'outline' | 'fill' = 'outline';

  constructor(init?: Partial<MaterialOptions>) {
    Object.assign(this, init);
  }
}
