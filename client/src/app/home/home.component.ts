import { Component, OnInit, inject } from '@angular/core';
import { Account } from 'src/app/_models/account/account';
import { AccountService } from 'src/app/_services/account.service';
import { BreadcrumbService } from 'src/app/_services/breadcrumb.service';
import { SidebarService } from 'src/app/_services/sidebar.service';


@Component({
  selector: 'home-route',
  // template: ``,
  templateUrl: './home.component.html',
  standalone: false,
})
export class HomeComponent implements OnInit {
  accountService = inject(AccountService);
  breadcrumbService = inject(BreadcrumbService);
  sidebar = inject(SidebarService);

  account: Account | null = null;
  label?: string;

  ngOnInit(): void {
    this.account = this.accountService.current();
    this.breadcrumbService.breadcrumb$.subscribe({
      next: breadcrumb => {
        this.label = breadcrumb;
      }
    });
  }
}
