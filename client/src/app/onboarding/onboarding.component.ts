import { Component, effect, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { AccountService } from "src/app/_services/account.service";
import { MobileQueryService } from "src/app/_services/mobile-query.service";
import { ScrollService } from "src/app/_services/scroll.service";
import { SidebarService } from "src/app/_services/sidebar.service";
import { Account } from "src/app/_models/account/account";
import { MatSidenav, MatSidenavContainer } from "@angular/material/sidenav";
import { MainAsideComponent } from "src/app/_shared/template/components/main-aside.component";
import { WrapperComponent } from "src/app/_shared/template/components/wrapper.component";
import { HeaderComponent } from "src/app/_shared/template/components/headers/header.component";
import { NgStyle } from "@angular/common";
import { BreadcrumbLinkComponent } from "src/app/_shared/template/components/breadcrumbs/breadcrumb-link.component";
import { PostComponent } from "src/app/_shared/template/components/post.component";
import { CardComponent } from "src/app/_shared/template/components/cards/card.component";
import { AccountCardComponent } from "src/app/account/components/account-card.component";
import { FooterComponent } from "src/app/_shared/template/components/footer.component";
import { BreadcrumbComponent } from "src/app/_shared/template/components/breadcrumbs/breadcrumb.component";

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  imports: [
    RouterOutlet,
    MatSidenav,
    MatSidenavContainer,
    MainAsideComponent,
    WrapperComponent,
    HeaderComponent,
    NgStyle,
    BreadcrumbLinkComponent,
    PostComponent,
    CardComponent,
    AccountCardComponent,
    FooterComponent,
    BreadcrumbComponent
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
