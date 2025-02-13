import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Data } from '@angular/router';
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

@Component({
  selector: 'app-account-billing',
  templateUrl: './account-billing.component.html',
  styleUrl: './account-billing.component.scss',
  standalone: true,
  imports: [
    TemplateModule,
    RouterModule,
    PaymentMethodDisplayCardComponent,
    BillingAddressDisplayCardComponent
  ],
})
export class AccountBillingComponent implements OnInit {
  private bsModalService: BsModalService = inject(BsModalService);
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
  }

  openAddPaymentMethodModal() {
    this.bsModalService.show(AddPaymentMethodComponent, {
      initialState: { title: 'Añadir método de pago', },
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

  openAddAddressModal() {
    // this.bsModalService.show(AddressDetailModalComponent, {
    //   initialState: {
    //     title: 'Añadir dirección',
    //   },
    // });
  }

  deleteAddress(id: number) {
    if (!id) return;
    if (!confirm('¿Estás seguro de que deseas eliminar esta dirección?')) return;

    this.accountService.deleteAddress(id).subscribe();
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
