import { Component, DestroyRef, effect, inject, OnInit, signal, WritableSignal } from '@angular/core';
import {
  AccountChildWrapperComponent
} from "src/app/account/components/account-child-wrapper/account-child-wrapper.component";
import { OrdersService } from "src/app/orders/orders.config";
import { createId } from "@paralleldrive/cuid2";
import { AsyncPipe, CurrencyPipe, DatePipe } from "@angular/common";
import {
  CatalogLayoutSkeletonComponent
} from "src/app/_shared/components/catalog-layout-skeleton/catalog-layout-skeleton.component";
import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from "@angular/cdk/menu";
import { ControlDateComponent } from "src/app/_forms/control-date.component";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TableBodyComponent } from "src/app/_shared/template/components/tables/table-body.component";
import { TableMenuCellComponent } from "src/app/_shared/template/components/tables/table-menu-cell.component";
import { TablePagerComponent } from "src/app/_shared/template/components/tables/table-pager.component";
import { TableWrapperComponent } from "src/app/_shared/template/components/tables/table-wrapper.component";
import { UserTableCellComponent } from "src/app/users/components/user-table-cell.component";
import { OrderParams } from "src/app/_models/orders/orderParams";
import { AccountService } from "src/app/_services/account.service";
import { Router, RouterLink } from "@angular/router";
import { Order } from "src/app/_models/orders/order";
import { Account } from "src/app/_models/account/account";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  AddressTableCellComponent
} from "src/app/_shared/template/components/tables/cells/address-table-cell.component";
import { OrdersDeliveryStatusBadgeComponent } from "src/app/orders/components/orders-delivery-status-badge.component";
import { PaymentMethodCellComponent } from "src/app/payments/components/payment-method-cell.component";
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: 'app-account-orders',
  templateUrl: './account-orders.component.html',
  styleUrl: './account-orders.component.scss',
  imports: [
    AccountChildWrapperComponent,
    AsyncPipe,
    CatalogLayoutSkeletonComponent,
    CdkMenu,
    CdkMenuItem,
    ControlDateComponent,
    Forms2Module,
    ReactiveFormsModule,
    TableBodyComponent,
    TableMenuCellComponent,
    TablePagerComponent,
    TableWrapperComponent,
    UserTableCellComponent,
    CdkContextMenuTrigger,
    DatePipe,
    CurrencyPipe,
    AddressTableCellComponent,
    OrdersDeliveryStatusBadgeComponent,
    PaymentMethodCellComponent,
    MatTooltip,
    RouterLink
  ],
})
export class AccountOrdersComponent implements OnInit {
  private readonly accountService: AccountService = inject(AccountService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly fb: FormBuilder = inject(FormBuilder);

  readonly ordersService: OrdersService = inject(OrdersService);
  readonly router: Router = inject(Router);

  data: Order[] = [];
  account: Account | null = null;
  filterForm!: FormGroup;

  key: string = createId();
  isCompact: boolean = false;
  params: WritableSignal<OrderParams> = signal<OrderParams>(new OrderParams(this.key, {
    userId: null,
    fromAccountRoute: true,
  }))

  constructor() {
    effect(() => {
      const currentAccount: Account | null = this.accountService.current();
      if (!currentAccount) return;

      if (!this.account) {
        this.account = currentAccount;
        this.params.set(new OrderParams(this.key, {
          fromSection: SiteSection.HOME,
          userId: this.account.id,
          fromAccountRoute: true,
        }))
      }
    });

    effect(() => {
      this.loadPagedList()
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.subscribeToFormChanges();
    this.subscribeToPagedOrderData();
  }

  /**
   * Resets the filters to their initial state and reloads the order list.
   */
  resetFilters(): void {
    this.filterForm.reset({
      status: "",
      search: "",
      dateFrom: null,
      dateTo: null
    });

    this.params.set(new OrderParams(this.key, {
      fromSection: SiteSection.HOME,
      userId: this.account?.id || null,
      fromAccountRoute: true,
    }))

    this.loadPagedList();
  }

  /**
   * Initializes the reactive form.
   */
  private initForm(): void {
    this.filterForm = this.fb.group({
      status: [ "" ],
      search: [ "" ],
      dateFrom: [ null ],
      dateTo: [ null ]
    });
  }

  /**
   * Subscribes to the entire form value changes (with debouncing to avoid rapid reloads)
   * and updates the params accordingly.
   */
  private subscribeToFormChanges(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value: any) => {
        this.updateParams(value);
        this.loadPagedList();
      });
  }

  /**
   * Updates the OrderParams based on the form value.
   * @param value The current form value.
   */
  private updateParams(value: any): void {
    const updatedParams = { ...this.params(), ...value };

    updatedParams.dateFrom = value.dateFrom ? new Date(value.dateFrom) : null;
    updatedParams.dateTo = value.dateTo ? new Date(value.dateTo) : null;

    this.params.set(updatedParams);
  }

  /**
   * Loads the paged order list using the current parameters.
   */
  private loadPagedList(): void {
    this.ordersService.loadPagedList(this.key, this.params()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  /**
   * Subscribes to the paged order data stream.
   */
  private subscribeToPagedOrderData(): void {
    this.ordersService.data$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((pagedList: Order[]) => {
      this.data = pagedList;
    });
  }
}
