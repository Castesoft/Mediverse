import { Component, input, InputSignal } from "@angular/core";

@Component({
  host: { class: 'card-title m-0', },
  selector: 'div[cardTitle]',
  template: `<h3>{{ title() }}</h3>`,
  standalone: true,
})
export class CardTitleComponent {
  title: InputSignal<string> = input.required<string>();
}
