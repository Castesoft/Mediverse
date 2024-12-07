import { baseInfo } from "src/app/_models/base/entity";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { UserSummary } from "src/app/_models/users/userSummary/userSummary";


export const userSummaryFormInfo: FormInfo<UserSummary> = {
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
