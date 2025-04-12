import { Component, DestroyRef, effect, inject, input, InputSignal, output, OutputEmitterRef, signal, WritableSignal, } from '@angular/core';
import { PaymentMethod } from 'src/app/_models/paymentMethod/paymentMethod';
import {
  PaymentMethodDisplayCardComponent
} from 'src/app/account/components/account-billing/components/payment-method-display-card.component';
import {
  AddPaymentMethodComponent
} from 'src/app/account/components/account-billing/add-payment-method/add-payment-method.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'div[paymentMethodSelector]',
  templateUrl: './payment-method-selector.component.html',
  styleUrls: [ './payment-method-selector.component.scss' ],
  imports: [ PaymentMethodDisplayCardComponent ],
})
export class PaymentMethodSelectorComponent {
  private readonly bsModalService: BsModalService = inject(BsModalService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  confirmOnSelect: InputSignal<boolean> = input(false);
  paymentMethods: InputSignal<PaymentMethod[]> = input.required();
  showPaymentMethodCreateCard: InputSignal<boolean> = input(false);

  selectedPaymentMethod: OutputEmitterRef<PaymentMethod> = output<PaymentMethod>();
  paymentMethodsChanged: OutputEmitterRef<void> = output<void>();
 
  private _selectedPaymentMethod: PaymentMethod | null = null;
  pendingPaymentMethod: PaymentMethod | null = null;

  constructor() {
    effect(() => {
      const methods: PaymentMethod[] = this.paymentMethods();
      const currentSelectionStillExists: boolean = methods.some(
        (pm: PaymentMethod) => pm.id === this._selectedPaymentMethod?.id
      );

      if (!currentSelectionStillExists || !this._selectedPaymentMethod) {
        const defaultMethod: PaymentMethod | undefined = methods.find(
          (pm: PaymentMethod) => pm.isDefault
        );
        this._selectedPaymentMethod = defaultMethod
          ? defaultMethod
          : methods.length > 0
            ? methods[0]
            : null;
      }

      if (this._selectedPaymentMethod) {
        if (!this.confirmOnSelect()) {
          this.selectedPaymentMethod.emit(this._selectedPaymentMethod);
          this.pendingPaymentMethod = null;
        } else {
          if (
            !this.pendingPaymentMethod ||
            this.pendingPaymentMethod.id !== this._selectedPaymentMethod.id
          ) {
            this.pendingPaymentMethod = this._selectedPaymentMethod;
          }
        }
      } else {
        this.pendingPaymentMethod = null;
      }
    });
  }

  onCardClick(method: PaymentMethod) {
    if (this.confirmOnSelect()) {
      this.pendingPaymentMethod = method;
    } else {
      this._selectedPaymentMethod = method;
      this.selectedPaymentMethod.emit(method);
    }
  }

  confirmSelection() {
    if (this.pendingPaymentMethod) {
      this._selectedPaymentMethod = this.pendingPaymentMethod;
      this.selectedPaymentMethod.emit(this.pendingPaymentMethod);
    }
  }

  isSelected(method: PaymentMethod): boolean {
    if (this.confirmOnSelect() && this.pendingPaymentMethod) {
      return this.pendingPaymentMethod.id === method.id;
    }
    return this._selectedPaymentMethod?.id === method.id;
  }

  openPaymentMethodCreateModal() {
    const modalRef: BsModalRef<AddPaymentMethodComponent> | undefined =
      this.bsModalService.show(AddPaymentMethodComponent, {
        initialState: { title: 'Añadir método de pago' },
        class: 'modal-dialog-centered',
      });

    if (modalRef?.onHide) {
      modalRef.onHide.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
          this.paymentMethodsChanged.emit();
        });
    }
  }
}
