import { Entity } from "src/app/_models/base/entity";

export class PaymentMethodType extends Entity {


  constructor(init?: Partial<PaymentMethodType>) {
    super();

    Object.assign(this, init);
  }
}
