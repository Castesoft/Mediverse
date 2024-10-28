import { Service, serviceInfo } from 'src/app/_models/service';
import { baseInfo, Entity } from 'src/app/_models/types';
import { SelectOption } from 'src/app/_forms/form';
import { FormGroup2, FormInfo } from 'src/app/_forms/form2';
import { UserPaymentMethod, userPaymentMethodInfo } from 'src/app/_models/billingDetails';

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

export const paymentInfo: FormInfo<Payment> = {
  ...baseInfo,
  amount: { label: 'Cantidad', type: 'number', },
  date: { label: 'Fecha', type: 'date', },
  paymentMethod: userPaymentMethodInfo,
  paymentMethodType: { label: 'Tipo de pago', type: 'select', },
} as FormInfo<Payment>;

export class PaymentForm extends FormGroup2<Payment> {
  constructor() {
    super(Payment, new Payment(), paymentInfo);
  }
}

