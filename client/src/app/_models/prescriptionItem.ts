import { FormGroup2, FormInfo } from "src/app/_forms/form2";
import { Product } from "src/app/_models/product";

export class PrescriptionItem {
  quantity: number | null = null;
  instructions: string | null = null;
  notes: string | null = null;
  createdAt: string | null = null;
  description: string | null = null;
  discount: number | null = null;
  dosage: string | null = null;
  itemId: number | null = null;
  lotNumber: string | null = null;
  manufacturer: string | null = null;
  name: string | null = null;
  price: number | null = null;
  unit: string | null = null;

  product: Product = new Product();

  constructor(init?: Partial<PrescriptionItem>) {
    Object.assign(this, init);
  }
}

export const prescriptionItemInfo: FormInfo<PrescriptionItem> = {
  createdAt: { label: 'Creado', type: 'date', },
  description: { label: 'Descripción', type: 'textarea', },
  discount: { label: 'Descuento', type: 'number', },
  dosage: { label: 'Dosis', type: 'text', },
  instructions: { label: 'Instrucciones', type: 'textarea', },
  itemId: { label: 'Item ID', type: 'number', },
  lotNumber: { label: 'Número de lote', type: 'text', },
  manufacturer: { label: 'Fabricante', type: 'text', },
  name: { label: 'Nombre', type: 'text', },
  notes: { label: 'Notas', type: 'textarea', },
  price: { label: 'Precio', type: 'number', },
} as FormInfo<PrescriptionItem>;

export class PrescriptionItemForm extends FormGroup2<PrescriptionItem> {
  constructor() {
    super(PrescriptionItem, new PrescriptionItem(), prescriptionItemInfo);
  }
}
