import { PaymentParams } from "src/app/_models/payments/paymentParams";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { paymentFiltersFormInfo } from "src/app/_models/payments/paymentConstants";
import { createId } from "@paralleldrive/cuid2";

export class PaymentFiltersForm extends FormGroup2<PaymentParams> {
  constructor() {
    super(PaymentParams as any, new PaymentParams(createId()), paymentFiltersFormInfo);
  }
}
