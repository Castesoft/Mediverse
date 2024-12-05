import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Product } from "src/app/_models/products/product";
import { productFormInfo } from "src/app/_models/products/productConstants";


export class ProductForm extends FormGroup2<Product> {
  constructor() {
    super(Product, new Product(), productFormInfo);
  }
}
