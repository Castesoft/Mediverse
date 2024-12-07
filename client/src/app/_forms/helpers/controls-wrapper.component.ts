import { NgClass } from "@angular/common";
import { Component, effect, HostBinding, inject, input } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlRows, ControlOrientation } from "src/app/_models/forms/formTypes";
import { IconsService } from "src/app/_services/icons.service";

@Component({
  selector: 'div[controlsRow]',
  template: `
    <ng-content></ng-content>
  `,
  standalone: true,
})
export class ControlsRowComponent {
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
          this.class = `${this.class} row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-2 row-cols-xl-3 row-cols-xxl-4 h-100`;
          break;
        case 1:
          this.class = `${this.class} row-cols-1`;
          break;
        case 2:
          this.class = `${this.class} row-cols-1 row-cols-lg-2`;
          break;
        case 3:
          this.class = `${this.class} row-cols-1 row-cols-lg-3`;
          break;
        case 4:
          this.class = `${this.class} row-cols-1 row-cols-lg-4`;
          break;
        case 5:
          this.class = `${this.class} row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-2 row-cols-xl-3 row-cols-xxl-5 h-100`;
          break;
      }

      switch(this.orientation()) {
        case 'inline':
          this.class = `${this.class} align-items-start`;
          break;
        case 'block':
          this.class = `${this.class} align-items-end`;
          break;
      }
    })
  }
}

@Component({
  host: { class: 'col d-flex align-items-end mb-2 p-1', },
  selector: 'div[controlsWrapper]',
  template: `
    <ng-content></ng-content>
  `,
  standalone: true,
})
export class ControlsWrapperComponent {}

@Component({
  host: { class: 'd-flex mb-2', type: 'submit', },
  selector: 'div[container]',
  // when it is card --> container-small justify-content-start ms-0 bg-normal border rounded p-4 pb-1
  // when it is inline --> container-small justify-content-start ms-0 px-0
  template: `
  <div class="container-small justify-content-start ms-0"
    [ngClass]="{'bg-body-emphasis border rounded p-4 pb-1': type() === 'card', 'px-0': type() === 'inline'}"
    >
    <ng-content></ng-content>
  </div>`,
  standalone: true,
  imports: [ NgClass, ],
})
export class ControlsContainer {
  type = input.required<'inline' | 'card'>();
}

@Component({
  host: { class: 'btn btn-phoenix-primary', },
  selector: 'button[submitButton]',
  template: `
  <fa-icon [icon]="icons.faSave"></fa-icon>
  <span class="d-none d-sm-inline ms-2">Guardar</span>
  `,
  standalone: true,
  imports: [ FontAwesomeModule, ],
})
export class SubmitButtonComponent {
  icons = inject(IconsService);
}
