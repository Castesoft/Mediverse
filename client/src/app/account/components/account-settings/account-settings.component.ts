import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Account } from 'src/app/_models/account';
import { LayoutModule } from 'src/app/_shared/layout.module';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [LayoutModule, RouterModule],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent {
  route = inject(ActivatedRoute);
  account: Account | null = null;

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.account = data['item'];
      }
    })
  }
}
