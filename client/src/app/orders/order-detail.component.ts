import { Component, computed, inject, input, model, OnDestroy, OnInit } from "@angular/core";
import { FormUse, View } from "src/app/_models/types";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { IconsService } from "src/app/_services/icons.service";
import { Subject } from "rxjs";
import { Order } from "../_models/orders/order";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { EventServicesSummaryComponent } from "src/app/events/components/event-services-summary.component";
import { OrderProductsSummaryComponent } from "src/app/orders/components/order-items-summary.component";
import { PatientSummaryCardComponent } from "src/app/patients/patient-summary-card.component";
import { OrdersDeliveryStatusBadgeComponent } from "src/app/orders/components/orders-deilvery-status-badge.component";
import { OrdersStatusBadgeComponent } from "src/app/orders/components/orders-status-badge.component";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { OrdersService } from "src/app/_services/orders.service";
import { parseOrderDeliveryStatusIndex } from './orders-util';
@Component({
  selector: 'div[orderDetailView]',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  standalone: true,
  imports: [
    CurrencyPipe,
    EventServicesSummaryComponent,
    OrderProductsSummaryComponent,
    PatientSummaryCardComponent,
    OrdersDeliveryStatusBadgeComponent,
    OrdersStatusBadgeComponent,
    DatePipe,
    FaIconComponent,
    RouterLink
  ]
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  private route = inject(ActivatedRoute);
  private orderService = inject(OrdersService);
  icons = inject(IconsService);

  use = model.required<FormUse>();
  key = model.required<string>();
  view = model.required<View>();
  item = model.required<Order>();

  id!: number;
  staticMapUrl!: string;
  deliveryStatusIndex = computed(() => parseOrderDeliveryStatusIndex(this.item()!.deliveryStatus!));

  get tax() {
    return this.item()!.items.reduce((acc, x) => acc + (x.price! * x.quantity! * 0.16), 0);
  }

  get total() {
    return this.item()!.items.reduce((acc, x) => acc + (x.price! * x.quantity!), 0) + this.tax;
  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.generateStaticMapUrl();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  generateStaticMapUrl() {
    if (this.item() && this.item().address) {
      const address = `Avenida de la Paz 1234, Colonia Centro, CDMX`;
      const encodedAddress = encodeURIComponent(address);
      const apiKey = 'YOUR_GOOGLE_STATIC_MAPS_API_KEY';
      this.staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${encodedAddress}&key=${apiKey}`;
    }
  }

  approve() {
    this.orderService.approve(this.id).subscribe((order) => {
      this.item.set(order);
    });
  }
}
