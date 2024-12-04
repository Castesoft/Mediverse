import { FormInfo } from "src/app/_models/forms/formTypes";

/**
 * Represents a base entity with common properties.
 * This class can be extended to create more specific entities.
 */
export class Entity {
  id: number | null = null;
  createdAt: Date | null = null;
  name: string | null = null;
  codeNumber: number | null = null;
  code: string | null = null;
  description: string | null = null;
  isSelected: boolean = false;
  visible: boolean = true;
  enabled: boolean = true;
}

export const baseInfo: FormInfo<Entity> = {
  code: { label: 'Código', type: 'text', },
  codeNumber: { label: 'Número de Código', type: 'number', },
  createdAt: { label: 'Creado', type: 'date', },
  description: { label: 'Descripción', type: 'textarea', },
  enabled: { label: 'Habilitado', type: 'slideToggle', },
  id: { label: 'ID', type: 'number', },
  isSelected: { label: 'Seleccionado', type: 'checkbox', },
  name: { label: 'Nombre', type: 'text', },
  visible: { label: 'Visible', type: 'slideToggle', },
} as FormInfo<Entity>;
