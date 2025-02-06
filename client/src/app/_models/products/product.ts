import { Entity } from "src/app/_models/base/entity";
import { Photo } from "src/app/_models/forms/example/_models/photo";
import { WarehouseProduct } from "src/app/_models/warehouseProducts/warehouseProduct";


export class Product extends Entity {
  quantity: number | null = null;
  unit: string | null = null;
  discountType: "1" | "2" | "3" | null = null;
  discount: number | null = null;
  dosage: string | null = null;
  price: number | null = null;
  lotNumber: string | null = null;
  manufacturer: string | null = null;
  photoUrl: string | null = null;
  photos?: Photo[];
  isInternal: boolean | null = false;
  sku: string | null = null;
  barcode: string | null = null;
  category: string | null = null;
  // tags: string[] | null = null; TODO: Implement tags
  costPrice: number | null = null;

  warehouseProducts?: Partial<WarehouseProduct>[] = [];

  constructor(init?: Partial<Product>) {
    super();
    Object.assign(this, init);
  }
}
