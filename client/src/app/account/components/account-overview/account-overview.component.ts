import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Account } from "src/app/_models/account/account";
import { AccountService } from 'src/app/_services/account.service';
import { TemplateModule } from 'src/app/_shared/template/template.module';
import { BreadcrumbsComponent } from "src/app/_shared/components/breadcrumbs.component";
import {
  AccountChildWrapperComponent
} from "src/app/account/components/account-child-wrapper/account-child-wrapper.component";

@Component({
  selector: 'app-account-overview',
  standalone: true,
  imports: [ TemplateModule, RouterModule, BreadcrumbsComponent, AccountChildWrapperComponent ],
  templateUrl: './account-overview.component.html',
  styleUrl: './account-overview.component.scss'
})
export class AccountOverviewComponent implements OnInit {
  accountService: AccountService = inject(AccountService);

  account: Account | null = null;
  label?: string;

  ngOnInit(): void {
    this.account = this.accountService.current();
  }
}
