import { SelectOption } from "src/app/_models/base/selectOption";

export const sortOptions: SelectOption[] = Object.values({
  code: new SelectOption({ id: 1, code: 'code', name: 'Código' }),
  name: new SelectOption({ id: 2, code: 'name', name: 'Nombre' }),
  description: new SelectOption({ id: 3, code: 'description', name: 'Descripción' }),
  createdAt: new SelectOption({ id: 4, code: 'createdAt', name: 'Fecha de creación' }),
  id: new SelectOption({ id: 6, code: 'id', name: 'ID' }),
});
