import { Component, inject, model, ModelSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';
import Event from "src/app/_models/events/event";
import { Router } from '@angular/router';
import { EventsService } from 'src/app/events/events.config';
import { View } from 'src/app/_models/base/types';
import { FormUse } from 'src/app/_models/forms/formTypes';
import { PhotoShape, PhotoSize } from "src/app/_models/photos/photoTypes";
import { TooltipDirective } from "ngx-bootstrap/tooltip";

@Component({
  selector: 'div[eventSummary]',
  standalone: true,
  imports: [ CommonModule, ProfilePictureComponent, TooltipDirective ],
  templateUrl: './event-summary.component.html',
  styleUrls: [ './event-summary.component.scss' ]
})
export class EventSummaryComponent {
  protected readonly PhotoShape: typeof PhotoShape = PhotoShape;
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;

  readonly router: Router = inject(Router);
  readonly service: EventsService = inject(EventsService);

  orientation:ModelSignal<'vertical' | 'horizontal'> = model.required();
  summaryMode: ModelSignal<boolean> = model.required();

  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  item: ModelSignal<Event | null> = model.required();
  key: ModelSignal<string | null> = model.required();
  title: ModelSignal<string | null> = model.required();
}
