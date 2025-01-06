import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';


@Component({
  host: { class: 'd-flex align-items-center ms-1 ms-lg-2', id: 'quickLinksDropdown' },
  selector: '[quickLinksDropdown]',
  templateUrl: './quick-links-dropdown.component.html',
  standalone: true,
  imports: [RouterModule, BootstrapModule,],
})
export class QuickLinksDropdownComponent {
}
