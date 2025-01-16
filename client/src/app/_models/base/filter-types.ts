import { MatDrawerMode } from "@angular/material/sidenav";

export enum FilterOrientation {
  VERTICAL = "vertical",
  HORIZONTAL = "horizontal",
}

export enum FilterPosition {
  START = "start",
  END = "end",
}

export enum DrawerMode {
  OVER = "over",
  SIDE = "side",
  PUSH = "push",
}

export class FilterConfiguration {
  orientation: FilterOrientation = FilterOrientation.VERTICAL;
  mode: MatDrawerMode = DrawerMode.OVER;
  position: FilterPosition = FilterPosition.END;

  constructor(orientation = FilterOrientation.VERTICAL, mode = DrawerMode.OVER, position = FilterPosition.END) {
    this.orientation = orientation;
    this.mode = mode;
    this.position = position;
  }
}
