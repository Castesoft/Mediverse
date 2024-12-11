import { Component } from "@angular/core";


@Component({
  host: { class: 'card mb-5 mb-xl-10', },
  selector: 'div[card]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class CardComponent {
}
