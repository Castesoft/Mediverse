import { Component, inject, HostListener, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from 'src/app/_services/account.service';
import { UserDropdownComponent } from 'src/app/_shared/template/components/user-dropdown.component';
import { BsDropdownDirective, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@Component({
  selector: 'app-landing-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, UserDropdownComponent, BsDropdownModule, CollapseModule],
  providers: [BsDropdownDirective],
  template: `
    <nav
      class="navbar navbar-expand-lg fixed-top"
      [ngClass]="{
        'bg-transparent': !hideBackground && !isLightBackground,
        'bg-white shadow-sm': hideBackground || isLightBackground
      }"
      [style.--nav-link-color]="(hideBackground || isLightBackground) ? '#000000' : '#ffffff'"
      [style.--nav-link-hover-color]="'#0aa0f3'"
      [style.--nav-link-active-color]="(hideBackground || isLightBackground) ? '#0aa0f3' : '#ffffff'"
      [style.--nav-link-active-bg]="(hideBackground || isLightBackground) ? 'transparent' : 'rgba(255, 255, 255, 0.1)'"
      style="transition: all 0.3s ease; height: 80px"
    >
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" routerLink="/">
          <img
            [src]="(hideBackground || isLightBackground) ? 'media/logos/logo-compact.svg' : 'media/logos/logo-compact.svg'"
            alt="Logo"
            height="30"
            class="d-inline-block align-text-top"
          />
          <span class="ms-2">DocHub</span>
        </a>
        <button class="navbar-toggler" type="button" (click)="isCollapsed = !isCollapsed">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" [collapse]="isCollapsed">
          <div class="navbar-nav me-auto mb-2 mb-lg-0">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Inicio</a>
            <a routerLink="/services" routerLinkActive="active" class="nav-link">Servicios</a>
            <a routerLink="/pricing" routerLinkActive="active" class="nav-link">Precios</a>
          </div>
          @if (isLoggedIn()) {
            <div class="position-relative">
              <div userDropdown dropdown triggers="hover" placement="bottom right" class="pt-2"></div>
            </div>
          } @else {
            <a routerLink="/auth/sign-in" class="btn btn-light-primary me-3">Iniciar sesión</a>
            <a routerLink="/auth/sign-up" class="btn btn-primary">Registrarse</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .nav-links {
      display: flex;
      gap: 1.5rem;
    }
    .nav-link {
      color: var(--nav-link-color);
      font-weight: 500;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      transition: color 0.3s ease, background-color 0.3s ease;
    }
    .nav-link:hover {
      color: var(--nav-link-hover-color);
    }
    .nav-link.active {
      color: var(--nav-link-active-color);
      background-color: var(--nav-link-active-bg);
    }
    .navbar-brand {
      color: var(--nav-link-color);
    }
    @media (max-width: 991.98px) {
      .navbar-collapse {
        background-color: var(--bs-navbar-color);
        padding: 1rem;
        border-radius: 0.25rem;
        margin-top: 0.5rem;
      }
      .nav-link {
        padding: 0.5rem 0;
      }
    }
  `]
})
export class LandingNavbarComponent {
  @Input() isLightBackground = false;

  accountService = inject(AccountService);
  hideBackground = false;
  isCollapsed = true;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.hideBackground = window.pageYOffset > 50;
  }

  isLoggedIn(): boolean {
    return this.accountService.current() !== null;
  }
}
