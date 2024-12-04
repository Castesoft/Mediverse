import { Units } from "src/app/_models/base/types";

export class ColumnOptions {
  justify?: "start" | "center" | "end" = "start";
  isNew? = false;
  unit?: Units = undefined;
  devModeOnly?: boolean;

  constructor(init?: Partial<ColumnOptions>) {
    Object.assign(this, init);
  }
}
