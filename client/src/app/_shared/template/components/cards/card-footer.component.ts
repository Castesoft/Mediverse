import { Component } from "@angular/core";


@Component({
  host: { class: 'card-footer d-flex justify-content-end py-6 px-9', },
  selector: 'div[cardFooter]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class CardFooterComponent {
}
