import { Column, columnCode, columnCreatedAt, columnDescription, columnEnabled, columnId, columnName, columnVisible } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { ColorBlindness } from "src/app/_models/colorBlindnesses/colorBlindness";
import { ColorBlindnessParams } from "src/app/_models/colorBlindnesses/colorBlindnessParams";

export const colorBlindnessDictionary: NamingSubject = new NamingSubject(
  'feminine',
  'especialidad',
  'especialidades',
  'Especialidades',
  'colorBlindnesses',
  ['admin', 'utilerias', 'codigos'],
);

export const colorBlindnessColumns: Column[] = [
  columnId,
  columnCode,
  columnName,
  columnDescription,
  columnCreatedAt,
  columnVisible,
  columnEnabled,
];

export const colorBlindnessFormInfo: FormInfo<ColorBlindness> = {
  ...baseInfo,
} as FormInfo<ColorBlindness>;

export const colorBlindnessFiltersFormInfo: FormInfo<ColorBlindnessParams> = {
  ...baseFilterFormInfo,
} as FormInfo<ColorBlindnessParams>;
