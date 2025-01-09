import { Injectable } from "@angular/core";
import { ServiceHelper } from "../_utils/serviceHelper/serviceHelper";
import Product from "../_models/nurses/nurse";
import { nurseColumns, nurseDictionary } from "../_models/nurses/nurseConstants";
import { ProductParams } from "../_models/products/productParams";
import { ProductFiltersForm } from "../_models/products/productFiltersForm";

@Injectable({
  providedIn: 'root'
})
export class PharmaciesService extends ServiceHelper<Product, ProductParams, ProductFiltersForm> {
  constructor() {
    super(ProductParams, 'pharmacies', nurseDictionary, nurseColumns);
  }
}
