import { CommonModule } from '@angular/common';
import { Component, effect, OnDestroy } from '@angular/core';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';
import BaseRouteDetail from 'src/app/_models/base/components/extensions/routes/baseRouteDetail';
import Event from 'src/app/_models/events/event';
import { FormUse } from 'src/app/_models/forms/formTypes';
import { EventDetailComponent } from 'src/app/events/events.config';


@Component({
  selector: 'account-event-detail-route',
  templateUrl: './account-event-detail.component.html',
  standalone: true,
  imports: [ CommonModule, Forms2Module, EventDetailComponent, ],
})
export class AccountEventDetailComponent
  extends BaseRouteDetail<Event>
  implements OnDestroy
{

  constructor() {
    super('events', FormUse.DETAIL);

    this.key.set(`${this.router.url}#account-event-detail`);

    effect(() => {

    });
  }

  ngOnDestroy(): void {

  }

}
