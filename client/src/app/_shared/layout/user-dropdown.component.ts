import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { UserProfilePictureComponent } from 'src/app/users/components/user-profile-picture/user-profile-picture.component';

@Component({
  host: { class: 'd-flex align-items-center ms-2 ms-lg-3', id: 'userDropdown'},
  selector: '[userDropdown]',
  templateUrl: './user-dropdown.component.html',
  // template: ``,
  standalone: true,
  imports: [BootstrapModule, RouterModule, UserProfilePictureComponent],
})
export class UserDropdownComponent {
  service = inject(AccountService);
}
