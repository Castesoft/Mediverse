import { CommonModule } from '@angular/common';
import { Component, inject, model } from "@angular/core";
import { PaddingService } from 'src/app/_services/padding.service';


@Component({
  host: { class: 'post fs-6 d-flex flex-column-fluid', },
  selector: 'div[post]',
  template: `
  <div class="container-xxl" [ngStyle]="{ 'max-width': padding.withPadding() ? '1320px' : 'none' }">
    <ng-content></ng-content>
  </div>
  `,
  standalone: true,
  imports: [ CommonModule, ],
})
export class PostComponent {
  padding = inject(PaddingService);
}
