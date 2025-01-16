import { Column, columnCode, columnCreatedAt, columnDescription, columnEnabled, columnId, columnName, columnVisible } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { Occupation } from "src/app/_models/occupations/occupation";
import { OccupationParams } from "src/app/_models/occupations/occupationParams";

export const occupationDictionary: NamingSubject = new NamingSubject(
  'feminine',
  'especialidad',
  'especialidades',
  'Especialidades',
  'occupations',
);

export const occupationColumns: Column[] = [
  columnId,
  columnCode,
  columnName,
  columnDescription,
  columnCreatedAt,
  columnVisible,
  columnEnabled,
];

export const occupationFormInfo: FormInfo<Occupation> = {
  ...baseInfo,
} as FormInfo<Occupation>;

export const occupationFiltersFormInfo: FormInfo<OccupationParams> = {
  ...baseFilterFormInfo,
} as FormInfo<OccupationParams>;
