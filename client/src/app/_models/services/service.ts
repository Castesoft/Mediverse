import { Entity } from "src/app/_models/base/entity";
import { SelectOption } from 'src/app/_models/base/selectOption';


export class Service extends Entity {
  discount: number | null = null;
  price: number | null = null;
  photoUrl: string | null = null;
  select: SelectOption | null = null;

  constructor(init?: Partial<Service>) {
    super();

    Object.assign(this, init);
  }
}
