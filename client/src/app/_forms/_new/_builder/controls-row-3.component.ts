import { Component, input, HostBinding, effect } from "@angular/core";
import { ControlRows, ControlOrientation } from "src/app/_forms/form";

@Component({
  selector: 'div[controlsRow3]',
  template: `
    <ng-content></ng-content>
  `,
  standalone: true,
})
export class ControlsRow3Component {
  grid = input<ControlRows>('responsive');

  orientation = input<ControlOrientation>('inline');

  class = 'row d-flex';

  @HostBinding('class') get hostClasses() {
    return this.class;
  }

  constructor() {
    effect(() => {
      switch (this.grid()) {
        case 'responsive':
          this.class = `${this.class} row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-2 row-cols-xl-3 row-cols-xxl-4 h-100 gx-2 gy-1`;
          break;
        case 1:
          this.class = `${this.class} row-cols-1 gx-2 gy-1`;
          break;
        case 2:
          this.class = `${this.class} row-cols-1 row-cols-lg-2 gx-2 gy-1`;
          break;
        case 3:
          this.class = `${this.class} row-cols-1 row-cols-lg-3 gx-2 gy-1`;
          break;
        case 4:
          this.class = `${this.class} row-cols-1 row-cols-lg-4 gx-2 gy-1`;
          break;
        case 5:
          this.class = `${this.class} row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-2 row-cols-xl-3 row-cols-xxl-5 h-100 gx-2 gy-1`;
          break;
      }

      switch(this.orientation()) {
        case 'inline':
          this.class = `${this.class} align-items-start gx-2 gy-1`;
          break;
        case 'block':
          this.class = `${this.class} align-items-end gx-2 gy-1`;
          break;
      }
    })
  }
}
