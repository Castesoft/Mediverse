import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BillingDetails, UserAddress } from 'src/app/_models/billingDetails';
import { AccountService } from 'src/app/_services/account.service';
import { TemplateModule } from 'src/app/_shared/template/template.module';
import { AddPaymentMethodComponent } from './add-payment-method/add-payment-method.component';
import {
  PaymentMethodDisplayCardComponent
} from "src/app/account/components/account-billing/components/payment-method-display-card.component";
import {
  BillingAddressDisplayCardComponent
} from "src/app/account/components/account-billing/components/billing-address-display-card.component";
import {
  AddressCreateCardComponent
} from "src/app/addresses/components/address-create-card/address-create-card.component";
import {
  AccountChildWrapperComponent
} from "src/app/account/components/account-child-wrapper/account-child-wrapper.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  PaymentMethodPreferencesComponent
} from "src/app/payments/components/payment-method-preferences/payment-method-preferences.component";

@Component({
  selector: 'app-account-billing',
  templateUrl: './account-billing.component.html',
  styleUrl: './account-billing.component.scss',
  standalone: true,
  imports: [
    TemplateModule,
    RouterModule,
    PaymentMethodDisplayCardComponent,
    BillingAddressDisplayCardComponent,
    AddressCreateCardComponent,
    AccountChildWrapperComponent,
    PaymentMethodPreferencesComponent
  ],
})
export class AccountBillingComponent implements OnInit {
  private readonly bsModalService: BsModalService = inject(BsModalService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  readonly accountService: AccountService = inject(AccountService);

  billingDetails: BillingDetails | null = null;

  ngOnInit(): void {
    this.accountService.getBillingDetails();
    this.subscribeToBillingDetails();
  }

  private subscribeToBillingDetails() {
    this.accountService.billingDetails$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (billingDetails: BillingDetails | null) => {
        this.billingDetails = billingDetails;
      }
    });
  }

  openAddPaymentMethodModal() {
    this.bsModalService.show(AddPaymentMethodComponent, {
      initialState: { title: 'Añadir método de pago', },
      class: 'modal-dialog-centered'
    });
  }

  deletePaymentMethod(id: string) {
    if (!id) return;
    if (!confirm('¿Estás seguro de que deseas eliminar este método de pago?')) return;
    this.accountService.deletePaymentMethod(id).subscribe();
  }

  setMainPaymentMethod(id: string) {
    if (!id) return;
    if (!confirm('¿Estás seguro de que deseas establecer este método de pago como principal?')) return;
    this.accountService.setMainPaymentMethod(id).subscribe();
  }


  deleteAddress(id: number) {
    if (!id) return;
    if (!confirm('¿Estás seguro de que deseas eliminar esta dirección?')) return;
    this.accountService.deleteAddress(id).subscribe();
  }

  handleBillingDetailsModification() {
    this.accountService.getBillingDetails();
  }

  openEditAddressModal(address: UserAddress) {
    // this.bsModalService.show(AddressDetailModalComponent, {
    //   initialState: {
    //     title: 'Editar dirección',
    //     address,
    //     type: 'edit',
    //   },
    // });
  }
}
