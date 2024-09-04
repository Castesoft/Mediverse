import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Service } from 'src/app/_models/service';

@Component({
  selector: 'event-services-summary, div[eventServicesSummary]',
  template: `
    <div class="row">
      <div class="col-9">
        <p class="fs-5 fw-semibold mb-0">
          {{ item.name }}
        </p>
      </div>
      <div class="col-3 text-end fw-bolder">
        {{ item.price | currency : "MXN" }}
      </div>
      <div class="col-12 mt-3">
        <p [style.font-size]="'12px'"
           class="text-gray-600">
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
