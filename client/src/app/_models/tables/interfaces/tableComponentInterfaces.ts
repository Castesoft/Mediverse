import { ModelSignal } from "@angular/core";
import { Entity } from "src/app/_models/base/entity";


export interface ITableMenu<T extends Entity> {
  item: ModelSignal<T>;
  key: ModelSignal<string | null>;
}
