import { Component, inject } from '@angular/core';
import {  RouterLink, RouterModule } from '@angular/router';
import { Account } from "src/app/_models/account/account";
import { LayoutModule } from 'src/app/_shared/layout.module';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { AccountService } from 'src/app/_services/account.service';
import { CardOverviewComponent } from './card-overview/card-overview.component';
import { CardSigninMethodComponent } from './card-signin-method/card-signin-method.component';
import { CardProfileDetailsComponent } from "./card-profile-details/card-profile-details.component";
import { CardConnectedAccountsComponent } from "./card-connected-accounts/card-connected-accounts.component";
import { CardNotificationsComponent } from "./card-notifications/card-notifications.component";
import { CardDeactivateComponent } from './card-deactivate/card-deactivate.component';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [LayoutModule, RouterModule, NavMenuComponent, RouterLink, CardOverviewComponent, CardSigninMethodComponent,
    CardProfileDetailsComponent, CardConnectedAccountsComponent, CardNotificationsComponent, CardDeactivateComponent],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent {
  accountService = inject(AccountService);
  account: Account | null = null;
  currentSection: string = 'account_settings_overview';

  ngOnInit(): void {

  }

  selectSection(section: string) {
    this.currentSection = section;
  }
}
