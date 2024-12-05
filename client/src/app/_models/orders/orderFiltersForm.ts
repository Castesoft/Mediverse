import { createId } from "@paralleldrive/cuid2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { orderFiltersFormInfo } from "src/app/_models/orders/orderConstants";
import { OrderParams } from "src/app/_models/orders/orderParams";

export class OrderFiltersForm extends FormGroup2<OrderParams> {
  constructor() {
    super(OrderParams as any, new OrderParams(createId()), orderFiltersFormInfo);
  }
}
