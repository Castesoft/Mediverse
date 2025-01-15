import { MatDrawerMode } from "@angular/material/sidenav";

export type Units = "kg" | "días" | "ha" | "años";
export type CatalogMode = "view" | "select" | "multiselect" | "readonly";
export type View = 'page' | 'modal' | 'inline';
export type DetailActions = 'edit' | 'cancel' | 'delete' | 'create';

export type FilterOrientation = "vertical" | "horizontal";
export type FilterPosition = "start" | "end";

export class FilterConfiguration {
  orientation: FilterOrientation = "vertical";
  mode: MatDrawerMode = "over";
  position: FilterPosition = "end";

  constructor(orientation: FilterOrientation = "vertical", mode: MatDrawerMode = "over", position: FilterPosition = "end") {
    this.orientation = orientation;
    this.mode = mode;
    this.position = position;
  }
}
