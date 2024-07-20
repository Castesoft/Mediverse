import { Product } from "src/app/_models/product";

export class Prescription {
  id: number;
  exchangeAmount: number = 1;
  items: PrescriptionItem[] = [];

  constructor(id: number, exchangeAmount: number, items: PrescriptionItem[]) {
    this.id = id;
    this.exchangeAmount = exchangeAmount;
    this.items = items;
  }
}

export class PrescriptionItem {
  quantity: number = 1;
  instructions: string = '';
  notes: string = '';
  product?: Product;

  constructor(quantity: number, instructions: string, notes: string, product: Product) {
    this.quantity = quantity;
    this.instructions = instructions;
    this.notes = notes;
    this.product = product;
  }
}
