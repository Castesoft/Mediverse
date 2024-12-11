import { Component } from "@angular/core";


@Component({
  host: { class: 'container-fluid d-flex flex-stack flex-wrap flex-sm-nowrap', },
  selector: 'div[toolbarContainer]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class ToolbarContainerComponent {
}
