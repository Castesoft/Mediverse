import { Column, columnCode, columnCreatedAt, columnDescription, columnEnabled, columnId, columnName, columnVisible } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { MaritalStatus } from "src/app/_models/maritalStatuses/maritalStatus";
import { MaritalStatusParams } from "src/app/_models/maritalStatuses/maritalStatusParams";

export const maritalStatusDictionary: NamingSubject = new NamingSubject(
  'feminine',
  'especialidad',
  'especialidades',
  'Especialidades',
  'maritalStatuses',
);

export const maritalStatusColumns: Column[] = [
  columnId,
  columnCode,
  columnName,
  columnDescription,
  columnCreatedAt,
  columnVisible,
  columnEnabled,
];

export const maritalStatusFormInfo: FormInfo<MaritalStatus> = {
  ...baseInfo,
} as FormInfo<MaritalStatus>;

export const maritalStatusFiltersFormInfo: FormInfo<MaritalStatusParams> = {
  ...baseFilterFormInfo,
} as FormInfo<MaritalStatusParams>;
