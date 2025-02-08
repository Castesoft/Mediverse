import { Column, columnCreatedAt, columnId, columnName } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { baseTableCells, PartialCellsOf, TableCellItem } from "src/app/_models/tables/tableCellItem";
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
);

export const userColumns: Column[] = [
  new Column('user', 'Usuario'),
  new Column('role', 'Roles'),
  columnCreatedAt,
];

export const userCells: PartialCellsOf<User> = {
  ...baseTableCells,
  age: new TableCellItem<number, 'age'>('age', 'number'),
  city: new TableCellItem<string, 'city'>('city', 'string'),
  country: new TableCellItem<string, 'country'>('country', 'string'),
  dateOfBirth: new TableCellItem<Date, 'dateOfBirth'>('dateOfBirth', 'date'),
  email: new TableCellItem<string, 'email'>('email', 'string'),
  firstName: new TableCellItem<string, 'firstName'>('firstName', 'string'),
  education: new TableCellItem<string, 'education'>('education', 'string'),
  fullName: new TableCellItem<string, 'fullName'>('fullName', 'string'),
} as PartialCellsOf<User>;
