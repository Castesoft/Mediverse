import { createId } from "@paralleldrive/cuid2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { productFiltersFormInfo } from "src/app/_models/products/productConstants";
import { ProductParams } from "src/app/_models/products/productParams";


export class ProductFiltersForm extends FormGroup2<ProductParams> {
  constructor() {
    super(ProductParams as any, new ProductParams(createId()), productFiltersFormInfo);
  }
}
