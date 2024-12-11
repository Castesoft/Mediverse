import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from 'src/app/_services/theme.service';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';


@Component({
  host: { class: 'd-flex align-items-center ms-1 ms-lg-2 dropdown', id: 'themeDropdown' },
  selector: '[themeDropdown]',
  // template: ``,
  templateUrl: './theme-dropdown.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, BootstrapModule,],
})
export class ThemeDropdownComponent {
  theme = inject(ThemeService);
}
