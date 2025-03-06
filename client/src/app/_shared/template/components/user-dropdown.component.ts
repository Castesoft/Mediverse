import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';
import { ThemeService } from 'src/app/_services/theme.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';


@Component({
  host: { class: 'd-flex align-items-center ms-2 ms-lg-3', id: 'userDropdown' },
  selector: '[userDropdown]',
  templateUrl: './user-dropdown.component.html',
  imports: [ BootstrapModule, RouterModule ],
})
export class UserDropdownComponent {
  readonly service: AccountService = inject(AccountService);
  readonly theme: ThemeService = inject(ThemeService);
  readonly utilsService: UtilsService = inject(UtilsService);
}
