import { Entity } from "src/app/_models/base/entity";

export class PaymentMethodType extends Entity {
  iconPrefix?: string;
  iconName?: string;

  constructor(init?: Partial<PaymentMethodType>) {
    super();
    Object.assign(this, init);
  }
}
