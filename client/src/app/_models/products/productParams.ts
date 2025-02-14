import { EntityParams } from "src/app/_models/base/entityParams";
import { Product } from "src/app/_models/products/product";
import { SelectOption } from "src/app/_models/base/selectOption";


export class ProductParams extends EntityParams<Product> {
  isInternal: boolean | null = null;
  sku: string | null = null;
  barcode: string | null = null;
  lotNumber: string | null = null;
  price: number | null = null;
  category: SelectOption[] | null = null;
  manufacturer: SelectOption[] | null = null;

  constructor(key: string | null, init?: Partial<ProductParams>) {
    super(key);
    Object.assign(this, init);
  }
}
