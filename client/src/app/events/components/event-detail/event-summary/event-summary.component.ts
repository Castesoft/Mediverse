import { Component, effect, inject, model, ModelSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';
import Event from "src/app/_models/events/event";
import { Router } from '@angular/router';
import { PhotoShape, PhotoSize } from "src/app/_models/photos/photoTypes";
import { TooltipDirective } from "ngx-bootstrap/tooltip";
import { User } from "src/app/_models/users/user";
import { EventsService } from "src/app/events/events.service";

@Component({
  selector: 'div[eventSummary]',
  standalone: true,
  imports: [ CommonModule, ProfilePictureComponent, TooltipDirective ],
  templateUrl: './event-summary.component.html',
  styleUrls: [ './event-summary.component.scss' ]
})
export class EventSummaryComponent<T extends User> {
  protected readonly PhotoShape: typeof PhotoShape = PhotoShape;
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;

  readonly router: Router = inject(Router);
  readonly service: EventsService = inject(EventsService);

  userExtendItem: T | null = null;

  orientation: ModelSignal<'vertical' | 'horizontal'> = model('vertical' as 'vertical' | 'horizontal');
  roleToShow: ModelSignal<'patient' | 'doctor'> = model('patient' as 'patient' | 'doctor');
  summaryMode: ModelSignal<boolean> = model(true);

  item: ModelSignal<Event | null> = model.required();

  constructor() {
    effect(() => {
      if (this.item()) {
        if (this.roleToShow().toLowerCase() === 'patient') {
          this.userExtendItem = this.castUser<T>(this.item()!.patient);
        } else if (this.roleToShow().toLowerCase() === 'doctor') {
          this.userExtendItem = this.castUser<T>(this.item()!.doctor);
        }
      }
    })
  }

  castUser<T extends User>(user: User): T {
    return user as T;
  }
}
