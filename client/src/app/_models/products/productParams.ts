import { EntityParams } from "src/app/_models/base/entityParams";
import { Product } from "src/app/_models/products/product";


export class ProductParams extends EntityParams<Product> {
  constructor(key: string | null) {
    super(key);
  }
}
