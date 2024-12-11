import { Component, input } from "@angular/core";


@Component({
  host: { class: 'symbol-label bg-light-danger text-danger fs-1 fw-bolder', },
  selector: 'span[symbolLabel]',
  template: `{{label()[0]}}`,
  standalone: true,
})
export class SymbolLabelComponent {
  label = input.required<string>();
}
