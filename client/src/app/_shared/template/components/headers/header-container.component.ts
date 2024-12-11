import { Component } from "@angular/core";


// header container

@Component({
  host: { class: 'container-fluid d-flex align-items-stretch justify-content-between', },
  selector: 'div[headerContainer]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class HeaderContainerComponent {
}
