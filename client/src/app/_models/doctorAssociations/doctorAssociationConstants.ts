import { Column, columnId } from "src/app/_models/base/column";
import { baseFilterFormInfo } from "src/app/_models/base/entityParams";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { DoctorAssociationParams } from "src/app/_models/doctorAssociations/doctorAssociationParams";
import { baseTableCells, PartialCellsOf, TableCellItem } from "src/app/_models/tables/tableCellItem";
import { DoctorAssociation } from "src/app/_models/doctorAssociations/doctorAssociation";
import { ColumnOptions } from "../forms/options/columnOptions";

export const doctorAssociationDictionary: NamingSubject = new NamingSubject(
  'masculine',
  'especialista asociado',
  'especialistas asociados',
  'Especialistas Asociados',
  'doctorAssociations'
);

export const doctorAssociationColumnsDoctorView: Column[] = [
  columnId,
  new Column('nurse', 'Especialista'),
  new Column('associationDate', 'Fecha Asociación', { options: new ColumnOptions({ justify: 'end' }) }),
];

export const doctorAssociationColumnsNurseView: Column[] = [
  columnId,
  new Column('doctor', 'Médico'),
  new Column('doctorSpecialty', 'Especialidad'),
  new Column('associationDate', 'Fecha Asociación', { options: new ColumnOptions({ justify: 'end' }) }),
];

export const doctorAssociationFiltersFormInfo: FormInfo<DoctorAssociationParams> = {
  ...baseFilterFormInfo,
  doctorId: { label: 'ID Médico', type: 'number' },
  nurseId: { label: 'ID Especialista', type: 'number' },
  doctorName: { label: 'Nombre Médico', type: 'text' },
  nurseName: { label: 'Nombre Especialista', type: 'text' },
  doctorSpecialty: { label: 'Especialidad Médico', type: 'text' },
  search: { label: 'Buscar', type: 'text' }
} as FormInfo<DoctorAssociationParams>;

export const doctorAssociationCells: PartialCellsOf<DoctorAssociation> = {
  ...baseTableCells,
  doctorId: new TableCellItem<number, 'doctorId'>('doctorId', 'number'),
  nurseId: new TableCellItem<number, 'nurseId'>('nurseId', 'number'),
  doctorName: new TableCellItem<string, 'doctorName'>('doctorName', 'string'),
  doctorEmail: new TableCellItem<string, 'doctorEmail'>('doctorEmail', 'string'),
  doctorPhotoUrl: new TableCellItem<string, 'doctorPhotoUrl'>('doctorPhotoUrl', 'string'),
  doctorSpecialty: new TableCellItem<string, 'doctorSpecialty'>('doctorSpecialty', 'string'),
  nurseName: new TableCellItem<string, 'nurseName'>('nurseName', 'string'),
  nurseEmail: new TableCellItem<string, 'nurseEmail'>('nurseEmail', 'string'),
  nursePhotoUrl: new TableCellItem<string, 'nursePhotoUrl'>('nursePhotoUrl', 'string'),
  associationDate: new TableCellItem<Date, 'associationDate'>('associationDate', 'date', {
    justification: 'end',
    fullDate: true
  }),
} as PartialCellsOf<DoctorAssociation>;
