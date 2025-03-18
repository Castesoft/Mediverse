import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, RouterModule } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Account } from "src/app/_models/account/account";
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
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import {
  AccountChildWrapperComponent
} from "src/app/account/components/account-child-wrapper/account-child-wrapper.component";

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
    AccountChildWrapperComponent
  ],
})
export class AccountBillingComponent implements OnInit, OnDestroy {
  private bsModalService: BsModalService = inject(BsModalService);
  destroy$: Subject<void> = new Subject<void>();
  accountService: AccountService = inject(AccountService);
  route: ActivatedRoute = inject(ActivatedRoute);
  account: Account | null = null;
  billingDetails: BillingDetails | null = null;

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data: Data) => {
        this.account = data['item'];
      }
    })

    this.accountService.getBillingDetails();
    this.subscribeToBillingDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToBillingDetails() {
    this.accountService.billingDetails$.pipe(takeUntil(this.destroy$)).subscribe({
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
