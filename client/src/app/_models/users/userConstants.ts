import { Column, columnCreatedAt, columnEnabled, columnId, columnName } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { baseTableCells, PartialCellsOf } from "src/app/_models/tables/tableCellItem";
import { User } from "src/app/_models/users/user";
import { UserParams } from "src/app/_models/users/userParams";


export const userInfo: FormInfo<User> = {
  ...baseInfo,
  age: { label: 'Edad', type: 'number', },
  city: { label: 'Ciudad', type: 'text', },
  country: { label: 'País', type: 'text', },
  dateOfBirth: { label: 'Fecha de nacimiento', type: 'date', },
  // doctorEvents: eventInfo,
  select: { label: 'Usuario', type: 'typeahead', orientation: 'inline' },
} as FormInfo<User>;

export const userFiltersFormInfo: FormInfo<UserParams> = {
  ...baseFilterFormInfo,
} as FormInfo<UserParams>;

export const userDictionary: NamingSubject = new NamingSubject(
  'masculine',
  'usuario',
  'usuarios',
  'Usuarios',
  'users',
  ['home', 'patients'],
);

export const userColumns: Column[] = [
  columnId,
  new Column('email', 'Correo electrónico'),
  columnName,
  new Column('lastName', 'Apellido'),
  new Column('role', 'Rol'),
  columnEnabled,
  columnCreatedAt,
];

export const userCells: PartialCellsOf<User> = {
  ...baseTableCells,
} as PartialCellsOf<User>;
