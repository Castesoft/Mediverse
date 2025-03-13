import { Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { createId } from "@paralleldrive/cuid2";
import { EventParams } from "src/app/_models/events/eventParams";
import { AccountService } from "src/app/_services/account.service";
import { Account } from "src/app/_models/account/account";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { TableWrapperComponent } from "src/app/_shared/template/components/tables/table-wrapper.component";
import { TableBodyComponent } from "src/app/_shared/template/components/tables/table-body.component";
import Event from "src/app/_models/events/event";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { EventsService } from "src/app/events/events.config";
import { AsyncPipe } from "@angular/common";
import { TablePagerComponent } from "src/app/_shared/template/components/tables/table-pager.component";
import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from "@angular/cdk/menu";
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

@Component({
  selector: 'app-account-events',
  templateUrl: './account-events.component.html',
  styleUrl: './account-events.component.scss',
  imports: [
    TableWrapperComponent,
    TableBodyComponent,
    AsyncPipe,
    TablePagerComponent,
    CdkContextMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    TableMenuCellComponent,
    TimePeriodCellComponent,
    UserTableCellComponent,
    MatTooltip,
    AddressTableCellComponent,
    Forms2Module,
    ReactiveFormsModule,
    ControlDateComponent,
    CatalogLayoutSkeletonComponent
  ],
})
export class AccountEventsComponent implements OnInit {
  private readonly accountService: AccountService = inject(AccountService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly fb: FormBuilder = inject(FormBuilder);

  readonly eventsService: EventsService = inject(EventsService);

  data: Event[] = [];
  account: Account | null = null;
  filterForm: FormGroup = new FormGroup({});

  key: string = createId();
  isCompact: boolean = false;
  params: EventParams = new EventParams(this.key, { userId: null });

  constructor() {
    effect(() => {
      if (!this.accountService.current()) return;

      this.account = this.accountService.current();
      this.params = new EventParams(this.key, {
        fromSection: SiteSection.HOME,
        userId: this.account?.id
      })

      this.loadPagedList();
    })
  }

  ngOnInit(): void {
    this.initForm();
    this.subscribeToPagedEventData();
  }

  private initForm(): void {
    this.filterForm = this.fb.group({
      status: [ "", [] ],
      search: [ "", [] ],
      dateFrom: [ null, [] ],
      dateTo: [ null, [] ],
    });

    this.filterForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      {
        next: (value) => {
          const paramsToSet = { ...this.params, ...value };

          const dateFrom: Date | null = value.dateFrom ? new Date(value.dateFrom) : null;
          const dateTo: Date | null = value.dateTo ? new Date(value.dateTo) : null;

          paramsToSet.dateFrom = dateFrom;
          paramsToSet.dateTo = dateTo;

          this.params = paramsToSet;
          this.loadPagedList();
        }
      }
    )
  }

  private loadPagedList(): void {
    this.eventsService.loadPagedList(this.key, this.params).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  private subscribeToPagedEventData() {
    this.eventsService.data$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (pagedList) => {
        this.data = pagedList;
      },
    });
  }
}
