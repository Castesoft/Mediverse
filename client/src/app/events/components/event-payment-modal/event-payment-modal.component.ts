import { Component, effect, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MAT_DIALOG_DATA, MatDialog, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
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
import { PaymentMethodPreferenceDto } from "src/app/payments/models/payment-method-preference.model";
import {
  PaymentMethodPreferencesComponent
} from 'src/app/payments/components/payment-method-preferences/payment-method-preferences.component';
import { PaymentStatus } from "src/app/_models/payments/paymentConstants";

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
  private readonly dialog: MatDialog = inject(MatDialog);

  protected readonly data: DetailDialog<Event> = inject(MAT_DIALOG_DATA);
  protected readonly iconsService: IconsService = inject(IconsService);
  protected readonly PaymentStatus = PaymentStatus;
  paymentMethodTypes: PaymentMethodType[] = [];
  paymentMethodPreferences: PaymentMethodPreferenceDto[] = [];
  selectedPaymentMethodId?: number;

  account: Account | null = null;

  sendBillToClient = false;
  paymentSucceeded = false;
  isSubmitting = false;

  isPartialPayment = false;
  partialPaymentAmount: number | null = null;
  fullAmount = 0;
  amountDue = 0;


  referenceNumber = '';
  notes = '';

  emailStatus: EmailStatus = 'idle';
  emailError: string | null = null;
  patientEmail = '';

  constructor() {
    effect(() => {
      this.account = this.accountService.current();
      if (this.account) {
        this.getUserPaymentMethodTypes(this.account.id!);
        this.getUserPaymentMethodPreferences(this.account.id!);
      }

      // Initialize amounts based on the event data
      if (this.data.item) {
        this.fullAmount = this.data.item.service?.price || 0;
        this.amountDue = this.data.item.amountDue ?? this.fullAmount;

        if (this.data.item.patient?.email && !this.paymentSucceeded) {
          this.patientEmail = this.data.item.patient.email;
        }

        if (this.data.item.paymentStatus === PaymentStatus.PartiallyPaid) {
        }
      }
    });
  }

  private getUserPaymentMethodTypes(userId: number): void {
    this.accountService.getPaymentMethodTypesForUserById(userId).subscribe({
      next: (response) => {
        console.log('User payment method types:', response);
        this.paymentMethodTypes = response;
        this.sortPaymentMethodsByPreference();
      },
      error: (error) => {
        console.error('Error fetching user payment method types:', error);
      }
    });
  }

  private getUserPaymentMethodPreferences(userId: number): void {
    this.paymentsService.getPaymentMethodPreferences(userId).subscribe({
      next: (response) => {
        console.log('User payment method preferences:', response);
        this.paymentMethodPreferences = response;
        this.sortPaymentMethodsByPreference();


        const defaultPreference = this.paymentMethodPreferences.find(p => p.isDefault);
        if (defaultPreference && !this.selectedPaymentMethodId) {
          this.selectedPaymentMethodId = defaultPreference.paymentMethodTypeId;
        }
      },
      error: (error) => {
        console.error('Error fetching user payment method preferences:', error);
      }
    });
  }

  private sortPaymentMethodsByPreference(): void {
    if (this.paymentMethodPreferences.length === 0 || this.paymentMethodTypes.length === 0) {
      return;
    }

    const prefMap = new Map<number, PaymentMethodPreferenceDto>();
    this.paymentMethodPreferences.forEach(pref => {
      prefMap.set(pref.paymentMethodTypeId, pref);
    });

    this.paymentMethodTypes = this.paymentMethodTypes.filter(method => {
      if (!method.id) return true;
      const pref = prefMap.get(method.id);

      return !pref || pref.isActive;
    });

    this.paymentMethodTypes.sort((a, b) => {
      if (!a.id || !b.id) return 0;

      const prefA = prefMap.get(a.id);
      const prefB = prefMap.get(b.id);

      if (prefA && prefB) {
        return prefA.displayOrder - prefB.displayOrder;
      }

      if (prefA) return -1;
      if (prefB) return 1;


      return 0;
    });
  }

  /**
   * Confirms the payment for the event, handling partial payments.
   */
  public onConfirm(): void {
    if (!this.selectedPaymentMethodId || this.isSubmitting) {
      return;
    }

    if (this.isPartialPayment) {
      this.validatePartialPaymentAmount();
      if (!this.partialPaymentAmount || this.partialPaymentAmount <= 0 || this.partialPaymentAmount >= this.amountDue) {
        console.error('Invalid partial payment amount.');
        alert(`Monto parcial inválido. Debe ser mayor a 0 y menor a ${this.amountDue.toFixed(2)}.`);
        return;
      }
    }


    this.isSubmitting = true;
    console.log('Confirming payment with method:', this.selectedPaymentMethodId);
    const eventId = this.data.item?.id ?? null;
    if (!eventId) {
      console.error('Event ID is not available');
      this.isSubmitting = false;
      return;
    }

    const payload: PaymentConfirmationPayload = {
      selectedPaymentMethodTypeId: this.selectedPaymentMethodId,
      referenceNumber: this.referenceNumber,
      notes: this.notes,
    };

    if (this.isPartialPayment && this.partialPaymentAmount && this.partialPaymentAmount > 0 && this.partialPaymentAmount < this.amountDue) {
      payload.partialPaymentAmount = this.partialPaymentAmount;
    }

    this.paymentsService.confirmPaymentForEvent(eventId, payload).subscribe({
      next: (updatedEvent) => {
        this.isSubmitting = false;
        this.paymentSucceeded = true;
        this.data.item = updatedEvent;
        this.partialPaymentAmount = payload.partialPaymentAmount ?? null;
        this.amountDue = updatedEvent.amountDue ?? 0;
        console.log('Payment confirmed:', updatedEvent);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error confirming payment:', error);
        alert(`Error al confirmar el pago: ${error.message || 'Error desconocido'}`);
      }
    });
  }

  /**
   * Sets the selected payment method ID.
   */
  public onSelectPaymentMethod(methodId: number): void {
    this.selectedPaymentMethodId = methodId;
  }

  /**
   * Handles changes to the partial payment checkbox/switch.
   */
  public onPartialPaymentChange(): void {
    if (!this.isPartialPayment) {
      this.partialPaymentAmount = null;
    } else if (this.isPartialPayment && !this.partialPaymentAmount) {
      this.partialPaymentAmount = 100;
    }
  }

  /**
   * Validates the entered partial payment amount.
   */
  public validatePartialPaymentAmount(): void {
    if (!this.isPartialPayment || !this.partialPaymentAmount) {
      if (isNaN(this.partialPaymentAmount ?? NaN)) {
        this.partialPaymentAmount = null;
      }
      return;
    }

    const amount = Number(this.partialPaymentAmount);

    if (isNaN(amount) || amount <= 0) {
      this.partialPaymentAmount = null;
      alert("El monto a pagar debe ser mayor a 0.");
    } else if (amount >= this.amountDue) {
      this.partialPaymentAmount = this.amountDue;
      alert(`El monto parcial no puede ser igual o mayor al saldo pendiente (${this.amountDue.toFixed(2)}). Se ajustará al saldo pendiente.`);
      this.isPartialPayment = false;
      this.partialPaymentAmount = null;
    } else {
      this.partialPaymentAmount = Math.round(amount * 100) / 100;
    }
  }

  /**
   * Calculates the amount to display as 'Total a Confirmar'.
   */
  get amountToConfirm(): number {
    if (this.isPartialPayment && this.partialPaymentAmount && this.partialPaymentAmount > 0 && this.partialPaymentAmount < this.amountDue) {
      return this.partialPaymentAmount;
    }
    return this.amountDue;
  }

  /**
   * Calculates the remaining balance *after* the currently entered amount is paid.
   * Used for display purposes in the input field helper text.
   */
  get remainingBalanceAfterPayment(): number {
    const amountEntered = this.isPartialPayment ? (this.partialPaymentAmount || 0) : this.amountDue;
    const remaining = this.amountDue - amountEntered;
    return remaining > 0 ? remaining : 0;
  }


  /**
   * Closes the modal and returns the result.
   */
  public onClose(): void {
    const result: EventPaymentModalResult = {
      paymentMethodTypeId: this.selectedPaymentMethodId ?? 0,
      updatedEvent: this.data.item ?? null,
      sendBill: this.sendBillToClient,
      success: this.paymentSucceeded,
      notes: this.notes,
      isPartial: this.isPartialPayment && !!this.partialPaymentAmount,
      amountPaid: this.amountToConfirm
    };

    this.dialogRef.close(result);
  }

  /**
   * Sends an email receipt to the patient.
   */
  public sendEmailReceipt(): void {
    if (!this.patientEmail?.trim() || this.emailStatus === 'sending' || !this.data.item?.id) {
      return;
    }

    this.emailStatus = 'sending';
    this.emailError = null;

    console.log('Attempting to send email receipt to:', this.patientEmail);
    this.paymentsService.sendEventReceiptEmail(this.data.item.id, this.patientEmail).subscribe({
      next: () => {
        console.log('Email receipt sent successfully to:', this.patientEmail);
        this.emailStatus = 'sent';
        if (this.data.item) this.data.item.isReceiptSent = true;
      },
      error: (error) => {
        console.error('Error sending email receipt:', error);
        this.emailStatus = 'error';
        this.emailError = error?.error?.message || error?.message || 'Ocurrió un error desconocido al enviar el correo.';
      }
    });
  }

  /**
   * Opens the Payment Method Preferences modal.
   */
  public openPaymentMethodPreferences(): void {
    const dialogRef = this.dialog.open(PaymentMethodPreferencesComponent, {
      width: '800px',
      panelClass: 'payment-preferences-dialog',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.account?.id) {
        this.getUserPaymentMethodTypes(this.account.id);
        this.getUserPaymentMethodPreferences(this.account.id);
      }
    });
  }
}
