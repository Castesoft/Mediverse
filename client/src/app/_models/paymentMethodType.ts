import { FormInfo } from "src/app/_forms/form2";

export const paymentMethodTypeInfo: FormInfo<PaymentMethodType> = {
  id: { label: 'ID', type: 'number' },
  name: { label: 'Nombre', type: 'text' },
} as FormInfo<PaymentMethodType>;

export class PaymentMethodType {
  id: number | null = null;
  name: string | null = null;

  constructor(init?: Partial<PaymentMethodType>) {
    Object.assign(this, init);
  }
}
