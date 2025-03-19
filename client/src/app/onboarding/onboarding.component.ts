import { Component, effect, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { AccountService } from "src/app/_services/account.service";
import { MobileQueryService } from "src/app/_services/mobile-query.service";
import { ScrollService } from "src/app/_services/scroll.service";
import { SidebarService } from "src/app/_services/sidebar.service";
import { Account } from "src/app/_models/account/account";
import {
  DashboardSidenavComponent
} from "src/app/_shared/components/dashboard/dashboard-sidenav/dashboard-sidenav.component";

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  imports: [
    RouterOutlet,
    DashboardSidenavComponent
  ],
})
export class OnboardingComponent {
  readonly accountService: AccountService = inject(AccountService);
  readonly query: MobileQueryService = inject(MobileQueryService);
  readonly scrollService: ScrollService = inject(ScrollService);
  readonly sidebar: SidebarService = inject(SidebarService);

  headerStyles: { [key: string]: string } = {
    left: '0px',
    width: '100%'
  };

  @ViewChild('snav', { read: ElementRef }) drawerElement!: ElementRef;

  label?: string;
  account: Account | null = null;

  constructor() {
    effect(() => {
      this.headerStyles = this.scrollService.getUpdatedHeaderStyles(this.drawerElement);
    });
  }
}
