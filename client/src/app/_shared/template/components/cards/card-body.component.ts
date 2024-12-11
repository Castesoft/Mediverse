import { Component } from "@angular/core";


@Component({
  host: { class: 'card-body p-9', },
  selector: 'div[cardBody]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class CardBodyComponent {
}
