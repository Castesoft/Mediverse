import {Component, inject, input, model, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {TabDirective, TabsetComponent} from 'ngx-bootstrap/tabs';
import {Event} from 'src/app/_models/event';
import {CurrencyPipe, DatePipe, NgSwitch, NgSwitchCase} from "@angular/common";
import {BootstrapModule} from "src/app/_shared/bootstrap.module";
import {DashboardModule} from "src/app/home/dashboard/dashboard.module";
import {FormUse} from "src/app/_models/types";
import {IconsService} from "../_services/icons.service";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EventServicesSummaryComponent } from 'src/app/events/components/event-services-summary.component';

@Component({
  selector: 'div[eventDetailView]',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
  standalone: true,
  imports: [
    DatePipe, RouterModule, BootstrapModule, NgSwitch, NgSwitchCase, DashboardModule, CurrencyPipe, FontAwesomeModule,
    EventServicesSummaryComponent,
  ]
})
export class EventDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  icons = inject(IconsService);

  use = input.required<FormUse>();
  key = input.required<string>();
  view = input.required<string>();

  item = model.required<Event>();

  id!: number;

  tax?: number;
  total?: number;

  activeTabId: string = 'tab1';

  @ViewChild('staticTabs', {static: false}) staticTabs!: TabsetComponent;

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    //
    // if (this.item() && this.item()!.service) {
    //   this.tax = this.item()!.service?.price * 0.16;
    // }
    //   this.total =
    //     this.item().paymentBilling.services.reduce(
    //       (acc: any, service: any) => acc + service.price,
    //       0
    //     ) + this.tax;
    // }
  }

  onSelect(data: TabDirective): void {
    if (data.id) {
      console.log('Selected Tab Id: ', data.id);
      this.activeTabId = data.id;
    }
  }
}
