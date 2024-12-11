import { Component, inject } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Account } from "src/app/_models/account/account";
import { BillingDetails, UserAddress } from 'src/app/_models/billingDetails';
import { AccountService } from 'src/app/_services/account.service';
import { TemplateModule } from 'src/app/_shared/template/template.module';
import { AddPaymentMethodComponent } from './add-payment-method/add-payment-method.component';
import { AddressDetailModalComponent } from 'src/app/addresses/addresses.config';

@Component({
  selector: 'app-account-billing',
  standalone: true,
  imports: [TemplateModule, RouterModule],
  templateUrl: './account-billing.component.html',
  styleUrl: './account-billing.component.scss'
})
export class AccountBillingComponent {
  private bsModalService = inject(BsModalService);
  accountService = inject(AccountService);
  route = inject(ActivatedRoute);
  account: Account | null = null;
  billingDetails: BillingDetails | null = null;

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.account = data['item'];
      }
    })

    this.accountService.getBillingDetails();
  }

  openAddPaymentMethodModal() {
    const addPaymentMethodModalRef = this.bsModalService.show(AddPaymentMethodComponent, {
      initialState: {
        title: 'Añadir método de pago',
      },
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
