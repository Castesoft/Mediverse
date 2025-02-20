import { Component, inject, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Account } from "src/app/_models/account/account";
import { AccountService } from "src/app/_services/account.service";


@Component({
  host: { class: 'aside aside-default aside-hoverable', },
  selector: 'div[mainAside]',
  templateUrl: './main-aside.component.html',
  standalone: true,
  imports: [ RouterModule, ],
})
export class MainAsideComponent implements OnInit {
  accountService: AccountService = inject(AccountService);

  account: Account | null = null;
  label?: string;

  ngOnInit(): void {
    this.account = this.accountService.current();
  }
}
