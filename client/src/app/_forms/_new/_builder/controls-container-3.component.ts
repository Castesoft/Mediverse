import { NgClass } from "@angular/common";
import { Component, input } from "@angular/core";

@Component({
  host: { class: 'd-flex mb-2', type: 'submit', },
  selector: 'div[container3]',
  template: `
  <div class="container-small justify-content-start ms-0"
    [ngClass]="{'bg-body-emphasis border rounded p-4 pb-1': type() === 'card', 'px-0': type() === 'inline'}"
    >
    <ng-content></ng-content>
  </div>`,
  standalone: true,
  imports: [ NgClass, ],
})
export class ControlsContainer3Component {
  type = input.required<'inline' | 'card'>();
}
