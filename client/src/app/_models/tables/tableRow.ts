import { Entity } from "src/app/_models/base/entity";
import { CellsOf, TableCellItem } from "src/app/_models/tables/tableCellItem";

export class TableRow<T extends Entity | object> {
  items: CellsOf<T>;

  constructor(entity: T) {
    this.items = {} as CellsOf<T>;

    for (const key of Object.keys(entity) as Array<keyof T>) {
      this.items[key] = new TableCellItem(key, "string");
    }

  }

  getItems(keys?: (keyof T)[]): { item: TableCellItem<T[keyof T], keyof T>; }[] {
    if (!keys) {
      return Object.keys(this.items).map(key => {
        return { item: this.items[key as keyof T] };
      });
    } else {
      return keys.map(key => {
        return { item: this.items[key] };
      });
    }
  }
}
