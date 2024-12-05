import { FormInfo } from "src/app/_models/forms/formTypes";
import { PaymentMethodType } from "src/app/_models/paymentMethodTypes/paymentMethodType";


export const paymentMethodTypeFormInfo: FormInfo<PaymentMethodType> = {
  id: { label: 'ID', type: 'number' },
  name: { label: 'Nombre', type: 'text' },
} as FormInfo<PaymentMethodType>;
