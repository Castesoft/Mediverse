import { Component, effect, inject } from '@angular/core';
import Event from "src/app/_models/events/event";
import { CatalogMode, View } from "src/app/_models/base/types";
import { createId } from "@paralleldrive/cuid2";
import { EventParams } from "src/app/_models/events/eventParams";
import { EventsCatalogComponent } from "src/app/events/components/events-catalog.component";
import { CalendarView } from "src/app/_models/events/eventTypes";
import { AccountService } from "src/app/_services/account.service";
import { Account } from "src/app/_models/account/account";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { EventsTableDisplayRole } from "src/app/_models/events/eventConstants";

@Component({
  selector: 'app-account-events',
  templateUrl: './account-events.component.html',
  styleUrl: './account-events.component.scss',
  imports: [ EventsCatalogComponent, ],
})
export class AccountEventsComponent {
  private accountService: AccountService = inject(AccountService);

  account: Account | null = null;

  eventItem: Event | null = null;
  eventView: View = 'page';
  eventKey: string = createId();
  eventIsCompact: boolean = true;
  eventMode: CatalogMode = 'view';
  eventCalendarView: CalendarView = 'table';
  eventFiltersCollapsed: boolean = true;
  eventDisplayRole: EventsTableDisplayRole = EventsTableDisplayRole.DOCTOR;
  eventParams: EventParams = new EventParams(this.eventKey, {
    userId: null
  });

  constructor() {
    effect(() => {
      if (this.accountService.current()) {
        this.account = this.accountService.current();
        this.eventParams = new EventParams(this.eventKey, {
          fromSection: SiteSection.HOME,
          userId: this.account?.id
        })
        console.log('Account ID: ', this.account?.id);
      }
    })
  }
}
