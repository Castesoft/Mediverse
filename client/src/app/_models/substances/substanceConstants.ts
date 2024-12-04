import { Column, columnCode, columnCreatedAt, columnDescription, columnEnabled, columnId, columnName, columnVisible } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { Substance } from "src/app/_models/substances/substance";
import { SubstanceParams } from "src/app/_models/substances/substanceParams";

export const substanceDictionary: NamingSubject = new NamingSubject(
  'feminine',
  'sustancia',
  'sustancias',
  'Sustancias',
  'substances',
  ['admin', 'utilerias', 'codigos'],
);

export const substanceColumns: Column[] = [
  columnId,
  columnCode,
  columnName,
  columnDescription,
  columnCreatedAt,
  columnVisible,
  columnEnabled,
];

export const substanceFormInfo: FormInfo<Substance> = {
  ...baseInfo,
} as FormInfo<Substance>;

export const substanceFiltersFormInfo: FormInfo<SubstanceParams> = {
  ...baseFilterFormInfo,
} as FormInfo<SubstanceParams>;
