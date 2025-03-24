import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import {
  AccountChildWrapperComponent
} from "src/app/account/components/account-child-wrapper/account-child-wrapper.component";
import { OrderFormComponent } from "src/app/orders/order-form.component";
import { FormUse } from "src/app/_models/forms/formTypes";
import { View } from "src/app/_models/base/types";
import { Order } from "src/app/_models/orders/order";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-account-order-detail',
  templateUrl: './account-order-detail.component.html',
  styleUrl: './account-order-detail.component.scss',
  imports: [
    AccountChildWrapperComponent,
    OrderFormComponent
  ],
})
export class AccountOrderDetailComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private destroyRef: DestroyRef = inject(DestroyRef);

  use: WritableSignal<FormUse> = signal<FormUse>(FormUse.DETAIL);
  view: WritableSignal<View> = signal<View>('page');
  key: WritableSignal<string> = signal<string>('account-order-detail');
  item: WritableSignal<Order | null> = signal<Order | null>(null);
  fromAccountRoute: WritableSignal<boolean> = signal<boolean>(true);

  ngOnInit(): void {
    this.subscribeToRouteData();
  }

  private subscribeToRouteData() {
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.item.set(data['item']);
      },
    });
  }
}
