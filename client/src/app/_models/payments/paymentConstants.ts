import { baseInfo } from "src/app/_models/base/entity";
import { userPaymentMethodInfo } from "src/app/_models/billingDetails";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { Payment } from "src/app/_models/payments/payment";


export const paymentFormInfo: FormInfo<Payment> = {
  ...baseInfo,
  amount: { label: 'Cantidad', type: 'number', },
  date: { label: 'Fecha', type: 'date', },
  paymentMethod: userPaymentMethodInfo,
  paymentMethodType: { label: 'Tipo de pago', type: 'select', },
} as FormInfo<Payment>;
