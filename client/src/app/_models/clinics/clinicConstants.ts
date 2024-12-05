import { Column, columnId, columnName } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { Clinic } from "src/app/_models/clinics/clinic";
import { ClinicParams } from "src/app/_models/clinics/clinicParams";
import { FormInfo } from "src/app/_models/forms/formTypes";

export const clinicDictionary: NamingSubject = new NamingSubject(
  'feminine',
  'clínica',
  'clínicas',
  'Clínicas',
  'clinics',
  ['home', 'clinics']
);

export const clinicColumns: Column[] = [
  columnId,
  columnName,
  new Column('street', 'Calle'),
  new Column('exteriorNumber', 'Número exterior'),
  new Column('interiorNumber', 'Número interior'),
  new Column('neighborhood', 'Colonia'),
  new Column('city', 'Ciudad'),
  new Column('state', 'Estado'),
  new Column('country', 'País'),
  new Column('zipcode', 'Código postal'),
];

export const clinicFormInfo: FormInfo<Clinic> = {
  ...baseInfo,
} as FormInfo<Clinic>;

export const clinicFiltersFormInfo: FormInfo<ClinicParams> = {
  ...baseFilterFormInfo,
} as FormInfo<ClinicParams>;
