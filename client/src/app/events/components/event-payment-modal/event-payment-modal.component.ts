import { Component, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { IconsService } from 'src/app/_services/icons.service';
import DetailDialog from 'src/app/_models/base/components/types/detailDialog';
import Event from 'src/app/_models/events/event';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from "@angular/common";
import { TooltipDirective } from "ngx-bootstrap/tooltip";
import { PaymentsService } from "src/app/payments/payments.config";
import { PaymentConfirmationMethod } from "src/app/events/components/event-payment-modal/paymentConfirmationMethod";
import { EventPaymentModalResult } from './eventPaymentModalData';

@Component({
  selector: 'app-event-payment-modal',
  templateUrl: './event-payment-modal.component.html',
  styleUrl: './event-payment-modal.component.scss',
  imports: [ FaIconComponent, MatDialogClose, FormsModule, CurrencyPipe, TooltipDirective ],
})
export class EventPaymentModalComponent {
  protected readonly PaymentConfirmationMethod: typeof PaymentConfirmationMethod = PaymentConfirmationMethod;

  private readonly dialogRef: MatDialogRef<EventPaymentModalComponent> = inject(MatDialogRef);
  private readonly paymentsService: PaymentsService = inject(PaymentsService);

  readonly data: DetailDialog<Event> = inject(MAT_DIALOG_DATA);
  readonly iconsService: IconsService = inject(IconsService);

  selectedPaymentMethod?: PaymentConfirmationMethod;
  
  isSubmitting: boolean = false;
  sendBillToClient: boolean = false;
  paymentSucceeded: boolean = false;

  onConfirm() {
    this.isSubmitting = true;
    console.log('Confirming payment with method:', this.selectedPaymentMethod);
    console.log('Send bill to client:', this.sendBillToClient);

    const eventId: number | null = this.data.item?.id || null;
    if (!eventId) {
      console.error('Event ID is not available');
      this.isSubmitting = false;
      return;
    }

    if (!this.selectedPaymentMethod) {
      console.error('No payment method selected');
      this.isSubmitting = false;
      return;
    }

    this.paymentsService.confirmPaymentForEvent(eventId, this.selectedPaymentMethod).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.paymentSucceeded = true;
        console.log(response);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error confirming payment:', error);
      }
    })
  }

  onSelectPaymentMethod(method: PaymentConfirmationMethod) {
    this.selectedPaymentMethod = method;
  }
  
  onClose() {
    const result: EventPaymentModalResult = {
      paymentMethod: this.selectedPaymentMethod as 'cash' | 'transfer' | 'credit_card' | 'debit_card' | 'other',
      sendBill: this.sendBillToClient,
      success: this.paymentSucceeded
    };
    
    this.dialogRef.close(result);
  }
}
