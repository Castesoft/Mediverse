import { Component, inject, output } from '@angular/core';
import { AccountService } from 'src/app/_services/account.service';
import { LayoutModule } from 'src/app/_shared/layout.module';

@Component({
  selector: 'app-card-notifications',
  standalone: true,
  imports: [LayoutModule],
  templateUrl: './card-notifications.component.html',
  styleUrl: './card-notifications.component.scss'
})
export class CardNotificationsComponent {
  accountService = inject(AccountService);
  onSelectSection = output<string>();

  selectSection(section: string) {
    this.onSelectSection.emit(section);
  }
}
