import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Account } from 'src/app/_models/account';
import { AccountService } from 'src/app/_services/account.service';
import { LayoutModule } from 'src/app/_shared/layout.module';

@Component({
  selector: 'app-account-overview',
  standalone: true,
  imports: [LayoutModule, RouterModule],
  templateUrl: './account-overview.component.html',
  styleUrl: './account-overview.component.scss'
})
export class AccountOverviewComponent {
  accountService = inject(AccountService);

  account: Account | null = null;
  label?: string;

  ngOnInit(): void {
    this.account = this.accountService.current();
  }
}
