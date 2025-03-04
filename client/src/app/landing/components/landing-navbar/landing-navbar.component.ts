import { Component, inject, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from 'src/app/_services/account.service';
import { UserDropdownComponent } from 'src/app/_shared/template/components/user-dropdown.component';
import { BsDropdownDirective, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { LogoIconComponent } from "src/app/_shared/components/logo-icon/logo-icon.component";

@Component({
  selector: 'app-landing-navbar',
  templateUrl: './landing-navbar.component.html',
  styleUrls: [ '../landing.component.scss' ],
  imports: [ RouterLink, RouterLinkActive, CommonModule, UserDropdownComponent, BsDropdownModule, CollapseModule, LogoIconComponent ],
  providers: [ BsDropdownDirective ],
})
export class LandingNavbarComponent {
  @Input() isLightBackground: boolean = false;

  accountService: AccountService = inject(AccountService);
  isCollapsed: boolean = true;

  isLoggedIn(): boolean {
    return this.accountService.current() !== null;
  }
}
