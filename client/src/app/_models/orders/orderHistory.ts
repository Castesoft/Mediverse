import { Entity } from "src/app/_models/base/entity";
import { SelectOption } from "src/app/_models/base/selectOption";
import { Account } from "src/app/_models/account/account";

export class OrderHistory extends Entity {
  changeType: string | null = null;
  property: string | null = null;
  oldValue: string | null = null;
  newValue: string | null = null;
  user: Account | null = null;

  constructor(init?: Partial<OrderHistory>) {
    super();
    Object.assign(this, init);
  }
}
