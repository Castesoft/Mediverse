import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Account } from 'src/app/_models/account/account';
import { AccountService } from 'src/app/_services/account.service';
import { MobileQueryService } from 'src/app/_services/mobile-query.service';
import { TemplateModule } from 'src/app/_shared/template/template.module';
import {
  CardConnectedAccountsComponent
} from 'src/app/account/components/account-settings/card-connected-accounts/card-connected-accounts.component';
import {
  CardDeactivateComponent
} from 'src/app/account/components/account-settings/card-deactivate/card-deactivate.component';
import {
  CardNotificationsComponent
} from 'src/app/account/components/account-settings/card-notifications/card-notifications.component';
import {
  CardProfileDetailsComponent
} from 'src/app/account/components/account-settings/card-profile-details/card-profile-details.component';
import {
  CardSigninMethodComponent
} from 'src/app/account/components/account-settings/card-signin-method/card-signin-method.component';
import { NavMenuComponent } from 'src/app/account/components/account-settings/nav-menu/nav-menu.component';
import {
  AccountChildWrapperComponent
} from "src/app/account/components/account-child-wrapper/account-child-wrapper.component";

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    TemplateModule,
    RouterModule,
    NavMenuComponent,
    CardSigninMethodComponent,
    CardProfileDetailsComponent,
    CardConnectedAccountsComponent,
    CardNotificationsComponent,
    CardDeactivateComponent,
    AccountChildWrapperComponent
  ],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent {
  readonly accountService: AccountService = inject(AccountService);
  readonly query: MobileQueryService = inject(MobileQueryService);

  account: Account | null = null;
  currentSection: string = 'account_settings_signin_method';

  selectSection(section: string) {
    this.currentSection = section;
  }
}
