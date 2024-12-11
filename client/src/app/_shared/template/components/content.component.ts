import { Component } from "@angular/core";


@Component({
  host: { class: 'content fs-6 d-flex flex-column flex-column-fluid', },
  selector: 'div[content]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class ContentComponent {
}
