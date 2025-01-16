import { Column, columnCode, columnCreatedAt, columnDescription, columnEnabled, columnId, columnName, columnVisible } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { RelativeType } from "src/app/_models/relativeTypes/relativeType";
import { RelativeTypeParams } from "src/app/_models/relativeTypes/relativeTypeParams";

export const relativeTypeDictionary: NamingSubject = new NamingSubject(
  'feminine',
  'sustancia',
  'sustancias',
  'Sustancias',
  'relativeTypes',
);

export const relativeTypeColumns: Column[] = [
  columnId,
  columnCode,
  columnName,
  columnDescription,
  columnCreatedAt,
  columnVisible,
  columnEnabled,
];

export const relativeTypeFormInfo: FormInfo<RelativeType> = {
  ...baseInfo,
} as FormInfo<RelativeType>;

export const relativeTypeFiltersFormInfo: FormInfo<RelativeTypeParams> = {
  ...baseFilterFormInfo,
} as FormInfo<RelativeTypeParams>;
