import { Entity } from "src/app/_models/base/entity";
import { User } from "src/app/_models/users/user";
import { Product } from "src/app/_models/products/product";
import { SelectOption } from 'src/app/_models/base/selectOption';


export class Order extends Entity {
  total: number | null = null;
  subtotal: number | null = null;
  discount: number | null = null;
  tax: number | null = null;
  amountPaid: number | null = null;
  amountDue: number | null = null;
  patient: User = new User();
  doctor: User = new User();
  address: SelectOption | null = null;
  items: Product[] = [];
  status: SelectOption | null = null;
  deliveryStatus: SelectOption | null = null;

  constructor(init?: Partial<Order>) {
    super();

    Object.assign(this, init);
  }
}
