import { baseColumns, Column } from "src/app/_models/base/column";
import { baseInfo } from "src/app/_models/base/entity";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { Service } from "src/app/_models/services/service";
import { ServiceParams } from "src/app/_models/services/serviceParams";
import { PartialCellsOf, tableCellCode, tableCellCreatedAt, tableCellDescription, tableCellEnabled, tableCellId, tableCellName, tableCellVisible } from "src/app/_models/tables/tableCellItem";


export const serviceFormInfo: FormInfo<Service> = {
  ...baseInfo,
  discount: { label: 'Descuento', type: 'number' },
  photoUrl: { label: 'URL de foto', type: 'text' },
  price: { label: 'Precio', type: 'number' },
} as FormInfo<Service>;

export const serviceFiltersFormInfo: FormInfo<ServiceParams> = {
  ...baseFilterFormInfo,
} as FormInfo<ServiceParams>;

export const serviceCells: PartialCellsOf<Service> = {
  createdAt: tableCellCreatedAt,
  description: tableCellDescription,
  enabled: tableCellEnabled,
  name: tableCellName,
  code: tableCellCode,
  visible: tableCellVisible,
  id: tableCellId,
};

export const serviceDictionary: NamingSubject = new NamingSubject(
  'feminine',
  'especialidad',
  'especialidades',
  'Especialidades',
  'services',
  ['admin', 'utilerias', 'codigos'],
);

export const serviceColumns: Column[] = [
  ...baseColumns,
];
