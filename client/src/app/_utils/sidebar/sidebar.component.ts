import { Breakpoints, BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import { Component, inject, model, OnDestroy, signal, WritableSignal } from "@angular/core";
import { MatDrawerMode } from "@angular/material/sidenav";
import { RouterModule } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { SidebarService } from "src/app/_services/sidebar.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { SidebarTreeComponent } from "src/app/_utils/sidebar/sidebar-tree.component";
import { DrawerMode } from "../../_models/base/filter-types";

interface SidebarItem {
  link: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'nav[mainSidebar]',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [ CommonModule, CdkModule, MaterialModule, RouterModule ],
})
export class SidebarComponent implements OnDestroy {
  service: SidebarService = inject(SidebarService);

  ngUnsubscribe: Subject<void> = new Subject<void>();

  currentScreenSize: string = '';
  mode: MatDrawerMode = DrawerMode.SIDE;
  isMobile: boolean = false;

  sidebarItems: SidebarItem[] = [
    { link: '/admin', label: 'Inicio' },
    { link: '/admin/pedidos', label: 'Pedidos' },
  ]

  displayNameMap: Map<string, string> = new Map([
    [ Breakpoints.XSmall, 'XSmall' ],
    [ Breakpoints.Small, 'Small' ],
    [ Breakpoints.Medium, 'Medium' ],
    [ Breakpoints.Large, 'Large' ],
    [ Breakpoints.XLarge, 'XLarge' ],
  ]);

  constructor() {
    inject(BreakpointObserver)
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: BreakpointState): void => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
            if (this.currentScreenSize === 'XSmall' || this.currentScreenSize === 'Small') {
              this.mode = DrawerMode.OVER;
              this.isMobile = true;
            } else {
              this.mode = DrawerMode.SIDE;
              this.isMobile = false;
            }
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

