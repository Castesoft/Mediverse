import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  router = inject(Router);
  route = inject(ActivatedRoute);

  withPadding = signal(true);

  account: Account | null = null;
  label?: string;

  constructor() {
    this.route.data.subscribe({
      next: value => {
        console.log(value['withPadding'], value['data']);
      }
    });
  }

  ngOnInit(): void {
    this.account = this.accountService.current();
    this.breadcrumbService.breadcrumb$.subscribe({
      next: breadcrumb => {
        this.label = breadcrumb;
      }
    });
  }
}
