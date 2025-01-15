import { Component } from "@angular/core";


@Component({
  host: { class: 'toolbar', id: 'kt_toolbar', },
  selector: 'div[toolbar]',
  template: `
    <ng-content></ng-content>`,
  standalone: true,
})
export class ToolbarComponent {
}
