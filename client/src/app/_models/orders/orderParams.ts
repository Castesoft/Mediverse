import { EntityParams } from "src/app/_models/base/entityParams";
import { Order } from "src/app/_models/orders/order";

export class OrderParams extends EntityParams<Order> {
  userId: number | null = null;
  fromAccountRoute: boolean | null = null;

  constructor(key: string | null, init?: Partial<OrderParams>) {
    super(key);
    Object.assign(this, init);
  }
}
