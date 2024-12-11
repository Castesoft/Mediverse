import { Component } from "@angular/core";


// catalog card header

@Component({
  host: { class: 'card-header border-0 pt-6', },
  selector: 'div[catalogCardHeader]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class CatalogCardHeaderComponent {
}
