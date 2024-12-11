import { Component } from "@angular/core";


// page

@Component({
  host: { class: 'page d-flex flex-row flex-column-fluid', },
  selector: 'div[page]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class PageComponent {
}
