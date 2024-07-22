import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Service } from 'src/app/_models/service';

@Component({
  selector: 'event-services-summary, div[eventServicesSummary]',
  template: `
  <div class="row">
  <div class="col">
    <p class="fs-5 fw-semibold mb-0">
      {{ item.name }}
    </p>
  </div>
  <div class="col text-end fw-bolder">
    {{ item.price | currency : "MXN" }}
  </div>
  <div class="col-12">
    <p class="text-gray-600" [style.font-size]="'12px'">
      {{ item.description }}
    </p>
  </div>
</div>
  `,
  standalone: true,
  imports: [ CurrencyPipe, ]
})
export class EventServicesSummaryComponent {
  @Input({ required: true }) item!: Service;
}
