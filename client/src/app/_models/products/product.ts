import { Entity } from "src/app/_models/base/entity";


export class Product extends Entity {
  quantity: number | null = null;
  unit: string | null = null;
  discount: number | null = null;
  dosage: string | null = null;
  price: number | null = null;
  lotNumber: string | null = null;
  manufacturer: string | null = null;
  photoUrl: string | null = null;
  isInternal: boolean | null = false;

  constructor(init?: Partial<Product>) {
    super();

    Object.assign(this, init);
  }
}
