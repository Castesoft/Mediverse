import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from 'src/app/_services/theme.service';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';

@Component({
  host: { class: 'd-flex align-items-center ms-1 ms-lg-2 dropdown', id: 'themeDropdown'},
  selector: '[themeDropdown]',
  template: `
    <a class="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px" dropdownToggle tabindex="0"
    >
      <i class="ki-duotone ki-night-day theme-light-show fs-1">
        <span class="path1"></span>
        <span class="path2"></span>
        <span class="path3"></span>
        <span class="path4"></span>
        <span class="path5"></span>
        <span class="path6"></span>
        <span class="path7"></span>
        <span class="path8"></span>
        <span class="path9"></span>
        <span class="path10"></span>
      </i>
      <i class="ki-duotone ki-moon theme-dark-show fs-1">
        <span class="path1"></span>
        <span class="path2"></span>
      </i>
    </a>
    <div
      class="dropdown-menu dropdown-menu-right menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-gray-500 menu-active-bg menu-state-color fw-semibold py-4 fs-base w-150px"
      *dropdownMenu>
      <div class="menu-item px-3 my-0">
        <a [ngClass]="{'active': selected === 'light'}" (click)="theme.set('light'); $event.preventDefault()" href
           class="menu-link px-3 py-2">
      <span class="menu-icon">
        <i class="ki-duotone ki-night-day fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
          <span class="path3"></span>
          <span class="path4"></span>
          <span class="path5"></span>
          <span class="path6"></span>
          <span class="path7"></span>
          <span class="path8"></span>
          <span class="path9"></span>
          <span class="path10"></span>
        </i>
      </span>
          <span class="menu-title">Claro</span>
        </a>
      </div>
      <div class="menu-item px-3 my-0">
        <a [ngClass]="{'active': selected === 'dark'}" (click)="theme.set('dark'); $event.preventDefault()" href
           class="menu-link px-3 py-2">
      <span class="menu-icon">
        <i class="ki-duotone ki-moon fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </span>
          <span class="menu-title">Oscuro</span>
        </a>
      </div>
      <div class="menu-item px-3 my-0">
        <a [ngClass]="{'active': selected === 'auto'}" (click)="theme.set('auto'); $event.preventDefault();" href
           class="menu-link px-3 py-2">
      <span class="menu-icon">
        <i class="ki-duotone ki-screen fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
          <span class="path3"></span>
          <span class="path4"></span>
        </i>
      </span>
          <span class="menu-title">Sistema</span>
        </a>
      </div>
    </div>
  `,
  standalone: true,
  imports: [ NgClass, RouterModule, BootstrapModule, ],
})
export class ThemeDropdownComponent implements OnInit {
  theme = inject(ThemeService)

  selected = '';

  ngOnInit(): void {
    this.theme.selected.subscribe({
      next: theme => {
        this.selected = theme;
      }
    })
  }

}
