import { Component } from "@angular/core";


// header logo bar

@Component({
  host: { class: 'd-flex align-items-center flex-grow-1 flex-lg-grow-0', },
  selector: 'div[headerLogo]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class HeaderLogoComponent {
}
