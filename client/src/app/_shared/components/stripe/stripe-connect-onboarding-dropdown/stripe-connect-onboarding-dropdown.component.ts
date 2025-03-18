import { Component, inject, OnInit } from '@angular/core';
import { BsDropdownMenuDirective, BsDropdownToggleDirective } from "ngx-bootstrap/dropdown";
import { AccountService } from "src/app/_services/account.service";
import { Account } from "src/app/_models/account/account";
import { firstValueFrom } from "rxjs";

@Component({
  host: { class: 'd-flex align-items-center ms-2 ms-lg-3', id: 'stripeConnectOnboardingDropdown' },
  selector: 'div[stripeConnectOnboardingDropdown]',
  templateUrl: './stripe-connect-onboarding-dropdown.component.html',
  styleUrl: './stripe-connect-onboarding-dropdown.component.scss',
  imports: [
    BsDropdownToggleDirective,
    BsDropdownMenuDirective
  ]
})
export class StripeConnectOnboardingDropdownComponent implements OnInit {
  private readonly accountsService: AccountService = inject(AccountService);

  account: Account | null = null;

  ngOnInit(): void {
    this.account = this.accountsService.current();
  }

  async openOnboardingWindow(): Promise<void> {
    if (this.account) {
      const link: any = await firstValueFrom(this.accountsService.getStripeOnboardingLink(this.account.id!));
      window.open(link.onboardingLink, '_blank');
    }
  }
}
