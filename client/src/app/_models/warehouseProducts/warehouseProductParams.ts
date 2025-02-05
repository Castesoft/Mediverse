import { EntityParams } from "src/app/_models/base/entityParams";
import { WarehouseProduct } from "src/app/_models/warehouseProducts/warehouseProduct";

export class WarehouseProductParams extends EntityParams<WarehouseProduct> {
  constructor(key: string | null) {
    super(key);
  }
}
