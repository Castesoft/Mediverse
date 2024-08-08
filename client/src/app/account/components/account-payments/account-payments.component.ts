import { Component, inject } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Account } from 'src/app/_models/account';
import { LayoutModule } from 'src/app/_shared/layout.module';

@Component({
  selector: 'app-account-payments',
  standalone: true,
  imports: [LayoutModule, RouterModule],
  templateUrl: './account-payments.component.html',
  styleUrl: './account-payments.component.scss'
})
export class AccountPaymentsComponent {
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
