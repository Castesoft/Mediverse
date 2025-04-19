import { Component, inject, OnInit } from "@angular/core";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MatMenuModule } from '@angular/material/menu';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { EventsService } from "src/app/events/events.service";
import DetailDialog from "src/app/_models/base/components/types/detailDialog";
import { FormUse } from "src/app/_models/forms/formTypes";
import Event from "src/app/_models/events/event";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { filter, take } from 'rxjs/operators';
import { SymbolCellComponent } from "src/app/_shared/template/components/tables/cells/symbol-cell.component";
import {
  ConfirmationDialogData,
  ConfirmationModalComponent
} from 'src/app/_shared/components/confirmation-modal/confirmation-modal.component';
import { PhotoSize } from "src/app/_models/photos/photoTypes";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconsService } from "src/app/_services/icons.service";
import { EventDetailComponent } from "src/app/events/events.config";
import {
  EventPaymentModalComponent
} from "src/app/events/components/event-payment-modal/event-payment-modal.component";
import {
  EventPaymentModalData,
  EventPaymentModalResult
} from "src/app/events/components/event-payment-modal/eventPaymentModalData";
import { PaymentStatus } from "src/app/_models/payments/paymentConstants";
import { SendReceiptModalComponent } from "../send-receipt-modal/send-receipt-modal.component";
import { SendReceiptModalData, SendReceiptModalResult } from "../send-receipt-modal/sendReceiptModalData";

@Component({
  selector: 'event-detail-modal',
  templateUrl: './event-detail-modal.component.html',
  imports: [
    ModalWrapperModule,
    MaterialModule,
    CdkModule,
    MatMenuModule,
    CurrencyPipe,
    DatePipe,
    SymbolCellComponent,
    FaIconComponent,
    EventDetailComponent,
  ],
})
export class EventDetailModalComponent implements OnInit {
  protected readonly PaymentStatus: typeof PaymentStatus = PaymentStatus;
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;
  protected readonly FormUse: typeof FormUse = FormUse;

  private readonly dialogRef: MatDialogRef<EventDetailModalComponent> = inject(MatDialogRef);
  private readonly eventsService: EventsService = inject(EventsService);
  private readonly dialog: MatDialog = inject(MatDialog);

  readonly iconsService: IconsService = inject(IconsService)
  readonly data: DetailDialog<Event> = inject(MAT_DIALOG_DATA);

  event: Event | null = null;

  ngOnInit(): void {
    console.log('EventDetailModal received data:', this.data);
    this.event = this.data.item ?? null;
    if (!this.event) {
      console.error("EventDetailModal received null event item!");
      this.dialogRef.close();
    }
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
    if (!this.event || !this.event.id) {
      console.error('Attempted to open payment modal without a valid event object:', this.event);
      return;
    }

    const eventId: number = this.event.id;
    const currentStatus: PaymentStatus | string | null = this.event.paymentStatus || null;

    if (currentStatus !== PaymentStatus.AwaitingPayment && currentStatus !== PaymentStatus.PartiallyPaid) {
      console.warn(`Payment modal not opened. Status is ${currentStatus}, expected ${PaymentStatus.AwaitingPayment} or ${PaymentStatus.PartiallyPaid}.`);
      return;
    }

    const paymentModalData: EventPaymentModalData = {
      title: `Confirmar Pago Cita #${eventId}`,
      item: { ...this.event }
    };

    const dialogRef = this.dialog.open(EventPaymentModalComponent, {
      data: paymentModalData,
    });

    dialogRef.afterClosed().subscribe((result: EventPaymentModalResult | undefined) => {
      console.log('Payment modal closed with result:', result);
      if (result?.success && result.updatedEvent) {
        console.log('Payment successful, updating event in detail modal:', result.updatedEvent);
      } else if (result && !result.success) {
        console.log('Payment modal closed without success.');
      } else {
        console.log('Payment modal closed without returning a result (likely cancelled).');
      }
    });
  }

  sendReceipt(): void {
    if (!this.event || !this.event.id) {
      console.error('Attempted to send receipt without a valid event object:', this.event);
      return;
    }

    const eventId: number = this.event.id;
    const patientEmail = this.event.patient?.email || '';

    const dialogData: SendReceiptModalData = {
      title: `Enviar Comprobante Cita #${eventId}`,
      patientEmail: patientEmail
    };

    const dialogRef = this.dialog.open(SendReceiptModalComponent, {
      data: dialogData,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result: SendReceiptModalResult | undefined) => {
      console.log('Send Receipt modal closed with result:', result);
      if (result?.success && result.email) {
        console.log('Sending receipt to:', result.email);
        this.eventsService.sendEventReceipt(eventId, result.email).subscribe({
          next: () => {
            console.log('Receipt sent successfully');

          },
          error: (err: any) => {
            console.error('Error sending receipt:', err);

          }
        });
      } else {
        console.log('Receipt sending cancelled or no email provided.');
      }
    });
  }

  openCancelConfirmation(): void {
    if (!this.event || !this.event.id) {
      console.error('Cannot cancel event without a valid event object:', this.event);
      return;
    }
    const eventId: number = this.event.id;
    const dialogData: ConfirmationDialogData = {
      title: 'Confirmar Cancelación',
      message: `¿Estás seguro de que deseas cancelar la cita #${eventId}? Esta acción no se puede deshacer.`,
      confirmButtonText: 'Sí, Cancelar',
      confirmButtonColor: 'warn'
    };

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: dialogData,
      width: '400px'
    });

    dialogRef.afterClosed().pipe(
      filter(result => result === true),
      take(1)
    ).subscribe(() => {
      this.eventsService.cancelEvent(eventId)
        .pipe(take(1))
        .subscribe({
          next: (updatedEvent) => {
            console.log('Event cancelled successfully:', updatedEvent);
            this.event = updatedEvent;
          },
          error: (err) => {
            console.error('Error cancelling event:', err);
          }
        });
    });
  }
}
