import { Component } from "@angular/core";

@Component({
  host: { class: 'col d-flex align-items-end mb-2 p-1', },
  selector: 'div[controlsWrapper3]',
  template: `
    <ng-content></ng-content>
  `,
  standalone: true,
})
export class ControlsWrapper3Component {}
