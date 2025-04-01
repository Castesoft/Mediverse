import { Component, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { EventsService } from "src/app/events/events.service";
import DetailDialog from "src/app/_models/base/components/types/detailDialog";
import { FormUse } from "src/app/_models/forms/formTypes";
import Event from "src/app/_models/events/event";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { SymbolCellComponent } from "src/app/_shared/template/components/tables/cells/symbol-cell.component";
import { PhotoSize } from "src/app/_models/photos/photoTypes";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconsService } from "src/app/_services/icons.service";
import { TooltipDirective } from "ngx-bootstrap/tooltip";
import { EventDetailComponent } from "src/app/events/events.config";
import { PaymentStatus } from "src/app/_models/payments/paymentConstants";
import { ToastrService } from "ngx-toastr";
import { PaymentsService } from "src/app/payments/payments.config";
import {
  EventPaymentModalComponent
} from "src/app/events/components/event-payment-modal/event-payment-modal.component";
import { EventPaymentModalData, EventPaymentModalResult } from "src/app/events/components/event-payment-modal/eventPaymentModalData";

@Component({
  selector: 'event-detail-modal',
  templateUrl: './event-detail-modal.component.html',
  imports: [
    ModalWrapperModule,
    MaterialModule,
    CdkModule,
    CurrencyPipe,
    DatePipe,
    SymbolCellComponent,
    FaIconComponent,
    TooltipDirective,
    EventDetailComponent
  ],
})
export class EventDetailModalComponent implements OnInit {
  protected readonly PaymentStatus: typeof PaymentStatus = PaymentStatus;
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;
  protected readonly FormUse: typeof FormUse = FormUse;

  private readonly dialogRef: MatDialogRef<EventDetailModalComponent> = inject(MatDialogRef);
  private readonly paymentService: PaymentsService = inject(PaymentsService);
  private readonly eventsService: EventsService = inject(EventsService);
  private readonly toastr: ToastrService = inject(ToastrService);
  private readonly dialog: MatDialog = inject(MatDialog);

  readonly iconsService: IconsService = inject(IconsService)
  readonly data: DetailDialog<Event> = inject(MAT_DIALOG_DATA);

  isConfirmingCash: WritableSignal<boolean> = signal(false);

  event: Event | null = null;
  total: number = 0;

  ngOnInit(): void {
    console.log(this.data);
    this.event = this.data.item;
  }

  navigateToDetail(item: Event | null): void {
    const eventId: number | null = item?.id || null;
    if (!eventId) {
      console.error('No se puede navegar a un evento sin ID');
      return;
    }

    this.dialogRef.close();
    this.eventsService.clickLink(item, null, FormUse.DETAIL, 'page');
  }

  openPaymentModal(): void {
    const eventId: number | null = this.event?.id || null;
    const currentStatus: string | null = this.event?.paymentStatus || null;

    if (!eventId || currentStatus !== PaymentStatus.AwaitingPayment) {
      this.toastr.warning('No se puede confirmar el pago para esta cita en este momento.');
      return;
    }

    const data: EventPaymentModalData = {
      title: 'Confirmar Pago',
      item: this.event
    }

    const dialogRef = this.dialog.open(EventPaymentModalComponent, { data });
    
    dialogRef.afterClosed().subscribe((result: EventPaymentModalResult) => {
      if (result?.success) {
        this.dialogRef.close();
      }
    });
  }

  /**
   * Initiates the cash confirmation process. Opens a confirmation dialog first.
   */
  confirmCashReceived(): void {
    const eventId: number | null = this.event?.id || null;
    const currentStatus: string | null = this.event?.paymentStatus || null;

    if (!eventId || currentStatus !== PaymentStatus.AwaitingPayment) {
      this.toastr.warning('No se puede confirmar el pago para esta cita en este momento.');
      return;
    }

    const data: EventPaymentModalData = {
      title: 'Confirmar Pago',
      item: this.event
    }

    this.dialog.open(EventPaymentModalComponent, { data });
  }
}
