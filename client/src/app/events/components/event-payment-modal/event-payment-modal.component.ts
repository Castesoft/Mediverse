import { Component, effect, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { IconsService } from 'src/app/_services/icons.service';
import DetailDialog from 'src/app/_models/base/components/types/detailDialog';
import Event from 'src/app/_models/events/event';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from "@angular/common";
import { TooltipDirective } from "ngx-bootstrap/tooltip";
import { PaymentsService } from "src/app/payments/payments.config";
import { EventPaymentModalResult } from './eventPaymentModalData';
import { AccountService } from "src/app/_services/account.service";
import { Account } from "src/app/_models/account/account";
import { PaymentMethodType } from "src/app/_models/paymentMethodTypes/paymentMethodType";
import { PaymentConfirmationPayload } from "src/app/payments/models/payment-confirmation-payload.model";
import { AlertComponent } from "ngx-bootstrap/alert";

type EmailStatus = 'idle' | 'sending' | 'sent' | 'error';

@Component({
  selector: 'app-event-payment-modal',
  templateUrl: './event-payment-modal.component.html',
  styleUrl: './event-payment-modal.component.scss',
  imports: [
    FaIconComponent,
    MatDialogClose,
    FormsModule,
    CurrencyPipe,
    TooltipDirective,
    AlertComponent
  ],
})
export class EventPaymentModalComponent {
  private readonly dialogRef: MatDialogRef<EventPaymentModalComponent> = inject(MatDialogRef);
  private readonly paymentsService: PaymentsService = inject(PaymentsService);
  private readonly accountService: AccountService = inject(AccountService);

  readonly data: DetailDialog<Event> = inject(MAT_DIALOG_DATA);
  readonly iconsService: IconsService = inject(IconsService);

  paymentMethodTypes: PaymentMethodType[] = [];
  selectedPaymentMethodId?: number;

  account: Account | null = null;

  sendBillToClient: boolean = false;
  paymentSucceeded: boolean = false;
  isSubmitting: boolean = false;

  referenceNumber: string = '';
  notes: string = '';

  emailStatus: EmailStatus = 'idle';
  emailError: string | null = null;
  patientEmail: string = '';

  constructor() {
    effect(() => {
      this.account = this.accountService.current();
      if (this.account) {
        this.getUserPaymentMethodTypes(this.account.id!);
      }

      if (this.data.item?.patient?.email && !this.paymentSucceeded) {
        this.patientEmail = this.data.item.patient.email;
      }
    });
  }

  private getUserPaymentMethodTypes(userId: number) {
    this.accountService.getPaymentMethodTypesForUserById(userId).subscribe({
      next: (response) => {
        console.log('User payment method types:', response);
        this.paymentMethodTypes = response;
      },
      error: (error) => {
        console.error('Error fetching user payment method types:', error);
      }
    });
  }

  onConfirm() {
    this.isSubmitting = true;
    console.log('Confirming payment with method:', this.selectedPaymentMethodId);
    console.log('Send bill to client:', this.sendBillToClient);

    const eventId: number | null = this.data.item?.id || null;
    if (!eventId) {
      console.error('Event ID is not available');
      this.isSubmitting = false;
      return;
    }

    if (!this.selectedPaymentMethodId) {
      console.error('No payment method selected');
      this.isSubmitting = false;
      return;
    }

    const payload: PaymentConfirmationPayload = {
      selectedPaymentMethodTypeId: this.selectedPaymentMethodId,
      referenceNumber: this.referenceNumber,
      notes: this.notes,
    }

    this.paymentsService.confirmPaymentForEvent(eventId, payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.paymentSucceeded = true;
        this.data.item = response;
        console.log(response);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error confirming payment:', error);
      }
    })
  }

  onSelectPaymentMethod(methodId: number) {
    this.selectedPaymentMethodId = methodId;
  }

  onClose() {
    const result: EventPaymentModalResult = {
      paymentMethodTypeId: this.selectedPaymentMethodId || 0,
      updatedEvent: this.data.item || null,
      sendBill: this.sendBillToClient,
      success: this.paymentSucceeded,
      notes: this.notes
    };

    this.dialogRef.close(result);
  }


  sendEmailReceipt() {
    if (!this.patientEmail || !this.patientEmail.trim() || this.emailStatus === 'sending') {
      return;
    }

    this.emailStatus = 'sending';
    this.emailError = null;

    console.log('Attempting to send email receipt to:', this.patientEmail);
    this.paymentsService.sendEventReceiptEmail(this.data.item!.id!, this.patientEmail).subscribe({
      next: () => {
        console.log('Email receipt sent successfully to:', this.patientEmail);
        this.emailStatus = 'sent';
      },
      error: (error) => {
        console.error('Error sending email receipt:', error);
        this.emailStatus = 'error';
        this.emailError = error.message || 'An unknown error occurred while sending the email.';
      }
    });
  }
}
