import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { SubscriptionParams } from "src/app/_models/subscriptions/subscriptionParams";
import { subscriptionFiltersFormInfo } from "src/app/_models/subscriptions/subscriptionConstants";
import { createId } from "@paralleldrive/cuid2";

export class SubscriptionFiltersForm extends FormGroup2<SubscriptionParams> {
  constructor() {
    super(SubscriptionParams as any, new SubscriptionParams(createId()), subscriptionFiltersFormInfo);
  }
}
