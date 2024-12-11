import { Component } from "@angular/core";


// header topbar

@Component({
  host: { class: 'd-flex align-items-stretch justify-content-between flex-lg-grow-1', },
  selector: 'div[headerTopbar]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class HeaderTopbarComponent {
}
