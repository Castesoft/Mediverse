import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';
import { Account } from 'src/app/_models/account/account';
import { firstValueFrom } from 'rxjs';
import { StripeOnboardingResponse } from 'src/app/_models/account/stripe-onboarding-response.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  host: {
    class:
      'd-flex flex-column h-100 w-100 justify-content-center align-items-center p-10',
  },
  selector: 'app-onboarding-retry',
  templateUrl: './onboarding-retry.component.html',
  styleUrl: './onboarding-retry.component.scss',
  imports: [ RouterLink ],
})
export class OnboardingRetryComponent implements OnInit {
  private readonly accountService: AccountService = inject(AccountService);
  private readonly toastr: ToastrService = inject(ToastrService);
  private readonly router: Router = inject(Router);

  account: Account | null = null;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.account = this.accountService.current();
    if (!this.account) {
      this.router.navigate([ '/' ]);
    }
  }

  async retryOnboardingProcess(): Promise<void> {
    if (!this.account) return;

    this.isLoading = true;
    try {
      const newWindow: Window | null = window.open('', '_blank');
      const response: StripeOnboardingResponse = await firstValueFrom(
        this.accountService.getStripeOnboardingLink(this.account.id!)
      );

      if (newWindow) {
        newWindow.location.href = response.url;
      } else {
        this.toastr.error(
          'El navegador ha bloqueado la ventana emergente. Por favor, permite las ventanas emergentes para este sitio.'
        );
      }
    } catch (error) {
      console.error('Error opening onboarding window:', error);
      this.toastr.error(
        'Ha ocurrido un error. Por favor intenta de nuevo más tarde.'
      );
    } finally {
      this.isLoading = false;
    }
  }
}
