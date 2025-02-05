import { Entity } from "src/app/_models/base/entity";
import { Address } from "src/app/_models/addresses/address";
import { WarehouseProduct } from "src/app/_models/warehouseProducts/warehouseProduct";

export class Warehouse extends Entity {
  address: Address | null = new Address();
  warehouseProducts: WarehouseProduct[] = [];

  constructor(init?: Partial<Warehouse>) {
    super();
    Object.assign(this, init);
  }
}
