import { Entity } from "src/app/_models/base/entity";

export class WarehouseProduct extends Entity {
  warehouseId!: number;
  productId!: number;
  quantity!: number;
  reservedQuantity!: number;
  damagedQuantity!: number;
  onHoldQuantity!: number;
  reorderLevel!: number;
  safetyStock!: number;
  lastUpdated!: Date;
  lotNumber?: string;
  expirationDate?: Date;

  constructor(init?: Partial<WarehouseProduct>) {
    super();
    Object.assign(this, init);
  }
}
