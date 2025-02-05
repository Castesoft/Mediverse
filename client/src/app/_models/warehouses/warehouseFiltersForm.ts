import { createId } from "@paralleldrive/cuid2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { warehouseFiltersFormInfo } from "src/app/_models/warehouses/warehouseConstants";
import { WarehouseParams } from "src/app/_models/warehouses/warehouseParams";

export class WarehouseFiltersForm extends FormGroup2<WarehouseParams> {
  constructor() {
    super(WarehouseParams as any, new WarehouseParams(createId()), warehouseFiltersFormInfo);
  }
}
