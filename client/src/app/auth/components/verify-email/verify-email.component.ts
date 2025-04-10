import { Component, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TemplateModule } from 'src/app/_shared/template/template.module';
import {
  EmailVerificationInputComponent
} from 'src/app/_shared/components/email-verification-input/email-verification-input.component';
import { AuthNavigationService } from "src/app/_services/auth-navigation.service";
import { AccountService } from "src/app/_services/account.service";
import { Account } from "src/app/_models/account/account";
import { BottomLinksComponent } from "src/app/auth/components/bottom-links.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-verify-email',
  host: { class: 'd-flex flex-column flex-root h-100' },
  templateUrl: './verify-email.component.html',
  styleUrls: [ './verify-email.component.scss' ],
  imports: [
    TemplateModule,
    RouterModule,
    EmailVerificationInputComponent,
    BottomLinksComponent
  ],
})
export class VerifyEmailComponent {
  private readonly authNavigationService: AuthNavigationService = inject(AuthNavigationService);
  private readonly accountService: AccountService = inject(AccountService);
  private readonly toastr: ToastrService = inject(ToastrService);

  account: Account | null = null;

  constructor() {
    effect(() => {
      this.account = this.accountService.current();
    });
  }

  onVerified(): void {
    this.authNavigationService.navigateToAccount().catch(console.error);
  }

  skipVerification(): void {
    this.toastr.success('Puedes verificar tu correo más tarde desde la configuración de tu cuenta.');
    this.authNavigationService.navigateToAccount().catch(console.error);
  }
}
