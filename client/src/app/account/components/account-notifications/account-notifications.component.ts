import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AsyncPipe, DecimalPipe, NgStyle } from "@angular/common";
import { TableBodyComponent } from "src/app/_shared/template/components/tables/table-body.component";
import { TableCheckCellComponent } from "src/app/_shared/template/components/tables/table-check-cell.component";
import { TableMenuCellComponent } from "src/app/_shared/template/components/tables/table-menu-cell.component";
import { NotificationsService } from "src/app/notifications/notifications.config";
import { RouterLink } from "@angular/router";
import { createId } from "@paralleldrive/cuid2";
import { NotificationParams } from "src/app/_models/notifications/notificationParams";
import { CatalogMode } from "src/app/_models/base/types";
import { DevService } from "src/app/_services/dev.service";
import { Notification } from "src/app/_models/notifications/notification";
import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from "@angular/cdk/menu";
import { TableWrapperComponent } from "src/app/_shared/template/components/tables/table-wrapper.component";
import { RelativeTimePipe } from "src/app/_pipes/relative-time.pipe";
import { TooltipDirective } from "ngx-bootstrap/tooltip";
import {
  NotificationIconComponent
} from "src/app/notifications/components/notification-icon/notification-icon.component";
import { TablePagerComponent } from "src/app/_shared/template/components/tables/table-pager.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {
  AccountChildWrapperComponent
} from "src/app/account/components/account-child-wrapper/account-child-wrapper.component";

@Component({
  selector: 'app-account-notifications',
  templateUrl: './account-notifications.component.html',
  styleUrl: './account-notifications.component.scss',
  imports: [
    DecimalPipe,
    TableBodyComponent,
    TableCheckCellComponent,
    TableMenuCellComponent,
    NgStyle,
    RouterLink,
    CdkContextMenuTrigger,
    TableWrapperComponent,
    CdkMenu,
    CdkMenuItem,
    RelativeTimePipe,
    TooltipDirective,
    NotificationIconComponent,
    AsyncPipe,
    TablePagerComponent,
    ReactiveFormsModule,
    AccountChildWrapperComponent
  ],
})
export class AccountNotificationsComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly fb: FormBuilder = inject(FormBuilder);

  readonly notificationsService: NotificationsService = inject(NotificationsService);
  readonly devService: DevService = inject(DevService);

  data: Notification[] = [];
  filterForm: FormGroup = new FormGroup({});

  key: string;
  isCompact: boolean = true;
  params: NotificationParams;
  mode: CatalogMode = "readonly";

  constructor() {
    this.key = createId();
    this.params = new NotificationParams(this.key);
  }

  ngOnInit(): void {
    this.initForm();
    this.subscribeToPagedNotificationData();
    this.subscribeToNotificationServerUpdates();
    this.loadPagedList();
  }

  private initForm(): void {
    this.filterForm = this.fb.group({
      status: [ "", [] ],
      search: [ "", [] ],
    });

    this.filterForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      {
        next: (value) => {
          this.params = { ...this.params, ...value };
          this.loadPagedList();
        }
      }
    )
  }

  private subscribeToNotificationServerUpdates() {
    this.notificationsService.serverUpdate$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (_) => {
        this.loadPagedList();
      },
    });
  }

  private loadPagedList(): void {
    this.notificationsService.loadPagedList(this.key, this.params).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  private subscribeToPagedNotificationData() {
    this.notificationsService.data$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (pagedList) => {
        this.data = pagedList;
      },
    });
  }

  toggleRead(notificationId: number): void {
    this.notificationsService.toggleRead(notificationId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (_) => {
        this.loadPagedList();
      },
    });
  }

  toggleFavorite(notificationId: number): void {
    this.notificationsService.toggleFavorite(notificationId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (_) => {
        this.loadPagedList();
      },
    });
  }

  toggleImportant(notificationId: number): void {
    this.notificationsService.toggleImportant(notificationId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (_) => {
        this.loadPagedList();
      },
    });
  }
}
