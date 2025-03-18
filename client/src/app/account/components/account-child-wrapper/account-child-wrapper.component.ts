import { Component, inject, input, InputSignal, OnInit } from '@angular/core';
import { AccountCardComponent } from "src/app/account/components/account-card.component";
import { CardComponent } from "src/app/_shared/template/components/cards/card.component";
import { PostComponent } from "src/app/_shared/template/components/post.component";
import { AccountService } from "src/app/_services/account.service";
import { Account } from "src/app/_models/account/account";
import { BreadcrumbsComponent } from "src/app/_shared/components/breadcrumbs.component";

@Component({
  selector: 'account-child-wrapper',
  templateUrl: './account-child-wrapper.component.html',
  styleUrl: './account-child-wrapper.component.scss',
  imports: [
    AccountCardComponent,
    CardComponent,
    PostComponent,
    BreadcrumbsComponent
  ],
})
export class AccountChildWrapperComponent implements OnInit {
  readonly accountService: AccountService = inject(AccountService);

  showAccountCard: InputSignal<boolean> = input(true);

  account: Account | null = null;

  ngOnInit(): void {
    this.account = this.accountService.current();
  }
}
