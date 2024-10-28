import { SelectOption } from "src/app/_forms/form";
import { FormGroup2, FormInfo } from "src/app/_forms/form2";
import { baseInfo, Entity } from "src/app/_models/types";

export class UserSummary extends Entity {
  firstName: string | null = null;
  lastName: string | null = null;
  fullName: string | null = null;
  dateOfBirth: Date | null = null;
  email: string | null = null;
  sex: SelectOption | null = null;
  age: string | null = null;
  photoUrl: string | null = null;

  constructor(init?: Partial<UserSummary>) {
    super();

    Object.assign(this, init);
  }
}

export const userSummaryInfo: FormInfo<UserSummary> = {
  ...baseInfo,
  firstName: { label: 'Nombre', type: 'text', },
  lastName: { label: 'Apellido', type: 'text', },
  fullName: { label: 'Nombre Completo', type: 'text', },
  dateOfBirth: { label: 'Fecha de Nacimiento', type: 'date', },
  email: { label: 'Correo Electrónico', type: 'email', },
  sex: { label: 'Sexo', type: 'select', },
  age: { label: 'Edad', type: 'text', },
  photoUrl: { label: 'URL de la Foto', type: 'text', },
} as FormInfo<UserSummary>;

export class UserSummaryForm extends FormGroup2<UserSummary> {
  constructor() {
    super(UserSummary, new UserSummary(), userSummaryInfo);
  }
}
