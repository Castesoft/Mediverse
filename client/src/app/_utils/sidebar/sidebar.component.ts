import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { SidebarService } from 'src/app/_services/sidebar.service';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { DrawerMode } from '../../_models/base/filter-types';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

interface SidebarItem {
  link: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'nav[mainSidebar]',
  templateUrl: './sidebar.component.html',
  imports: [
    CommonModule,
    CdkModule,
    MaterialModule,
    RouterModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  private readonly breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  readonly sidebarService: SidebarService = inject(SidebarService);

  mode: MatDrawerMode = DrawerMode.SIDE;
  currentScreenSize: string = '';
  isMobile: boolean = false;

  sidebarItems: SidebarItem[] = [
    { link: '/admin', label: 'Inicio' },
    { link: '/admin/pedidos', label: 'Pedidos' },
    { link: '/admin/productos', label: 'Productos' },
    { link: '/admin/doctores', label: 'Doctores' },
    { link: '/admin/almacenes', label: 'Almacenes' },
    { link: '/admin/usuarios', label: 'Usuarios' },
    { link: '/admin/suscripciones', label: 'Suscripciones' },
    { link: '/admin/permisos', label: 'Permisos' },
  ];

  private readonly displayNameMap: { [key: string]: string } = {
    [Breakpoints.XSmall]: 'XSmall',
    [Breakpoints.Small]: 'Small',
    [Breakpoints.Medium]: 'Medium',
    [Breakpoints.Large]: 'Large',
    [Breakpoints.XLarge]: 'XLarge',
  };

  ngOnInit(): void {
    const breakpoints: string[] = [
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ];

    this.breakpointObserver
      .observe(breakpoints)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: BreakpointState) => {
        if (result.breakpoints[Breakpoints.XSmall] || result.breakpoints[Breakpoints.Small]) {
          this.currentScreenSize = this.displayNameMap[Breakpoints.XSmall];
          this.mode = DrawerMode.OVER;
          this.isMobile = true;
        } else {
          this.currentScreenSize = this.displayNameMap[Breakpoints.Medium];
          this.mode = DrawerMode.SIDE;
          this.isMobile = false;
        }
      });
  }
}
