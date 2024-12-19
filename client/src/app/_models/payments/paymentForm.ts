import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Payment } from "src/app/_models/payments/payment";
import { paymentFormInfo } from "src/app/_models/payments/paymentConstants";


export class PaymentForm extends FormGroup2<Payment> {
  constructor() {
    super(Payment, new Payment(), paymentFormInfo);
  }
}
