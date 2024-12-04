import { TableCellItem } from "./tableCellItem";

export type PartialCellsOf<T> = CellsOf<Partial<T>>;

export type TableCells =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'code'
  | 'currency'
  | 'codePair';export type CellsOf<T> = {
  [K in keyof T]: TableCellItem<T[K], K>;
};
export type TableCellItemJustification = "start" | "center" | "end";

