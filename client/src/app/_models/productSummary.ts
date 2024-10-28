import { FormInfo } from "src/app/_forms/form2";
import { Entity } from "src/app/_models/types";

export class ProductSummary extends Entity {
  photoUrl: string | null = null;
  isInternal: boolean | null = false;
  dosage: string | null = null;
  unit: string | null = null;

  constructor(init?: Partial<ProductSummary>) {
    super();

    Object.assign(this, init);
  }
}

export const productSummaryInfo: FormInfo<ProductSummary> = {
  id: { label: 'ID', type: 'number', },
  name: { label: 'Nombre', type: 'text', },
  description: { label: 'Descripción', type: 'textarea', },
  photoUrl: { label: 'Foto', type: 'text', },
  isInternal: { label: 'Interno', type: 'boolean', },
  dosage: { label: 'Dosis', type: 'text', },
  unit: { label: 'Unidad', type: 'text', },
} as FormInfo<ProductSummary>;
