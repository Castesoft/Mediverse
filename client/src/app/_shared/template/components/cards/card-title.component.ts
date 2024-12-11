import { Component, input } from "@angular/core";


// card title

@Component({
  host: { class: 'card-title m-0', },
  selector: 'div[cardTitle]',
  template: `{{title()}}`,
  standalone: true,
})
export class CardTitleComponent {
  title = input.required<string>();
}
