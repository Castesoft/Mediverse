import { Component, effect, ElementRef, inject, ViewChild } from '@angular/core';
import { MainAsideComponent } from "src/app/_shared/template/components/main-aside.component";
import { MatSidenav, MatSidenavContainer } from "@angular/material/sidenav";
import { MobileQueryService } from "src/app/_services/mobile-query.service";
import { SidebarService } from "src/app/_services/sidebar.service";
import { ContentComponent } from "src/app/_shared/template/components/content.component";
import { HeaderComponent } from "src/app/_shared/template/components/headers/header.component";
import { WrapperComponent } from "src/app/_shared/template/components/wrapper.component";
import { FooterComponent } from "src/app/_shared/template/components/footer.component";
import { NgStyle } from "@angular/common";
import { ScrollService } from "src/app/_services/scroll.service";

@Component({
  selector: 'dashboard-sidenav',
  templateUrl: './dashboard-sidenav.component.html',
  styleUrl: './dashboard-sidenav.component.scss',
  imports: [
    MainAsideComponent,
    MatSidenav,
    MatSidenavContainer,
    ContentComponent,
    HeaderComponent,
    WrapperComponent,
    FooterComponent,
    NgStyle
  ],
})
export class DashboardSidenavComponent {
  readonly mobileQueryService: MobileQueryService = inject(MobileQueryService);
  readonly sidebarService: SidebarService = inject(SidebarService);
  readonly scrollService: ScrollService = inject(ScrollService);

  headerStyles: { [key: string]: string } = {
    left: '0px',
    width: '100%'
  };

  @ViewChild('snav', { read: ElementRef }) drawerElement!: ElementRef;

  constructor() {
    effect(() => {
      this.headerStyles = this.scrollService.getUpdatedHeaderStyles(this.drawerElement);
    });
  }
}
