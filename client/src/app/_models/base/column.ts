import { ColumnOptions } from "src/app/_models/forms/options/columnOptions";


export class Column {
  name: string;
  label: string;
  devModeOnly?: boolean;
  options?: ColumnOptions;

  constructor(name: string, label: string, init?: Partial<Column>) {
    Object.assign(this, init);

    this.name = name;
    this.label = label;
  }
}

export const columnCode: Column = new Column('code', 'Código');
export const columnCodeNumber: Column = new Column('codeNumber', 'Número de Código');
export const columnCreatedAt: Column = new Column('createdAt', 'Creado');
export const columnDescription: Column = new Column('description', 'Descripción');
export const columnEnabled: Column = new Column('enabled', 'Habilitado');
export const columnId: Column = new Column('id', 'ID');
export const columnIsSelected: Column = new Column('isSelected', 'Seleccionado');
export const columnName: Column = new Column('name', 'Nombre');
export const columnVisible: Column = new Column('visible', 'Visible');

export const baseColumns: Column[] = [
  columnCode,
  columnCodeNumber,
  columnCreatedAt,
  columnDescription,
  columnEnabled,
  columnId,
  columnIsSelected,
  columnName,
  columnVisible,
];
