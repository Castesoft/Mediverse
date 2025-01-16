import { Units } from "src/app/_models/base/types";
import { TableCellItemJustification } from "./tableCellTypes";
import { Entity } from "src/app/_models/base/entity";


export type CellsOf<T> = {
  [K in keyof T]: TableCellItem<T[K], K>;
};
export type PartialCellsOf<T> = CellsOf<Partial<T>>;

export class TableCellItem<T, TKey extends keyof any> {
  key: TKey;
  type: TableCells;
  justification: TableCellItemJustification = "start";
  isLink = false;
  showCodeSpan = true;
  fullDate = false;
  noWrap = false;
  baseUrl?: string;
  color?: TableCellColor;
  unit?: Units;
  label?: string;
  pair?: { first: TableCellItem<T, any>; second: TableCellItem<T, any>; };

  constructor(key: TKey, type: TableCells, init?: Partial<TableCellItem<T, TKey>>) {
    Object.assign(this, init);

    this.key = key;
    this.type = type;

    switch (typeof type) {
      case "string":
        this.justification = "start";
        break;
      case "number":
        this.justification = "end";
        break;
      case "boolean":
        this.justification = "center";
        break;
      default:
        this.justification = "start";
        break;
    }

    if (init?.justification) {
      switch (init.justification) {
        case 'start':
          this.justification = 'start';
          break;
        case 'center':
          this.justification = 'center';
          break;
        case 'end':
          this.justification = 'end';
          break;
        default:
          break;
      }
    }
  }
}

export type TableCells = "string" |
  "number" |
  "boolean" |
  "date" |
  "code" |
  "currency" |
  "codePair" |
  "sex" |
  "phoneNumber" |
  "badge";

export type TableCellColor = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";

export const tableCellCreatedAt: TableCellItem<Date, 'createdAt'> = new TableCellItem<Date, "createdAt">("createdAt", "date", { fullDate: true });
export const tableCellDescription: TableCellItem<string, 'description'> = new TableCellItem<string, "description">("description", "string");
export const tableCellEnabled: TableCellItem<boolean, 'enabled'> = new TableCellItem<boolean, "enabled">("enabled", "boolean");
export const tableCellName: TableCellItem<string, 'name'> = new TableCellItem<string, "name">("name", "string");
export const tableCellCode: TableCellItem<string, 'code'> = new TableCellItem<string, "code">("code", "string");
export const tableCellVisible: TableCellItem<boolean, 'visible'> = new TableCellItem<boolean, "visible">("visible", "boolean");
export const tableCellId: TableCellItem<number, 'id'> = new TableCellItem<number, "id">("id", "number");
export const tableCellCodeNumber: TableCellItem<number, 'codeNumber'> = new TableCellItem<number, "codeNumber">("codeNumber", "number");
export const tableCellIsSelected: TableCellItem<boolean, 'isSelected'> = new TableCellItem<boolean, "isSelected">("isSelected", "boolean");


export const baseTableCells: PartialCellsOf<Entity> = {
  createdAt: tableCellCreatedAt,
  description: tableCellDescription,
  enabled: tableCellEnabled,
  name: tableCellName,
  code: tableCellCode,
  visible: tableCellVisible,
  id: tableCellId,
  codeNumber: tableCellCodeNumber,
  isSelected: tableCellIsSelected,
} as PartialCellsOf<Entity>;
