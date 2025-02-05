import { EntityParams } from "src/app/_models/base/entityParams";
import { Warehouse } from "src/app/_models/warehouses/warehouse";

export class WarehouseParams extends EntityParams<Warehouse> {
  constructor(key: string | null) {
    super(key);
  }
}
