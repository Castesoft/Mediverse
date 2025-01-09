import { CurrencyPipe } from '@angular/common';
import { Component, model } from '@angular/core';
import { Service } from "src/app/_models/services/service";

@Component({
  selector: 'event-services-summary, div[eventServicesSummary]',
  templateUrl: './event-services-summary.component.html',
  imports: [ CurrencyPipe ],
  standalone: true,
})
export class EventServicesSummaryComponent {
  item = model.required<Service>();
}
