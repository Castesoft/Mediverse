import { Component, OnInit, inject } from '@angular/core';
import { AccountService } from 'src/app/_services/account.service';
import { Account } from 'src/app/_models/account/account';
import { SidebarService } from 'src/app/_services/sidebar.service';
import { MobileQueryService } from 'src/app/_services/mobile-query.service';

@Component({
  selector: 'home-route',
  templateUrl: './home.component.html',
  standalone: false,
})
export class HomeComponent implements OnInit {
  account: Account | null = null;

  private readonly accountService = inject(AccountService);
  readonly sidebar = inject(SidebarService);
  readonly query = inject(MobileQueryService);

  ngOnInit(): void {
    this.account = this.accountService.current();
  }
}
