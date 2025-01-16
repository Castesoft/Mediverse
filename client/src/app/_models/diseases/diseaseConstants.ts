import { Column, columnCode, columnCreatedAt, columnDescription, columnEnabled, columnId, columnName, columnVisible } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { Disease } from "src/app/_models/diseases/disease";
import { DiseaseParams } from "src/app/_models/diseases/diseaseParams";

export const diseaseDictionary: NamingSubject = new NamingSubject(
  'feminine',
  'especialidad',
  'especialidades',
  'Especialidades',
  'diseases',

);

export const diseaseColumns: Column[] = [
  columnId,
  columnCode,
  columnName,
  columnDescription,
  columnCreatedAt,
  columnVisible,
  columnEnabled,
];

export const diseaseFormInfo: FormInfo<Disease> = {
  ...baseInfo,
} as FormInfo<Disease>;

export const diseaseFiltersFormInfo: FormInfo<DiseaseParams> = {
  ...baseFilterFormInfo,
} as FormInfo<DiseaseParams>;
