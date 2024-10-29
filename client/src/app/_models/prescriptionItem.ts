import { SelectOption } from "src/app/_forms/form";
import { FormGroup2, FormInfo } from "src/app/_forms/form2";
import { Product } from "src/app/_models/product";

export class PrescriptionItem {
  quantity: number | null = null;
  instructions: string | null = null;
  notes: string | null = null;
  createdAt: string | null = null;
  description: string | null = null;
  discount: number | null = null;
  dosage: number | null = null;
  lotNumber: string | null = null;
  manufacturer: string | null = null;
  name: string | null = null;
  price: number | null = null;
  unit: string | null = null;

  product: Product = new Product();
  selectProduct: SelectOption | null = null;

  constructor(init?: Partial<PrescriptionItem>) {
    Object.assign(this, init);
  }
}

export const prescriptionItemInfo: FormInfo<PrescriptionItem> = {
  createdAt: { label: 'Creado', type: 'date', showLabel: false, },
  description: { label: 'Descripción', type: 'text', showLabel: false, },
  discount: { label: 'Descuento', type: 'number', showLabel: false, },
  dosage: { label: 'Dosis', type: 'number', showLabel: false, },
  instructions: { label: 'Indicaciones', type: 'text', orientation: 'inline', },
  lotNumber: { label: 'Número de lote', type: 'text', showLabel: false, },
  manufacturer: { label: 'Fabricante', type: 'text', showLabel: false, },
  name: { label: 'Nombre', type: 'text', showLabel: false, },
  notes: { label: 'Notas', type: 'textarea', showLabel: false, },
  price: { label: 'Precio', type: 'number', showLabel: false, },
  quantity: { label: 'Cantidad', type: 'number', showLabel: false, },
  unit: { label: 'Unidad', type: 'text', showLabel: false, },
  selectProduct: { label: 'Producto', type: 'typeahead', showLabel: false, },
} as FormInfo<PrescriptionItem>;

export class PrescriptionItemForm extends FormGroup2<PrescriptionItem> {
  constructor() {
    super(PrescriptionItem, new PrescriptionItem(), prescriptionItemInfo);
  }
}
