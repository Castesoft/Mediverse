import { Component } from "@angular/core";


@Component({
  host: { class: 'd-flex align-items-center flex-nowrap text-nowrap py-1', },
  selector: 'div[toolbarActions]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class ToolbarActionsComponent {
}
