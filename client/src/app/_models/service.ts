import { FormInfo } from "src/app/_forms/form2";
import { Entity } from "src/app/_models/types";

export class Service extends Entity {
  discount: number | null = null;
  price: number | null = null;
  photoUrl: string | null = null;

  constructor() {
    super();
  }
}

export const serviceInfo: FormInfo<Service> = {
  discount: { label: 'Descuento', type: 'number' },
  code: { label: 'Código', type: 'text' },
  codeNumber: { label: 'Número de código', type: 'number' },
  createdAt: { label: 'Creado en', type: 'date' },
  description: { label: 'Descripción', type: 'text' },
  enabled: { label: 'Habilitado', type: 'checkbox' },
  id: { label: 'ID', type: 'number' },
  isSelected: { label: 'Está seleccionado', type: 'checkbox' },
  name: { label: 'Nombre', type: 'text' },
  photoUrl: { label: 'URL de foto', type: 'text' },
  price: { label: 'Precio', type: 'number' },
  visible: { label: 'Visible', type: 'checkbox' },
} as FormInfo<Service>;
