import { Injectable } from "@angular/core";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { WarehouseProduct } from "src/app/_models/warehouseProducts/warehouseProduct";
import {
  warehouseProductColumns,
  warehouseProductDictionary
} from "src/app/_models/warehouseProducts/warehouseProductConstants";
import { WarehouseProductParams } from "src/app/_models/warehouseProducts/warehouseProductParams";

@Injectable({
  providedIn: 'root',
})
export class WarehouseProductsService extends ServiceHelper<WarehouseProduct, WarehouseProductParams, FormGroup2<WarehouseProductParams>> {
  constructor() {
    super(WarehouseProductParams, 'warehouseProducts', warehouseProductDictionary, warehouseProductColumns);
  }
}
