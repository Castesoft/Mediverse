import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';
import { ThemeService } from 'src/app/_services/theme.service';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';


@Component({
  host: { class: 'd-flex align-items-center ms-2 ms-lg-3', id: 'userDropdown' },
  selector: '[userDropdown]',
  templateUrl: './user-dropdown.component.html',
  standalone: true,
  imports: [ BootstrapModule, RouterModule, ProfilePictureComponent ],
})
export class UserDropdownComponent {
  service: AccountService = inject(AccountService);
  theme: ThemeService = inject(ThemeService);
}
