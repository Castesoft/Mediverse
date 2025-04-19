import { Component, DestroyRef, effect, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { createId } from "@paralleldrive/cuid2";
import { EventParams } from "src/app/_models/events/eventParams";
import { AccountService } from "src/app/_services/account.service";
import { Account } from "src/app/_models/account/account";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { TableWrapperComponent } from "src/app/_shared/template/components/tables/table-wrapper.component";
import { TableBodyComponent } from "src/app/_shared/template/components/tables/table-body.component";
import Event from "src/app/_models/events/event";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { TablePagerComponent } from "src/app/_shared/template/components/tables/table-pager.component";
import { CdkContextMenuTrigger } from "@angular/cdk/menu";
import { TableMenuCellComponent } from "src/app/_shared/template/components/tables/table-menu-cell.component";
import { TimePeriodCellComponent } from "src/app/_shared/template/components/tables/cells/time-period-cell.component";
import { UserTableCellComponent } from "src/app/users/components/user-table-cell.component";
import { MatTooltip } from "@angular/material/tooltip";
import {
  AddressTableCellComponent
} from "src/app/_shared/template/components/tables/cells/address-table-cell.component";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ControlDateComponent } from "src/app/_forms/control-date.component";
import {
  CatalogLayoutSkeletonComponent
} from "src/app/_shared/components/catalog-layout-skeleton/catalog-layout-skeleton.component";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from "@angular/router";
import {
  AccountChildWrapperComponent
} from "src/app/account/components/account-child-wrapper/account-child-wrapper.component";
import { EventsService } from "src/app/events/events.service";
import { AsyncPipe } from "@angular/common";
import { EventsTableMenuComponent } from "src/app/events/components/events-table/events-table-menu.component";

@Component({
  selector: 'app-account-events',
  templateUrl: './account-events.component.html',
  styleUrls: [ './account-events.component.scss' ],
  standalone: true,
  imports: [
    TableWrapperComponent,
    TableBodyComponent,
    TablePagerComponent,
    CdkContextMenuTrigger,
    TableMenuCellComponent,
    TimePeriodCellComponent,
    UserTableCellComponent,
    MatTooltip,
    AddressTableCellComponent,
    Forms2Module,
    ReactiveFormsModule,
    ControlDateComponent,
    CatalogLayoutSkeletonComponent,
    AccountChildWrapperComponent,
    AsyncPipe,
    EventsTableMenuComponent
  ],
})
export class AccountEventsComponent implements OnInit {
  private readonly accountService: AccountService = inject(AccountService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly fb: FormBuilder = inject(FormBuilder);

  readonly eventsService: EventsService = inject(EventsService);
  readonly router: Router = inject(Router);

  data: Event[] = [];
  account: Account | null = null;
  filterForm!: FormGroup;

  key: string = createId();
  isCompact: boolean = false;
  params: WritableSignal<EventParams> = signal<EventParams>(new EventParams(this.key, {
    userId: null,
    fromAccountRoute: true,
  }));

  constructor() {
    effect(() => {
      const currentAccount: Account | null = this.accountService.current();
      if (!currentAccount) return;

      if (!this.account) {
        this.account = currentAccount;
        this.params.set(new EventParams(this.key, {
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
    this.subscribeToStatusChanges();
    this.subscribeToFormChanges();
    this.subscribeToPagedEventData();
  }

  /**
   * Resets the filters to their initial state and reloads the event list.
   */
  resetFilters(): void {
    this.filterForm.reset({
      status: "",
      search: "",
      dateFrom: null,
      dateTo: null
    });

    this.params.set(new EventParams(this.key, {
      fromSection: SiteSection.HOME,
      userId: this.account?.id || null,
      fromAccountRoute: true,
    }))

    this.loadPagedList();
  }

  /**
   * Subscribes to the 'status' control changes and adjusts the date filters accordingly.
   */
  private subscribeToStatusChanges(): void {
    this.filterForm.get('status')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(status => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (status) {
          case 'before-current-date':
            this.filterForm.patchValue({ dateFrom: null, dateTo: today });
            break;
          case 'after-current-date':
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            this.filterForm.patchValue({ dateFrom: tomorrow, dateTo: null });
            break;
          case 'today':
            const startOfToday = new Date(today);
            const endOfToday = new Date(today);
            endOfToday.setHours(23, 59, 59, 999);
            this.filterForm.patchValue({ dateFrom: startOfToday, dateTo: endOfToday });
            break;
          default:
            this.filterForm.patchValue({ dateFrom: null, dateTo: null });
        }
      });
  }

  /**
   * Initializes the reactive form.
   */
  private initForm(): void {
    this.filterForm = this.fb.group({
      status: [ "" ],
      search: [ "" ],
      dateFrom: [ null ],
      dateTo: [ null ],
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
   * Updates the EventParams based on the form value.
   * @param value The current form value.
   */
  private updateParams(value: any): void {
    const updatedParams = { ...this.params(), ...value };

    updatedParams.dateFrom = value.dateFrom ? new Date(value.dateFrom) : null;
    updatedParams.dateTo = value.dateTo ? new Date(value.dateTo) : null;

    this.params.set(updatedParams);
  }

  /**
   * Loads the paged event list using the current parameters.
   */
  private loadPagedList(): void {
    this.eventsService.loadPagedList(this.key, this.params()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  /**
   * Subscribes to the paged event data stream.
   */
  private subscribeToPagedEventData(): void {
    this.eventsService.data$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((pagedList: Event[]) => {
      this.data = pagedList;
    });
  }
}
