import { Component, inject, OnInit } from '@angular/core';
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
  CardSignInMethodComponent
} from 'src/app/account/components/account-settings/card-signin-method/card-sign-in-method.component';
import { NavMenuComponent } from 'src/app/account/components/account-settings/nav-menu/nav-menu.component';
import {
  AccountChildWrapperComponent
} from "src/app/account/components/account-child-wrapper/account-child-wrapper.component";
import { CardDoctorAssociationsComponent } from "./card-doctor-associations/card-doctor-associations.component";

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss',
  imports: [
    TemplateModule,
    RouterModule,
    NavMenuComponent,
    CardSignInMethodComponent,
    CardProfileDetailsComponent,
    CardConnectedAccountsComponent,
    CardNotificationsComponent,
    CardDeactivateComponent,
    AccountChildWrapperComponent,
    CardDoctorAssociationsComponent
  ],
})
export class AccountSettingsComponent implements OnInit {
  readonly accountService: AccountService = inject(AccountService);
  readonly query: MobileQueryService = inject(MobileQueryService);

  currentSection: string = 'account_settings_signin_method';
  account: Account | null = null;

  ngOnInit(): void {
    this.account = this.accountService.current();
  }

  selectSection(section: string) {
    this.currentSection = section;
  }
}
