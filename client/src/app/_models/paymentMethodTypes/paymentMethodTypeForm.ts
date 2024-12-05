import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { PaymentMethodType } from "src/app/_models/paymentMethodTypes/paymentMethodType";
import { paymentMethodTypeFormInfo } from "src/app/_models/paymentMethodTypes/paymentMethodTypeConstants";

export class PaymentMethodTypeForm extends FormGroup2<PaymentMethodType> {
  constructor() {
    super(PaymentMethodType, new PaymentMethodType(), paymentMethodTypeFormInfo);
  }
}
