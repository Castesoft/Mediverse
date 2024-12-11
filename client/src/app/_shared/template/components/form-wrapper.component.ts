import { Component } from "@angular/core";


@Component({
  host: { class: 'form fv-plugins-bootstrap5 fv-plugins-framework', },
  selector: 'div[formWrapper]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class FormWrapperComponent {
}
