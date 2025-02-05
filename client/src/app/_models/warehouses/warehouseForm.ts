import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Warehouse } from "src/app/_models/warehouses/warehouse";
import { warehouseFormInfo } from "src/app/_models/warehouses/warehouseConstants";

export class WarehouseForm extends FormGroup2<Warehouse> {
  constructor() {
    super(Warehouse, new Warehouse(), warehouseFormInfo);
  }
}
