import { Column, columnCode, columnCreatedAt, columnDescription, columnEnabled, columnId, columnName, columnVisible } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { ConsumptionLevel } from "src/app/_models/consumptionLevels/consumptionLevel";
import { ConsumptionLevelParams } from "src/app/_models/consumptionLevels/consumptionLevelParams";

export const consumptionLevelDictionary: NamingSubject = new NamingSubject(
  'feminine',
  'especialidad',
  'especialidades',
  'Especialidades',
  'consumptionLevels',
  ['admin', 'utilerias', 'codigos'],
);

export const consumptionLevelColumns: Column[] = [
  columnId,
  columnCode,
  columnName,
  columnDescription,
  columnCreatedAt,
  columnVisible,
  columnEnabled,
];

export const consumptionLevelFormInfo: FormInfo<ConsumptionLevel> = {
  ...baseInfo,
} as FormInfo<ConsumptionLevel>;

export const consumptionLevelFiltersFormInfo: FormInfo<ConsumptionLevelParams> = {
  ...baseFilterFormInfo,
} as FormInfo<ConsumptionLevelParams>;
