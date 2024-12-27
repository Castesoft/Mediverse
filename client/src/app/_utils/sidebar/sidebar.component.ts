import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import { Component, inject, model, signal } from "@angular/core";
import { MatDrawerMode } from "@angular/material/sidenav";
import { RouterModule } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { SidebarService } from "src/app/_services/sidebar.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { SidebarTreeComponent } from "src/app/_utils/sidebar/sidebar-tree.component";

@Component({
  host: { class: '', },
  selector: 'nav[mainSidebar]',
  styles: `
  // :host {
  //   display: flex;
  //   flex-grow: 1;
  // }
  `,
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [ CommonModule, CdkModule, MaterialModule, RouterModule, SidebarTreeComponent, ],
})
export class SidebarComponent {
  service = inject(SidebarService);

  destroyed = new Subject<void>();

  currentScreenSize = signal<string>('');
  mode = signal<MatDrawerMode>('side');
  isMobile = signal(false);

  // Create a map to display breakpoint names for demonstration purposes.
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
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
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize.set(this.displayNameMap.get(query) ?? 'Unknown');
            if (
              this.currentScreenSize() === 'XSmall' ||
              this.currentScreenSize() === 'Small'
            ) {
              this.mode.set('over');
              this.isMobile.set(true);
            } else {
              this.mode.set('side');
              this.isMobile.set(false);
            }
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}

