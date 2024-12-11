import { Component } from "@angular/core";


@Component({
  host: { class: 'post fs-6 d-flex flex-column-fluid', },
  selector: 'div[post]',
  template: `
  <div class="container-xxl">
    <ng-content></ng-content>
  </div>
  `,
  standalone: true,
  imports: [],
})
export class PostComponent {
}
