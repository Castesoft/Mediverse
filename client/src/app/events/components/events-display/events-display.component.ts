import { Component, inject, input, model } from '@angular/core';
import { Role, View } from 'src/app/_models/types';
import { CatalogMode } from 'src/app/_models/types';
import { EventsService } from 'src/app/_services/events.service';
import { CreateBtnComponent } from 'src/app/_shared/layout.module';
import { EventsCatalogComponent } from '../events-catalog.component';
import { EventsCalendarComponent } from '../events-calendar.component';

@Component({
  selector: 'app-events-display',
  standalone: true,
  imports: [CreateBtnComponent, EventsCalendarComponent, EventsCatalogComponent],
  templateUrl: './events-display.component.html',
})
export class EventsDisplayComponent {
  service = inject(EventsService);

  calendarView = 'calendar';

  key = model.required<string>();
  mode = model.required<CatalogMode>();
  view = model.required<View>();
  role = model.required<Role>();
}
