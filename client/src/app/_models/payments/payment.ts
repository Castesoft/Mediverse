import { Entity } from "src/app/_models/base/entity";
import { SelectOption } from "src/app/_models/base/selectOption";
import { UserPaymentMethod } from "src/app/_models/billingDetails";


export class Payment extends Entity {
  amount: number | null = null;
  paymentMethod: UserPaymentMethod = new UserPaymentMethod();
  paymentMethodType: SelectOption | null = null;
  date: Date | null = null;

  constructor(init?: Partial<Payment>) {
    super();
    Object.assign(this, init);
  }
}
