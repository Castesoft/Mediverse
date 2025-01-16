import { EntityParams } from "src/app/_models/base/entityParams";
import { Order } from "src/app/_models/orders/order";
import { SiteSection } from "../sections/sectionTypes";

export class OrderParams extends EntityParams<Order> {
  constructor(key: string | null) {
    super(key);
  }
}
