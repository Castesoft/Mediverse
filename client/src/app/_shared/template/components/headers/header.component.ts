import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsDropdownModule, BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { SidebarService } from 'src/app/_services/sidebar.service';
import { HeaderSearchComponent } from 'src/app/_shared/template/components/headers/header-search.component';
import { ThemeDropdownComponent } from 'src/app/_shared/template/components/theme-dropdown.component';
import { UserDropdownComponent } from 'src/app/_shared/template/components/user-dropdown.component';


@Component({
  host: { class: 'header' },
  selector: '[header]',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterModule, ThemeDropdownComponent, UserDropdownComponent, BsDropdownModule, HeaderSearchComponent, CommonModule],
  providers: [BsDropdownDirective,],
})
export class HeaderComponent {
  sidebar = inject(SidebarService);
}
