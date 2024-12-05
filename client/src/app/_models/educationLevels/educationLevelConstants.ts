import { Column, columnCode, columnCreatedAt, columnDescription, columnEnabled, columnId, columnName, columnVisible } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { EducationLevel } from "src/app/_models/educationLevels/educationLevel";
import { EducationLevelParams } from "src/app/_models/educationLevels/educationLevelParams";

export const educationLevelDictionary: NamingSubject = new NamingSubject(
  'feminine',
  'especialidad',
  'especialidades',
  'Especialidades',
  'educationLevels',
  ['admin', 'utilerias', 'codigos'],
);

export const educationLevelColumns: Column[] = [
  columnId,
  columnCode,
  columnName,
  columnDescription,
  columnCreatedAt,
  columnVisible,
  columnEnabled,
];

export const educationLevelFormInfo: FormInfo<EducationLevel> = {
  ...baseInfo,
} as FormInfo<EducationLevel>;

export const educationLevelFiltersFormInfo: FormInfo<EducationLevelParams> = {
  ...baseFilterFormInfo,
} as FormInfo<EducationLevelParams>;
