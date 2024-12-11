import { Component } from "@angular/core";


// root

@Component({
  host: { class: 'd-flex flex-column flex-root h-100', },
  selector: 'div[root]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class RootComponent {
}
