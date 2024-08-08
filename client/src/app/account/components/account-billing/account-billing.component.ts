import { Component, inject } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Account } from 'src/app/_models/account';
import { BillingDetails } from 'src/app/_models/billingDetails';
import { AccountService } from 'src/app/_services/account.service';
import { LayoutModule } from 'src/app/_shared/layout.module';
import { AddPaymentMethodComponent } from './add-payment-method/add-payment-method.component';

@Component({
  selector: 'app-account-billing',
  standalone: true,
  imports: [LayoutModule, RouterModule],
  templateUrl: './account-billing.component.html',
  styleUrl: './account-billing.component.scss'
})
export class AccountBillingComponent {
  private accountService = inject(AccountService);
  private bsModalService = inject(BsModalService);
  route = inject(ActivatedRoute);
  account: Account | null = null;
  billingDetails: BillingDetails | null = null;

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.account = data['item'];
      }
    })

    this.accountService.billingDetails().subscribe({
      next: billingDetails => {
        this.billingDetails = billingDetails
        console.log(billingDetails)
      }
    });
  }

  openAddPaymentMethodModal() {
    const addPaymentMethodModalRef = this.bsModalService.show(AddPaymentMethodComponent, {
      initialState: {
        title: 'Añadir método de pago',
      },
    });
  }
}
