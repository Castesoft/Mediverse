import { baseInfo } from "src/app/_models/base/entity";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { User } from "src/app/_models/users/user";


export const userInfo: FormInfo<User> = {
  ...baseInfo,
  age: { label: 'Edad', type: 'number', },
  city: { label: 'Ciudad', type: 'text', },
  country: { label: 'País', type: 'text', },
  dateOfBirth: { label: 'Fecha de nacimiento', type: 'date', },
  // doctorEvents: eventInfo,
  select: { label: 'Usuario', type: 'typeahead', orientation: 'inline' },
} as FormInfo<User>;
