import { Component, inject, model, ModelSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';
import Event from "src/app/_models/events/event";
import { Router } from '@angular/router';
import { EventsService } from 'src/app/events/events.config';
import { View } from 'src/app/_models/base/types';
import { FormUse } from 'src/app/_models/forms/formTypes';
import { PhotoShape, PhotoSize } from "src/app/_models/photos/photoTypes";

@Component({
  selector: 'div[eventSummary]',
  standalone: true,
  imports: [CommonModule, ProfilePictureComponent],
  templateUrl: './event-summary.component.html',
})
export class EventSummaryComponent {
  router = inject(Router);
  service = inject(EventsService);

  orientation = model.required<'vertical' | 'horizontal'>();
  summaryMode = model.required<boolean>();

  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  item: ModelSignal<Event | null> = model.required();
  key: ModelSignal<string | null> = model.required();
  title: ModelSignal<string | null> = model.required();
  protected readonly PhotoShape = PhotoShape;
  protected readonly PhotoSize = PhotoSize;
}
