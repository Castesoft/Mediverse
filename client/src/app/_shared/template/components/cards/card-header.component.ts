import { Component } from "@angular/core";


// card header

@Component({
  host: { class: 'card-header cursor-pointer', },
  selector: 'div[cardHeader]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class CardHeaderComponent {
}
