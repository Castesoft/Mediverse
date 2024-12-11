import { Component } from "@angular/core";


@Component({
  host: { class: 'breadcrumb fw-semibold fs-base my-1', },
  selector: 'ul[breadcrumb]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class BreadcrumbComponent {
}
