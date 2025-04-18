import { InputSignal } from "@angular/core";
import { Entity } from "src/app/_models/base/entity";


export interface ITableMenu<T extends Entity> {
  item: InputSignal<T>;
  key: InputSignal<string>;
}
