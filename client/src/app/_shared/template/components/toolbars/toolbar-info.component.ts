import { Component } from "@angular/core";


@Component({
  host: { class: 'd-flex flex-column align-items-start justify-content-center flex-wrap me-2', },
  selector: 'div[toolbarInfo]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class ToolbarInfoComponent {
}
