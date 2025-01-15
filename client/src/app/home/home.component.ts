import { Component, OnInit, inject } from '@angular/core';
import { AccountService } from 'src/app/_services/account.service';
import { Account } from 'src/app/_models/account/account';
import { SidebarService } from 'src/app/_services/sidebar.service';

@Component({
  selector: 'home-route',
  templateUrl: './home.component.html',
  standalone: false,
})
export class HomeComponent implements OnInit {
  account: Account | null = null;

  private accountService = inject(AccountService);
  sidebar = inject(SidebarService);

  ngOnInit(): void {
    this.account = this.accountService.current();
  }
}
