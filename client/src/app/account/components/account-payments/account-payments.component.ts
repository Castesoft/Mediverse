import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Data } from '@angular/router';
import { Account } from "src/app/_models/account/account";
import { AccountService } from 'src/app/_services/account.service';
import { TemplateModule } from 'src/app/_shared/template/template.module';
import { Payment } from "src/app/_models/payments/payment";
import { CatalogMode, View } from "src/app/_models/base/types";
import { createId } from "@paralleldrive/cuid2";
import { PaymentParams } from "src/app/_models/payments/paymentParams";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { PaymentsCatalogComponent } from "src/app/payments/payments-catalog.component";
import {
  AccountChildWrapperComponent
} from "src/app/account/components/account-child-wrapper/account-child-wrapper.component";

@Component({
  selector: 'div[accountPayments]',
  templateUrl: './account-payments.component.html',
  styleUrl: './account-payments.component.scss',
  imports: [ TemplateModule, RouterModule, PaymentsCatalogComponent, AccountChildWrapperComponent ],
  standalone: true,
})
export class AccountPaymentsComponent implements OnInit {
  accountService: AccountService = inject(AccountService);
  route: ActivatedRoute = inject(ActivatedRoute);
  account: Account | null = null;

  paymentItem: Payment | null = null;
  paymentView: View = 'page';
  paymentKey: string = createId();
  paymentIsCompact: boolean = true;
  paymentEmbedded: boolean = true;
  paymentMode: CatalogMode = 'view';
  paymentParams: PaymentParams = new PaymentParams(this.paymentKey, {
    fromSection: SiteSection.HOME,
    userId: null
  });

  constructor() {
    effect(() => {
      if (this.accountService.current()) {
        this.account = this.accountService.current();
        this.paymentParams = new PaymentParams(this.paymentKey, {
          fromSection: SiteSection.HOME,
          userId: this.account?.id
        });
      }
    });
  }

  ngOnInit(): void {
    this.accountService.getPaymentHistory().subscribe();
  }
}
