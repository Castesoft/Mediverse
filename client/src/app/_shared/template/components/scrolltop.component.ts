import { Component } from '@angular/core';


@Component({
  host: { class: 'scrolltop' },
  selector: '[scrolltop]',
  template: `
    <i class="ki-duotone ki-arrow-up">
      <span class="path1"></span>
      <span class="path2"></span>
    </i>
  `,
  standalone: true,
  imports: [],
})
export class ScrolltopComponent {
}
