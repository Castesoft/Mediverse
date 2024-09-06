import {Component, inject, input, model, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {TabDirective, TabsetComponent} from 'ngx-bootstrap/tabs';
import {Event} from 'src/app/_models/event';
import {CurrencyPipe, DatePipe, NgSwitch, NgSwitchCase} from "@angular/common";
import {BootstrapModule} from "src/app/_shared/bootstrap.module";
import {DashboardModule} from "src/app/home/dashboard/dashboard.module";
import {FormUse} from "src/app/_models/types";
import {IconsService} from "../_services/icons.service";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EventServicesSummaryComponent } from 'src/app/events/components/event-services-summary.component';
import { UserProfilePictureComponent } from '../users/components/user-profile-picture/user-profile-picture.component';
import { PaymentsTableComponent } from '../_shared/components/payments-table/payments-table.component';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'div[eventDetailView]',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
  standalone: true,
  imports: [
    DatePipe, RouterModule, BootstrapModule, NgSwitch, NgSwitchCase, DashboardModule, CurrencyPipe, FontAwesomeModule,
    EventServicesSummaryComponent, UserProfilePictureComponent, PaymentsTableComponent
  ]
})
export class EventDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(BsModalService);
  icons = inject(IconsService);

  use = input.required<FormUse>();
  key = input.required<string>();
  view = input.required<string>();

  item = model.required<Event>();

  id!: number;

  tax?: number;
  total?: number;

  activeTabId: string = 'tab1';
  summaryMode: boolean = true;

  @ViewChild('staticTabs', {static: false}) staticTabs!: TabsetComponent;

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;

    if (this.item() && this.item()!.service) {
      this.tax = this.item()!.service!.price * 0.16;
      this.total = this.item()!.service!.price + this.tax;
    }

    const currentUrl = this.router.url;
    if (currentUrl.split('/').length === 4 && !isNaN(+currentUrl.split('/')[3])) {
      this.summaryMode = false;
    }
  }

  onSelect(data: TabDirective): void {
    if (data.id) {
      console.log('Selected Tab Id: ', data.id);
      this.activeTabId = data.id;
    }
  }

  goToEvent() {
    this.router.navigate(['/home/events', this.item().id]);
    this.modalService.hide();
  }
}
