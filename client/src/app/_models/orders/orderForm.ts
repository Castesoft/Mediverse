import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Order } from "src/app/_models/orders/order";
import { orderFormInfo } from "src/app/_models/orders/orderConstants";

export class OrderForm extends FormGroup2<Order> {
  constructor() {
    super(Order, new Order(), orderFormInfo);
  }
}
