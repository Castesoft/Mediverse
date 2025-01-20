import {
  Column,
  columnCode,
  columnCreatedAt,
  columnDescription,
  columnEnabled,
  columnName,
  columnVisible
} from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { Specialty } from "src/app/_models/specialties/specialty";
import { SpecialtyParams } from "src/app/_models/specialties/specialtyParams";

export const specialtyDictionary: NamingSubject = new NamingSubject(
  'feminine',
  'especialidad',
  'especialidades',
  'Especialidades',
  'specialties',
);

export const specialtyColumns: Column[] = [
  columnCode,
  columnName,
  columnDescription,
  columnCreatedAt,
  columnVisible,
  columnEnabled,
];

export const specialtyFormInfo: FormInfo<Specialty> = {
  ...baseInfo,
} as FormInfo<Specialty>;

export const specialtyFiltersFormInfo: FormInfo<SpecialtyParams> = {
  ...baseFilterFormInfo,
} as FormInfo<SpecialtyParams>;
