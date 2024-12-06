import { Validators } from "@angular/forms";
import { SelectOption } from "src/app/_models/base/selectOption";
import { Companion } from "src/app/_models/companions/companion";
import { FormInfo } from "src/app/_models/forms/formTypes";


export const handDominanceOptions: SelectOption[] = [
  new SelectOption({ id: 1, code: 'right', name: 'Diestro' }),
  new SelectOption({ id: 2, code: 'left', name: 'Zurdo' }),
  new SelectOption({ id: 3, code: 'ambidextrous', name: 'Ambidiestro' }),
];export const sexOptions: SelectOption[] = [
  new SelectOption({ id: 1, code: 'Masculino', name: 'Masculino' }),
  new SelectOption({ id: 2, code: 'Femenino', name: 'Femenino' }),
];
export const companionFormInfo: FormInfo<Companion> = {
  id: { label: 'ID', type: 'number' },
  address: { label: 'Domicilio', type: 'text', validators: [Validators.required] },
  age: { label: 'Edad', type: 'number', validators: [Validators.required, Validators.min(0), Validators.max(150)] },
  sex: { label: 'Sexo', type: 'radio', showCodeSpan: false, selectOptions: sexOptions, validators: [Validators.required,] },
  email: { label: 'Correo electrónico', type: 'text', validators: [Validators.required, Validators.email] },
  homeNumber: { label: 'Teléfono de casa', type: 'text' },
  name: { label: 'Nombre', type: 'text', validators: [Validators.required] },
  occupation: { label: 'Ocupación', type: 'select', showCodeSpan: false, validators: [Validators.required] },
  phoneNumber: { label: 'Teléfono móvil', type: 'text', validators: [Validators.required] },
  relativeType: { label: 'Parentesco', type: 'select', showCodeSpan: false, validators: [Validators.required] },
} as FormInfo<Companion>;

