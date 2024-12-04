import { Units } from "src/app/_models/base/types";
import { TableCells } from "src/app/_models/tables/tableCellTypes";
import { TableCellItemJustification } from "./tableCellTypes";


export class TableCellItem<T, TKey extends keyof any> {
  key: TKey;
  type: TableCells;
  justification: TableCellItemJustification = "start";
  isLink = false;
  showCodeSpan = true;
  fullDate = false;
  baseUrl?: string;
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
