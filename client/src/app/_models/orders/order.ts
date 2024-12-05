import { Entity } from "src/app/_models/base/entity";
import { OrderDeliveryStatus } from "./orderTypes";
import { OrderStatus } from "./orderTypes";
import { User } from "src/app/_models/users/user";
import { Address } from "src/app/_models/addresses/address";
import { Product } from "src/app/_models/products/product";


export class Order extends Entity {
  total: number | null = null;
  subtotal: number | null = null;
  discount: number | null = null;
  tax: number | null = null;
  amountPaid: number | null = null;
  amountDue: number | null = null;
  patient: User = new User();
  doctor: User = new User();
  address: Address = new Address();
  items: Product[] = [];
  status: OrderStatus | null = null;
  deliveryStatus: OrderDeliveryStatus | null = null;

  constructor(init?: Partial<Order>) {
    super();

    Object.assign(this, init);
  }
}
