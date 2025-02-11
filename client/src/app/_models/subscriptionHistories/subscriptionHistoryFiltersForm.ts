import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { subscriptionFiltersFormInfo } from "src/app/_models/subscriptions/subscriptionConstants";
import { createId } from "@paralleldrive/cuid2";
import { SubscriptionHistoryParams } from "src/app/_models/subscriptionHistories/subscriptionHistoryParams";

export class SubscriptionHistoryFiltersForm extends FormGroup2<SubscriptionHistoryParams> {
  constructor() {
    super(SubscriptionHistoryParams as any, new SubscriptionHistoryParams(createId()), subscriptionFiltersFormInfo);
  }
}
