import { FormInfo } from "src/app/_forms/form2";
import { Entity } from "src/app/_models/types";

export const paymentMethodTypeInfo: FormInfo<PaymentMethodType> = {
  id: { label: 'ID', type: 'number' },
  name: { label: 'Nombre', type: 'text' },
} as FormInfo<PaymentMethodType>;

export class PaymentMethodType extends Entity {


  constructor(init?: Partial<PaymentMethodType>) {
    super();

    Object.assign(this, init);
  }
}
